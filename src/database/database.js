/*import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('Date','postgres', 'ale',{
    host: 'localhost',
    dialect: 'postgres'
})
 */

import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

/* const proConfig = {
  connectionString: process.env.DATABASE_URL,
}; */

const config = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

let sequelize;
process.env.NODE_ENV === "production"
  ? (sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }))
  : (sequelize = new Sequelize(config));

if (process.env.DATABASE_URL === undefined)
  console.log(colors.black.bgRed("En la capa de desarrollo"));
else console.log(process.env.DATABASE_URL, "DATABASE URI");

export default { sequelize }; 