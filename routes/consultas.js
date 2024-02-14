const pool = require('../config/db');
const format = require('pg-format');

// CONSULTAS CON ORDENAMIENTO Y LIMITES
const obtenerDatosOrdenamiento = async ({
   limit = 3,
   order_by = 'stock_ASC',
   page = 1,
}) => {
   const [campo, direccion] = order_by.split('_');
   const offset = (page - 1) * limit;
   const formatQuery = format(
      'SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s',
      campo,
      direccion,
      limit,
      offset
   );

   const { rows } = await pool.query(formatQuery);
   return rows;
};

const filtro = async ({ precio_min, precio_max, categoria, metal }) => {
   let filtros = [];
   let valores = [];

   if (precio_max) {
      filtros.push(`precio <= $${valores.length + 1}`);
      valores.push(precio_max);
   }
   if (precio_min) {
      filtros.push(`precio >= $${valores.length + 1}`);
      valores.push(precio_min);
   }
   if (categoria) {
      filtros.push(`categoria = $${valores.length + 1}`);
      valores.push(categoria);
   }
   if (metal) {
      filtros.push(`metal = $${valores.length + 1}`);
      valores.push(metal);
   }

   let consulta = 'SELECT * FROM inventario';
   if (filtros.length > 0) {
      consulta += ' WHERE ' + filtros.join(' AND ');
   }

   const { rows } = await pool.query(consulta, valores);
   return rows;
};

const HATEOAS = (joyas) => {
   const results = joyas
      .map((joya) => {
         return {
            name: joya.nombre,
            id: joya.id,
            href: `joyas/${joya.id}`,
         };
      })
      .slice(0, 4);
   const total = joyas.length;
   const HATEOAS = {
      total,
      results,
   };
   return HATEOAS;
};

const obtenerJoyasFiltradas = async ({
   precio_max,
   precio_min,
   categoria,
   metal,
}) => {
   let filtros = [];
   const values = [];

   const agregarFiltros = (campo, comparador, valor) => {
      values.push(valor);
      let { length } = filtros;
      filtros.push(`${campo} ${comparador} $${length + 1}`);
   };

   try {
      const filtrosValidados = validarFiltros(
         precio_max,
         precio_min,
         categoria,
         metal
      );

      if (!filtrosValidados.error) {
         const { precioMax, precioMin, categoria, metal } =
            filtrosValidados.datos;
         if (precioMin) agregarFiltros('precio', '>=', precioMin);
         if (precioMax) agregarFiltros('precio', '<=', precioMax);
         if (categoria) agregarFiltros('categoria', '=', categoria);
         if (metal) agregarFiltros('metal', '=', metal);

         let consulta = 'SELECT * FROM inventario';

         if (filtros.length > 0) {
            filtros = filtros.join(` AND `);
            consulta += ` WHERE ${filtros}`;
         }
         //  console.log(consulta, values);
         const { rowCount, rows } = await pool.query(consulta, values);
         console.log(rows);
         return rows;
      } else {
         return filtrosValidados;
      }
   } catch (error) {
      throw new Error(error);
   }
};
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

module.exports = {
   obtenerDatosOrdenamiento,
   obtenerJoyasFiltradas,
   filtro,
   HATEOAS,
};
