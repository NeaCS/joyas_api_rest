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

module.exports = {
  ObtenerJoyas,
};
