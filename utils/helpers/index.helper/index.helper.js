const { ethers, Interface } = require("ethers");
const { insert, addYield } = require("../sql.helper/sql.helper");
require("dotenv").config();

const convertAbi = () => {
  try {
    // enter here view,write & event that you want to convert from Human-Readable ABI to Solidity JSON ABI
    const humanReadableAbi = [
      "event TotalSupplyUpdatedHighres(uint256 totalSupply,uint256 rebasingCredits,uint256 rebasingCreditsPerToken,uint256 earnings)",
      "event TotalSupplyUpdated(address indexed fiAsset, uint256 assets, uint256 yield)",
    ];

    const iface = new Interface(humanReadableAbi);

    console.log(JSON.stringify(iface.fragments, null, 2));
  } catch (error) {
    throw error("convertAbi failed : " + error);
  }
};

const timeSerializer = (currentTimestamp) => {
  const currentDate = new Date(currentTimestamp);
  currentDate.setHours(0, 0, 0, 0);
  const timestamp = Math.floor(currentDate.getTime() / 1000);

  return timestamp;
};

const getBlockData = async (blockNumber) => {
  const provider = new ethers.JsonRpcProvider(
    `https://arb-goerli.g.alchemy.com/v2/${process.env.API_KEY}`
  );
  const block = await provider.getBlock(blockNumber);
  return block;
};

const preSetupGraphTable = async () => {
  const blockDeploy = await getBlockData();
  const timestampDeployment = timeSerializer(blockDeploy.timestamp * 1000);
  const secsInDay = 86400;
  var i = 0;
  setInterval(() => {
    insert(timestampDeployment + i * secsInDay, 0, 0, 0);
    i += 1;
  }, 1000);
};

const addYieldToday = async (
  amountYieldUSDFI,
  amountYieldETHFI,
  amountYieldBTCFI
) => {
  const currentDate = new Date().getTime();
  const timestamp = timeSerializer(currentDate);
  addYield(timestamp, amountYieldUSDFI, amountYieldETHFI, amountYieldBTCFI);
};

module.exports = {
  convertAbi,
  timeSerializer,
  getBlockData,
  preSetupGraphTable,
  addYieldToday,
  addYield,
};
