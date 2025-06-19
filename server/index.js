// CLI : npm install express body - parser --save
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 15; // Tăng giới hạn lên 15

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
// middlewares
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10 mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10 mb" }));
// apis
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});
app.use("/api/admin", require("./api/admin.js"));

app.use("/api/customer", require("./api/customer.js"));
