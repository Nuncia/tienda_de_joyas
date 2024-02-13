const pool = require ('../config/db');
const format = require ('pg-format');


// CONSULTAS CON ORDENAMIENTO Y LIMITES
const obtenerDatosOrdenamiento = async ({limit = 3, order_by = "stock_ASC", page = 1}) => {
    const [campo,direccion] = order_by.split("_");
    const offset = (page - 1) * limit;
    const formatQuery = format('SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s', campo, direccion, limit, offset);

    const {rows} = await pool.query(formatQuery);
    return rows
}



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

    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
        consulta += " WHERE " + filtros.join(" AND ");
    }

    const { rows } = await pool.query(consulta, valores);
    return rows;
};

// const hateoas = (joyas) => {
//     const results = joyas.map((joya) => {
//         return {
//             id: joya.id,
//             name: joya.name,
//             href: `http://localhost:3000/joyas/${joya.id}`,
//         }
//     }).slice(0, 5);
//     const total = joyas.length;
//     const hateoas = {
//         total,
//         results
//     }
//     return hateoas
// }

const HATEOAS = (joyas) => {
    const results = joyas.map((joya) => {
        return {
             name: joya.nombre,
             id: joya.id,
             href: `joyas/${joya.id}`,
        }
    }).slice(0, 4)
    const total = joyas.length
    const HATEOAS = {
    total,
    results
    }
    return HATEOAS
    }
    

module.exports = {
    obtenerDatosOrdenamiento,
    filtro,
    HATEOAS
}