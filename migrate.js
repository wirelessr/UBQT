const { conn, initSequelize } = require("./db");
const config = require("./config");
initSequelize(config.rdb);
require("./model");
conn.rdb.sync({ force: true }).catch((err) => {
  console.log(err);
});
