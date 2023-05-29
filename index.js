const { listenDiamond } = require("./utils/helpers/ethers.helper/event.helper");
const { timeSerializer } = require("./utils/helpers/index.helper/index.helper");
require("dotenv").config();

async function main() {
  const currentDate = new Date().getTime();
  const timestamp = timeSerializer(currentDate);
  console.log(timestamp);
  listenDiamond();
}

main();
