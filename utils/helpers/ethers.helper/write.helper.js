const { ethers } = require("ethers");
const {
  addressUSDFI,
} = require("../../constants/adresses/addressesFI/addressesFI");

const rebase = async (addressFiAsset = addressUSDFI) => {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://opt-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`
    );
    const signer = new ethers.Wallet(process.env.SECRET_KEY, provider);
    const diamond_Contract = await new ethers.Contract(
      addressDiamond,
      abiDiamond,
      signer
    );
    await diamond_Contract.rebase(addressFiAsset);
  } catch (error) {
    throw Error("toggleWhitelist failed: " + error);
  }
};

module.exports = {
  rebase,
};
