const { createPool } = require("mysql");
require("dotenv").config();

const pool = createPool({
  host: process.env.Host,
  user: process.env.User,
  password: process.env.Password,
  database: process.env.Database,
  connectionLimit: 10,
});

const insert = (
  day,
  yieldUSDFI,
  yieldETHFI,
  yieldBTCFI,
  rCPTUSDFI,
  rCPTETHFI,
  rCPTBTCFI,
  feeUSDFI,
  feeETHFI,
  feeBTCFI
) => {
  pool.query(
    `INSERT INTO graph (day,amountUSDFI,amountETHFI,amountBTCFI, rCPTUSDFI, rCPTETHFI, rCPTBTCFI, feeUSDFI, feeETHFI, feeBTCFI) 
    VALUES (${day},${yieldUSDFI},${yieldETHFI},${yieldBTCFI}, ${rCPTUSDFI}, ${rCPTETHFI}, ${rCPTBTCFI},${feeUSDFI}, ${feeETHFI}, ${feeBTCFI} )`,
    (err, result, fields) => {
      if (err) {
        return console.error(err);
      }
      console.log(result.message);
    }
  );
};

const addYield = (
  day,
  yieldUSDFI,
  yieldETHFI,
  yieldBTCFI,
  rCPTUSDFI,
  rCPTETHFI,
  rCPTBTCFI,
  feeUSDFI,
  feeETHFI,
  feeBTCFI
) => {
  pool.query(
    `UPDATE graph 
      set amountUSDFI= amountUSDFI + ${yieldUSDFI}, amountETHFI= amountETHFI + ${yieldETHFI}, amountBTCFI= amountBTCFI + ${yieldBTCFI},
      rCPTUSDFI=${rCPTUSDFI}, rCPTETHFI=${rCPTETHFI}, rCPTBTCFI=${rCPTBTCFI},
      feeUSDFI=feeUSDFI+${feeUSDFI}, feeETHFI=feeETHFI+${feeETHFI}, feeBTCFI=feeBTCFI+${feeBTCFI} 
      where day=${day}`,
    (err, result, fields) => {
      if (err) {
        return console.error(err);
      }
      console.log(result.message);
    }
  );
};

module.exports = {
  insert,
  addYield,
};
