import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('Date','postgres', 'ale',{
    host: 'localhost',
    dialect: 'postgres'
})