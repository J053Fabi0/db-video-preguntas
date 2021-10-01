const { respuestasDB } = require("../functions/initDatabase");
const handleErr = (error, res) => {
  res.status(400).send({ error });
  console.log(error);
};

module.exports.getTodosLosDatos = async (_, res) => {
  try {
    const todosLosDatosArr = await respuestasDB.find({});
    const todosLosDatos = {};
    for (let dato of todosLosDatosArr) {
      if (dato.usuarios_totales !== undefined) {
        todosLosDatos["usuarios_totales"] = dato.usuarios_totales;
      } else if (dato.usuarios_que_terminaron !== undefined) {
        todosLosDatos["usuarios_que_terminaron"] = dato.usuarios_que_terminaron;
      } else {
        const { _id, ...datos } = dato;
        todosLosDatos[_id] = datos;
      }
    }
    return res.status(200).send({ message: todosLosDatos });
  } catch (err) {
    return handleErr(err, res);
  }
};

module.exports.getInfoUsuario = async ({ params: { id } }, res) => {
  try {
    const { _id, ...user } = await respuestasDB.findOne({ _id: id });
    return res.status(200).send({ message: user });
  } catch (err) {
    return handleErr(err, res);
  }
};

module.exports.getNumeroTotalUsuarios = async (_, res) => {
  try {
    const { usuarios_totales } = await respuestasDB.findOne({ _id: "usuarios_totales" });
    console.log(usuarios_totales, "usuarios_totales");
    return res.status(200).send({ message: usuarios_totales });
  } catch (err) {
    return handleErr(err, res);
  }
};

module.exports.getNumeroTotalUsuariosQueTerminaron = async (_, res) => {
  try {
    const { usuarios_que_terminaron } = await respuestasDB.findOne({ _id: "usuarios_que_terminaron" });
    return res.status(200).send({ message: usuarios_que_terminaron });
  } catch (err) {
    return handleErr(err, res);
  }
};

module.exports.setRespuesta = async ({ params: { id }, body }, res) => {
  // Revisar que tiene todos los valores necesarios el body
  if (body.tiempo === undefined && body.respuesta === undefined && body.esCorrecta === undefined)
    return res.status(418).send({ message: "Faltan los datos tiempo, respuesta o esCorrecta en el body." });

  const { tiempo, respuesta, esCorrecta } = body;

  // Revisar que los datos sean del valor esperado
  if (typeof tiempo !== "number") return res.status(418).send({ message: "Tiempo debe ser un número." });
  if (typeof respuesta !== "string")
    return res.status(418).send({ message: "Respuesta debe ser una cadena de caracteres." });
  if (typeof esCorrecta !== "boolean")
    return res.status(418).send({ message: "EsCorrecta debe ser un booleano." });

  try {
    // Revisar que el usuario existe
    const user = await respuestasDB.count({ _id: id });
    if (!user) {
      // Insertar el nuevo usuario
      await respuestasDB.insert({ _id: id, terminoVideo: false, respuestas: {} });
      // incrementar los usuarios totales
      await respuestasDB.update({ _id: "usuarios_totales" }, { $inc: { usuarios_totales: 1 } });
    }

    await respuestasDB.update(
      { _id: id },
      { $set: { [`respuestas.${tiempo}`]: { tiempo, respuesta, esCorrecta } } }
    );
    return res.status(200).send({ message: 1 });
  } catch (err) {
    return handleErr(err, res);
  }
};

module.exports.setTermino = async ({ params: { id } }, res) => {
  try {
    // Revisar que el usuario existe
    const user = await respuestasDB.count({ _id: id });
    if (!user) return res.status(418).send({ message: "El usuario no existe." });

    await respuestasDB.update({ _id: id }, { $set: { terminoVideo: true } });

    return res.status(200).send({ message: 1 });
  } catch (err) {
    return handleErr(err, res);
  }
};

module.exports.deleteUser = async ({ params: { id } }, res) => {
  try {
    await respuestasDB.remove({ _id: id });
    await respuestasDB.update({ _id: "usuarios_totales" }, { $inc: { usuarios_totales: -1 } });

    return res.status(200).send({ message: 1 });
  } catch (err) {
    return handleErr(err, res);
  }
};
