const { listenDiamond } = require("./utils/helpers/ethers.helper/event.helper");

const { addYield } = require("./utils/helpers/sql.helper/sql.helper");
require("dotenv").config();

async function main() {
  listenDiamond();
}

main();
