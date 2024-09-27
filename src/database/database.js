import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { NODE_ENV, DATABASE_URL } = process.env;

let sequelize;
if (NODE_ENV === "production" && DATABASE_URL) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Importante para conexiones sin verificación de certificados
      },
    },
  });
} else {
  // Configuración para desarrollo o entornos no productivos
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;
  const config = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  sequelize = new Sequelize(config, {
    dialect: "postgres",
  });
}

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.".green);
  })
  .catch((err) => {
    console.error("Unable to connect to the database:".red, err);
  });

export { sequelize };
