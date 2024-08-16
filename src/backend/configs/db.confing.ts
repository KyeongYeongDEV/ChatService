import mysql from "mysql2/promise";
import dotenv from "dotenv";
import Container from "typedi";

dotenv.config();

const pool = mysql.createPool({
    database : process.env.DB_DATABASE,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT as unknown as number,
    connectionLimit : 100,
    waitForConnections : true,
    queueLimit : 0
});

Container.set('pool',pool);


