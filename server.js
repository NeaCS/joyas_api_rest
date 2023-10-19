const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const { ObtenerJoyas, ObtenerJoyasConFiltros } = require("./consultas");
app.use(cors());
app.use(express.json());
app.listen(port, console.log("servidor encendido en 3001"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal");
});

const reporteDeConsulta = (req, res, next) => { 
    
    console.log(`Hoy ${new Date()} se realizó una consulta a la siguiente url ${req.url}`)
    next()
}

// GET /joyas
app.get("/joyas", reporteDeConsulta, async (req, res) => {
  try {
    const queryStrings = req.query;
    const joyas = await ObtenerJoyas(queryStrings);
    res.send(joyas)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la consulta." });
  }
});

// Ruta GET /joyas/filtros
app.get('/joyas/filtros', async (req, res) => {
    try {
      const queryStrings = req.query;
     const joyas = await ObtenerJoyasConFiltros(queryStrings);
     res.send(joyas)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en la consulta.' });
    }
  });

  app.get('*', (req, res) => {
    res.status(404).send('Esta ruta no existe');
  });
