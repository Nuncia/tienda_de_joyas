const express = require('express');
const router = express.Router();


const  {obtenerDatosOrdenamiento,filtro,HATEOAS} = require ('../routes/consultas.js')

router.get ('/joyas', async (req, res) => {
    try {
        const queryString = req.query;
        const resultados = await obtenerDatosOrdenamiento(queryString);
        const hateoas = await HATEOAS(resultados);
        res.json(hateoas);
        
    } catch (error) {
        res.status(500).json({error: error.message})
 
    }
}) 


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

module.exports = router;

