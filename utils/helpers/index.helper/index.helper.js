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

const getBlockDeployement = async () => {
  const provider = new ethers.JsonRpcProvider(
    `https://arb-goerli.g.alchemy.com/v2/${process.env.API_KEY}`
  );
  const nbBlockDeploy = 20747960;
  const block = await provider.getBlock(nbBlockDeploy);
  return block;
};

const preSetupGraphTable = async (amountDay) => {
  const blockDeploy = await getBlockDeployement();
  const timestampDeployment = timeSerializer(blockDeploy.timestamp * 1000);
  const secsInDay = 84600;
  for (let i = 0; i < amountDay; i++) {
    insert(timestampDeployment + i * secsInDay, 0);
  }
};

const addYieldToday = async (amountYield) => {
  const currentDate = new Date().getTime() / 1000;
  const timestamp = timeSerializer(currentDate);
  addYield(timestamp, amountYield);
};

module.exports = {
  convertAbi,
  timeSerializer,
  getBlockDeployement,
  preSetupGraphTable,
  addYieldToday,
};
