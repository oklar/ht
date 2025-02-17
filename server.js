const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const app = express();

// Live reload setup
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + "/public");

app.use(connectLivereload());
app.use(express.static("public"));

app.patch("/item", (req, res) => {
  console.log("patch", req);
  res.send("<h1>/patch</h1>");
});

app.delete("/item", (req, res) => {
  console.log("delete", req);
  res.send("<h1>/delete</h1>");
});

app.put("/item", (req, res) => {
  console.log("put", req.body);
  res.send("<h1>/put</h1>");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

// Notify browser when files change
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
