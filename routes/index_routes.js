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


router.get ('/joyas/filtros', async (req, res) => {
    try {
        const queryString = req.query;
        const resultados = await filtro(queryString);
        res.json(resultados);
        
    } catch (error) {
        res.status(500).json({error: error.message})
 
    }
})


module.exports = router