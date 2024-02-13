const express = require('express');
const router = express.Router();

const {
   obtenerDatosOrdenamiento,
   obtenerJoyasFiltradas,
} = require('../routes/consultas.js');

router.get('/joyas', async (req, res) => {
   try {
      const queryString = req.query;
      const resultados = await obtenerDatosOrdenamiento(queryString);
      res.json(resultados);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

router.get('/joyas/filtros', async (req, res) => {
   try {
      const queryString = req.query;
      const rows = await obtenerJoyasFiltradas(queryString);
      const hateoas = await HATEOAS(rows);
      res.json(hateoas);
   } catch (error) {
      res.status(500).json({ error: `Error interno: ${error}` });
   }
});

module.exports = router;
