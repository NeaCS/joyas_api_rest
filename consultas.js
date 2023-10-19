const { Pool } = require("pg");
const format = require("pg-format");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "naldi1291",
  database: "joyas",
  allowExitOnIdle: true,
});



const ObtenerJoyas = async ({
  limits = 3,
  order_by = "stock_ASC",
  page = 0,
}) => {
  try {
    const offset = page * limits;
    const [campo, direccion] = order_by.split("_");

    const formattedQuery = format(
      "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
      campo,
      direccion,
      limits,
      offset
    );

    const { rows: joyas } = await pool.query(formattedQuery);
    console.log(joyas);

    //  HATEOAS
    const results = joyas.map((j) => ({
      nombre: j.nombre,
      href: `/joyas/${j.id}`,
    }));

    const total = joyas.length;

    const HATEOAS = {
      total,
      results,
    };

    return HATEOAS;
  } catch (error) {
    console.error(error);
  }
};

const ObtenerJoyasConFiltros = async ({precio_min, precio_max, categoria, metal}) => {
    let filtros = [];
    const values = [];

    const agregarFiltro = (campo, comparador, valor) => {
      values.push(valor);
      const { length } = filtros;
      filtros.push(`${campo} ${comparador} $${length + 1}`);
    };

    if (precio_min) agregarFiltro('precio', '>=', precio_min);
    if (precio_max) agregarFiltro('precio', '<=', precio_max);
    if (categoria) agregarFiltro('categoria', '=', categoria);
    if (metal) agregarFiltro('metal', '=', metal);

    let consulta = 'SELECT * FROM inventario';

    if (filtros.length > 0) {
        filtros = filtros.join(' AND ')
      consulta += ` WHERE ${filtros}`;
    }

    const { rows: joyas } = await pool.query(consulta, values);
    return(joyas);
}

module.exports = {
  ObtenerJoyas,
  ObtenerJoyasConFiltros
};
