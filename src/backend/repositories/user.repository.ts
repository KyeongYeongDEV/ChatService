import {Inject, Service} from "typedi";
import mysql from "mysql2/promise";
import Repository from "./index.repository";
import { UserDTO } from "../dto/response/user";
import { UserJoinRequestDTO } from "../dto/request/user";


@Service()
export default class UserRepository extends Repository{
    constructor(@Inject('pool') pool : mysql.Pool){
        super(pool);
    }

    findOndByPk = async ({ email } : { email : string }) : Promise<UserDTO> => {
        const query = 'SELECT * FROM User WHERE email = ? limit = 1';
        return (await this.executeQuery(query, [email]))[0];
    }

    create = async (user : UserJoinRequestDTO) => {
        const query = 'INSERT INTO User( email, password, name) values (?,?,?)';
        return await this.executeQuery(query, [user.email, user.password, user.name]);
    }
}


