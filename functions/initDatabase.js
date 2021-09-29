const Datastore = require("nedb-promises");

const respuestasDB = Datastore.create({ filename: "./db/respuestas.db", autoload: true });
respuestasDB.persistence.setAutocompactionInterval(86_400_000); // Compacts database every day
module.exports.respuestasDB = respuestasDB;
