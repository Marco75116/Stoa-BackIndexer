const { ethers, Interface } = require("ethers");
const { insert, addYield } = require("../sql.helper/sql.helper");
const { blockDeploy } = require("../../constants/adresses/diamond");
require("dotenv").config();

const convertAbi = () => {
  try {
    // enter here view,write & event that you want to convert from Human-Readable ABI to Solidity JSON ABI
    const humanReadableAbi = [
      "event TotalSupplyUpdated(address indexed fiAsset, uint256 assets, uint256 yield, uint256 rCPT, uint256 fee)",
      "event Deposit(address indexed asset, uint256 amount, address indexed depositFrom, uint256 fee)",
      "event Withdraw(address indexed asset, uint256 amount, address indexed depositFrom, uint256 fee)",
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
  const blockDeployNumber = await getBlockData(blockDeploy);
  const offset = 120 * 60;
  const timestampDeployment =
    timeSerializer(blockDeployNumber.timestamp * 1000) + offset;
  const secsInDay = 86400;
  var i = 0;
  setInterval(() => {
    insert(timestampDeployment + i * secsInDay, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    i += 1;
  }, 1000);
};

const addYieldToday = async (
  amountYieldUSDFI,
  amountYieldETHFI,
  amountYieldBTCFI,
  rCPTUSDFI,
  rCPTETHFI,
  rCPTBTCFI,
  feeUSDFI,
  feeETHFI,
  feeBTCFI
) => {
  const currentDate = new Date().getTime();
  const offset = 120 * 60;
  const timestamp = timeSerializer(currentDate) + offset;
  addYield(
    timestamp,
    amountYieldUSDFI,
    amountYieldETHFI,
    amountYieldBTCFI,
    rCPTUSDFI,
    rCPTETHFI,
    rCPTBTCFI,
    feeUSDFI,
    feeETHFI,
    feeBTCFI
  );
};

module.exports = {
  convertAbi,
  timeSerializer,
  getBlockData,
  preSetupGraphTable,
  addYieldToday,
};
