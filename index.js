const { insert } = require("./utils/helpers/sql.helper/sql.helper");
const { ethers } = require("ethers");
const {
  timeSerializer,
  preSetupGraphTable,
  addYieldToday,
} = require("./utils/helpers/index.helper/index.helper");
const { listenDiamond } = require("./utils/helpers/ethers.helper/event.helper");
const { addressDiamond } = require("./utils/constants/adresses/diamond");
const { abiDiamond } = require("./utils/constants/abis/diamond");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(
    `https://arb-goerli.g.alchemy.com/v2/${process.env.API_KEY}`
  );
  const diamond_Contract = new ethers.Contract(
    addressDiamond,
    [
      "event TotalSupplyUpdated(address indexed fiAsset, uint256 assets, uint256 yield)",
    ],
    provider
  );
  diamond_Contract.on("TotalSupplyUpdated", (fiAsset, assets, yield, event) => {
    let info = {
      fiAsset: fiAsset,
      assets: ethers.formatUnits(assets, 18),
      yield: ethers.formatUnits(yield, 18),
      // data: event,
    };
    addYieldToday(info.yield);
  });
}

main();
