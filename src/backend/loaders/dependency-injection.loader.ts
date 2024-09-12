import Container from "typedi";
import mysql from "mysql2/promise";
import { Server } from "socket.io";

export default async ({ pool}: { pool: mysql.Pool}) =>{
    Container.set('pool', pool);
    //Container.set('io', io);
}