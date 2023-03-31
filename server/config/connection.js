const mongoose = require("mongoose");
// const db = require("./config");
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/googlebooks", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
