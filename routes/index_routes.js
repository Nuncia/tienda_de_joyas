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
      console.log(queryString);
      const { rows: joyas } = await obtenerJoyasFiltradas(queryString);
      const resultado = {
         status: 'success request',
         msg: 'Busqueda exitosa',
         data: joyas,
         error: false,
      };
      res.status(200).json(resultado);
   } catch (error) {
      res.status(500).json({ error: `Error interno: ${error}` });
   }
});

const validarFiltros = (precio_max, precio_min, categoria, metal) => {
   const precioMax = Number.parseInt(precio_max);
   const precioMin = Number.parseInt(precio_min);
   console.log(precioMax, precioMin, categoria, metal);
   if (
      typeof precioMax === 'number' &&
      typeof precioMin === 'number' &&
      typeof categoria === 'string' &&
      typeof metal === 'string'
   ) {
      const respuesta = {
         status: 'Datos validos',
         msg: 'Tipos de datos validos',
         datos: { precioMax, precioMin, categoria, metal },
         error: false,
      };
      return respuesta;
   } else {
      const respuesta = {
         status: 'Bad request',
         msg: 'Tipo de dato incorrecto ',
         datos: [],
         error: true,
      };
      return respuesta;
   }
};

module.exports = router;
