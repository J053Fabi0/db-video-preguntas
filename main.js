require("dotenv").config();
const { respuestasDB } = require("./functions/initDatabase");

// Añadir valores a la base de datos si no existen
(async () => {
  const usuarios_totales = await respuestasDB.findOne({ _id: "usuarios_totales" });
  if (!usuarios_totales) await respuestasDB.insert({ _id: "usuarios_totales", usuarios_totales: 0 });

  const usuarios_que_terminaron = await respuestasDB.findOne({ _id: "usuarios_que_terminaron" });
  if (!usuarios_que_terminaron)
    await respuestasDB.insert({ _id: "usuarios_que_terminaron", usuarios_que_terminaron: 0 });
})();

const keepOn = () => setTimeout(() => keepOn(), parseInt("1".repeat(31), 2)); // 31 bits is the max number of ms
keepOn();

const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(routes);

const ip = require("ip");
const activateServer = (port) =>
  app
    .listen(port, () => console.log(`Server on http://${ip.address()}:${port}`))
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log("Error EADDRINUSE on port " + port);
        activateServer(port + 1);
      }
    });
activateServer(3015);
