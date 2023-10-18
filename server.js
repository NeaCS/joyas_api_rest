const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const { ObtenerJoyas } = require("./consultas");
app.use(cors());
app.use(express.json());
app.listen(port, console.log("servidor encendido en 3001"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal");
});

// GET /joyas
app.get("/joyas", async (req, res) => {
  try {
    const queryStrings = req.query;
    const joyas = await ObtenerJoyas(queryStrings);
    res.send(joyas)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la consulta." });
  }
});
