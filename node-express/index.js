const express = require("express");
const http = require("http");
const dishRouter = require("./routes/dishRouter");
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require("./routes/leaderRouter")
const morgan = require("morgan");
const bodyParser = require("body-parser");

const port = 3000;
const hostname = "localhost";
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

const server = http.createServer(app);
server.listen(port, hostname, () => {
  {
    console.log(`Sever running at http://${hostname}:${port}/`);
  }
});
