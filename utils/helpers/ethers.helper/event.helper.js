const { ethers } = require("ethers");
const {
  addressDiamond,
  blockDeploy,
} = require("../../../utils/constants/adresses/diamond");
const { abiDiamond } = require("../../../utils/constants/abis/diamond");
const { abiUSDC } = require("../../../utils/constants/abis/usdc");

const {
  addressUSDFI,
  addressBTCFI,
  addressETHFI,
  addressETH,
  addressBTC,
  addressUSDC,
} = require("../../../utils/constants/adresses/addressesFI/addressesFI");

const {
  addYieldToday,
  getBlockData,
  timeSerializer,
} = require("../index.helper/index.helper");
const {
  addYield,
  addDeposit,
  addWithdraw,
} = require("../sql.helper/sql.helper");
require("dotenv").config();

const listenDiamond = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://opt-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`
    );
    const diamond_Contract = new ethers.Contract(
      addressDiamond,
      abiDiamond,
      provider
    );

    diamond_Contract.on("*", (...args) => {
      if (args[0].log.fragment.name === "Withdraw") {
        const [asset, amount, depositFrom, fee] = args[0].log.args;
        addWithdraw(
          depositFrom,
          asset === addressUSDC ? ethers.formatUnits(amount, 18) : 0,
          asset === addressETH ? ethers.formatUnits(amount, 18) : 0,
          asset === addressBTC ? ethers.formatUnits(amount, 18) : 0
        );
      }
      if (args[0].log.fragment.name === "Deposit") {
        const [asset, amount, depositFrom, fee] = args[0].log.args;
        addDeposit(
          depositFrom,
          asset === addressUSDC
            ? ethers.formatUnits(amount, 6) - ethers.formatUnits(fee, 18)
            : 0,
          asset === addressETH ? ethers.formatUnits(amount - fee, 18) : 0,
          asset === addressBTC
            ? ethers.formatUnits(amount, 8) - ethers.formatUnits(fee, 18)
            : 0
        );
      }
      if (args[0].log.fragment.name === "TotalSupplyUpdated") {
        const [fiAsset, assets, yield, rCPT, fee] = args[0].log.args;
        addYieldToday(
          fiAsset === addressUSDFI ? ethers.formatUnits(yield, 18) : 0,
          fiAsset === addressETHFI ? ethers.formatUnits(yield, 18) : 0,
          fiAsset === addressBTCFI ? ethers.formatUnits(yield, 18) : 0,
          fiAsset === addressUSDFI ? ethers.formatUnits(rCPT, 18) : 0,
          fiAsset === addressETHFI ? ethers.formatUnits(rCPT, 18) : 0,
          fiAsset === addressBTCFI ? ethers.formatUnits(rCPT, 18) : 0,
          fiAsset === addressUSDFI ? ethers.formatUnits(fee, 18) : 0,
          fiAsset === addressETHFI ? ethers.formatUnits(fee, 18) : 0,
          fiAsset === addressBTCFI ? ethers.formatUnits(fee, 18) : 0
        );
      }
    });
  } catch (error) {
    throw error("listenDiamond failed: " + error);
  }
};

const getPastEvents = async () => {
  const provider = new ethers.JsonRpcProvider(
    `https://opt-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`
  );
  const diamond_Contract = new ethers.Contract(
    addressDiamond,
    abiDiamond,
    provider
  );
  const pastEvents = await diamond_Contract.queryFilter(
    "TotalSupplyUpdated",
    blockDeploy
  );
  return pastEvents;
};

const fillInDBPastEventsData = async () => {
  const pastEvents = await getPastEvents();
  pastEvents.forEach((pastEvent) => {
    getBlockData(pastEvent.blockNumber).then((blockData) => {
      const offset = 120 * 60;

      addYield(
        timeSerializer(blockData.timestamp * 1000) + offset,
        pastEvent.args[0] === addressUSDFI
          ? ethers.formatUnits(pastEvent.args[2], 18)
          : 0,
        pastEvent.args[0] === addressETHFI
          ? ethers.formatUnits(pastEvent.args[2], 18)
          : 0,
        pastEvent.args[0] === addressBTCFI
          ? ethers.formatUnits(pastEvent.args[2], 18)
          : 0,
        pastEvent.args[0] === addressUSDFI
          ? ethers.formatUnits(pastEvent.args[3], 18)
          : 0,
        pastEvent.args[0] === addressETHFI
          ? ethers.formatUnits(pastEvent.args[3], 18)
          : 0,
        pastEvent.args[0] === addressBTCFI
          ? ethers.formatUnits(pastEvent.args[3], 18)
          : 0,
        pastEvent.args[0] === addressUSDFI
          ? ethers.formatUnits(pastEvent.args[4], 18)
          : 0,
        pastEvent.args[0] === addressETHFI
          ? ethers.formatUnits(pastEvent.args[4], 18)
          : 0,
        pastEvent.args[0] === addressBTCFI
          ? ethers.formatUnits(pastEvent.args[4], 18)
          : 0
      );
    });
  });
};

const listenUsdc = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://opt-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`
    );

    const usdc_Contract = new ethers.Contract(addressUSDC, abiUSDC, provider);

    usdc_Contract.on("Transfer", (from, to, value, event) => {
      let info = {
        from: from,
        to: to,
        value: ethers.formatUnits(value, 6),
        data: event,
      };
    });
  } catch (error) {
    throw error("listenUsdc failed: " + error);
  }
};

module.exports = {
  listenDiamond,
  getPastEvents,
  fillInDBPastEventsData,
};
