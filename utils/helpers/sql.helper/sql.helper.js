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
      rCPTUSDFI= ${rCPTUSDFI === 0 ? "rCPTUSDFI" : rCPTUSDFI}, rCPTETHFI= ${
      rCPTETHFI === 0 ? "rCPTETHFI" : rCPTETHFI
    }, rCPTBTCFI=${
      rCPTBTCFI === 0 ? "rCPTBTCFI" : rCPTBTCFI
    },feeUSDFI=feeUSDFI+${feeUSDFI}, feeETHFI=feeETHFI+${feeETHFI}, feeBTCFI=feeBTCFI+${feeBTCFI} 
      where day=${day}`,
    (err, result, fields) => {
      if (err) {
        return console.error(err);
      }
      console.log(result.message);
    }
  );
};

const addDeposit = (wallet, depositUSDFI, depositETHFI, depositBTCFI) => {
  pool.query(
    `UPDATE walletData 
      set depositUSDFI= depositUSDFI + ${depositUSDFI} , depositETHFI= depositETHFI + ${depositETHFI} , depositBTCFI= depositBTCFI + ${depositBTCFI}
      where wallet='${wallet}'`,
    (err, result, fields) => {
      if (err) {
        return console.error(err);
      }
      console.log(result.message);
    }
  );
};

const addWithdraw = (wallet, withdrawUSDFI, withdrawETHFI, withdrawBTCFI) => {
  pool.query(
    `UPDATE walletData  set depositUSDFI= depositUSDFI - ${withdrawUSDFI} , depositETHFI= depositETHFI - ${withdrawETHFI} , depositBTCFI= depositBTCFI - ${withdrawBTCFI} where wallet='${wallet}'`,
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
  addDeposit,
  addWithdraw,
};
