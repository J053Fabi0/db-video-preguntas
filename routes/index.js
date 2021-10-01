const express = require("express");
const respuestasControler = require("../controllers/respuestasController");

const router = express.Router();

router.get("/todosLosDatos", respuestasControler.getTodosLosDatos);
router.get("/infoUsuario/:id", respuestasControler.getInfoUsuario);
router.get("/numeroTotalUsuarios", respuestasControler.getNumeroTotalUsuarios);
router.get("/numeroTotalUsuariosQueTerminaron", respuestasControler.getNumeroTotalUsuariosQueTerminaron);

router.post("/termino/:id", respuestasControler.setTermino);
router.post("/respuesta/:id", respuestasControler.setRespuesta);

router.delete("/deleteUser/:id", respuestasControler.deleteUser);

module.exports = router;
