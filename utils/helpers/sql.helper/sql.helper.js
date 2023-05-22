const { createPool } = require("mysql");
require("dotenv").config();

const pool = createPool({
  host: process.env.Host,
  user: process.env.User,
  password: process.env.Password,
  database: process.env.Database,
  connectionLimit: 10,
});

const insert = (day, amount) => {
  pool.query(
    `INSERT INTO graph (day, amount) VALUES (${day},${amount})`,
    (err, result, fields) => {
      if (err) {
        return console.error(err);
      }
      console.log(result.message);
    }
  );
};

const addYield = (day, yield) => {
  pool.query(
    `UPDATE graph 
      set amount= amount + ${yield} where day=${day}`,
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
