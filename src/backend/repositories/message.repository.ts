import Repository from "./index.repository";
import mysql from 'mysql2/promise';
import { Inject, Service } from "typedi";
import { MessageDTO } from "../dto/response/chat";

@Service()
export default class MessageRepository extends Repository {
    constructor(@Inject('pool') pool : mysql.Pool){
        super(pool);
    }

    async findAllByRoomId({ cr_id } : { cr_id : number }) : Promise<MessageDTO[]> {
        const query = 'SELECT * FROM message WHERE cr_id = ? order by m_create_at desc';
        return (await this.executeQuery(query, [cr_id])) as MessageDTO[];
    }
}
