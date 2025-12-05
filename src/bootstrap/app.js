require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");

const webRouter = require("../routes/web");
const apiRouter = require("../routes/api");
const { sessionConfig } = require("../config/session");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../resources/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionConfig));

const assetsRoot = path.join(__dirname, "../resources/assets");

app.use("/assets", express.static(assetsRoot));
app.use("/css", express.static(path.join(assetsRoot, "css")));
app.use("/js", express.static(path.join(assetsRoot, "js")));

app.use("/", webRouter);
app.use("/api", apiRouter);

module.exports = app;

