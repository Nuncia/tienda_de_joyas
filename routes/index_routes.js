const express = require('express');
const router = express.Router();

const {
   obtenerDatosOrdenamiento,
   filtro,
   obtenerJoyasFiltradas,
   HATEOAS,
} = require('../routes/consultas.js');

router.get('/joyas', async (req, res) => {
   try {
      const queryString = req.query;
      const resultados = await obtenerDatosOrdenamiento(queryString);
      const hateoas = await HATEOAS(resultados);
      res.json(hateoas);
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

// router.get('/joyas/:id', async (req, res) => {
//    const { id } = req.params;
//    console.log(id);
//    const row = await
// });

module.exports = router;
