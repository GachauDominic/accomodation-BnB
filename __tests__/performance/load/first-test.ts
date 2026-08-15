const http = require("k6/http");
const k6 = require("k6")

module.exports.options = {
  vus: 10,
  duration: "30s"
};

const port = '3000'

module.exports.default = function() {
  http.get(`http://localhost:${port}`);
  k6.sleep(1);
};