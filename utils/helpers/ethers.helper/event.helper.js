const { ethers, Interface } = require("ethers");
const { addressDiamond } = require("../../../utils/constants/adresses/diamond");
const { abiDiamond } = require("../../../utils/constants/abis/diamond");
const { abiUSDC } = require("../../../utils/constants/abis/usdc");
const { addressUSDC } = require("../../../utils/constants/adresses/usdc");
const { addYieldToday } = require("../index.helper/index.helper");
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
        addYieldToday(info.yield);
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
        value: ethers.formatUnits(value, 18),
        data: event,
      };
    });

    //   usdc_Contract.on("*", (log, evt) => {
    //   });
  } catch (error) {
    throw error("listenUsdc failed: " + error);
  }
};

module.exports = {
  listenDiamond,
};
