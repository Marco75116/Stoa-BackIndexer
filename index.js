const { listenDiamond } = require("./utils/helpers/ethers.helper/event.helper");
require("dotenv").config();

async function main() {
  console.log("In");
  listenDiamond();
}

main();
