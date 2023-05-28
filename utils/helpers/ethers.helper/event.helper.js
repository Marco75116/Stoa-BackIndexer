const { ethers, Interface } = require("ethers");
const { addressDiamond } = require("../../../utils/constants/adresses/diamond");
const { abiDiamond } = require("../../../utils/constants/abis/diamond");
const { abiUSDC } = require("../../../utils/constants/abis/usdc");
const { addressUSDC } = require("../../../utils/constants/adresses/usdc");
const {
  addressUSDFI,
  addressBTCFI,
  addressETHFI,
} = require("../../../utils/constants/adresses/addressesFI/addressesFI");

const {
  addYieldToday,
  getBlockData,
  timeSerializer,
  addYield,
} = require("../index.helper/index.helper");
require("dotenv").config();

const listenDiamond = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://arb-goerli.g.alchemy.com/v2/${process.env.API_KEY}`
    );
    const diamond_Contract = new ethers.Contract(
      addressDiamond,
      abiDiamond,
      provider
    );

    // diamond_Contract.on("Mint", (fiAsset, amount, from, event) => {
    //   let info = {
    //     fiAsset: fiAsset,
    //     amount: ethers.formatUnits(amount, 18),
    //     from: from,
    //     data: event,
    //   };
    // });

    diamond_Contract.on(
      "TotalSupplyUpdated",
      (fiAsset, assets, yield, event) => {
        let info = {
          fiAsset: fiAsset,
          assets: ethers.formatUnits(assets, 18),
          yield: ethers.formatUnits(yield, 18),
          // data: event,
        };
        addYieldToday(
          pastEvent.args[0] === addressUSDFI
            ? ethers.formatUnits(pastEvent.args[2], 18)
            : 0,
          pastEvent.args[0] === addressETHFI
            ? ethers.formatUnits(pastEvent.args[2], 18)
            : 0,
          pastEvent.args[0] === addressBTCFI
            ? ethers.formatUnits(pastEvent.args[2], 18)
            : 0
        );
      }
    );

    // diamond_Contract.on(
    //   "TotalSupplyUpdatedHighres",
    //   (
    //     totalSupply,
    //     rebasingCredits,
    //     rebasingCreditsPerToken,
    //     earnings,
    //     event
    //   ) => {
    //     let info = {
    //       totalSupply: ethers.formatUnits(totalSupply, 18),
    //       rebasingCredits: ethers.formatUnits(rebasingCredits, 18),
    //       rebasingCreditsPerToken: ethers.formatUnits(
    //         rebasingCreditsPerToken,
    //         18
    //       ),
    //       earnings: ethers.formatUnits(earnings, 18),
    //       data: event,
    //     };
    //   }
    // );

    // diamond_Contract.on("*", (log, event) => {
    // });
  } catch (error) {
    throw error("listenDiamond failed: " + error);
  }
};

const getPastEvents = async () => {
  const provider = new ethers.JsonRpcProvider(
    `https://arb-goerli.g.alchemy.com/v2/${process.env.API_KEY}`
  );
  const diamond_Contract = new ethers.Contract(
    addressDiamond,
    abiDiamond,
    provider
  );
  const pastEvents = await diamond_Contract.queryFilter(
    "TotalSupplyUpdated",
    20747960
  );
  return pastEvents;
};

const fillInDBPastEventsData = async () => {
  const pastEvents = await getPastEvents();
  pastEvents.forEach((pastEvent) => {
    getBlockData(pastEvent.blockNumber).then((blockData) => {
      addYield(
        timeSerializer(blockData.timestamp * 1000),
        pastEvent.args[0] === addressUSDFI
          ? ethers.formatUnits(pastEvent.args[2], 18)
          : 0,
        pastEvent.args[0] === addressETHFI
          ? ethers.formatUnits(pastEvent.args[2], 18)
          : 0,
        pastEvent.args[0] === addressBTCFI
          ? ethers.formatUnits(pastEvent.args[2], 18)
          : 0
      );
    });
  });
};

const listenUsdc = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://arb-goerli.g.alchemy.com/v2/${process.env.API_KEY}`
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
