const express = require('express');
const router = express.Router();

router.get ('/joyas', (req, res) => {
    res.send('Hola, esta es una prueba');
})

module.exports = router