const pool = require('../config/db');
const format = require('pg-format');

// CONSULTAS CON ORDENAMIENTO Y LIMITES
const obtenerDatosOrdenamiento = async ({
   limit = 3,
   order_by = 'stock_ASC',
}) => {
   const [campo, direccion] = order_by.split('_');
   const formatQuery = format(
      'SELECT * FROM inventario order by %s %s LIMIT %s',
      campo,
      direccion,
      limit
   );

   const { rows } = await pool.query(formatQuery);
   return rows;
};

module.exports = {
   obtenerDatosOrdenamiento,
   obtenerJoyasFiltradas,
};
