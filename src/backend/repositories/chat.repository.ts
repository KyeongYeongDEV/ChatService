import mysql from 'mysql2/promise';
import { Inject, Service } from 'typedi';
import Repository from '.';
import { ChatRoomDTO } from '../dto/response/chat';

@Service()
export default class ChatRepository extends Repository {
    constructor(@Inject('pool') pool : mysql.Pool){
        super(pool);
    }

    async findAllByUid({ u_id } : { u_id : number }) : Promise<ChatRoomDTO[]> {
        const query = `
            SELECT 
                cr.cr_id, 
                cr.title,
                ucr.u_id
            FROM 
                ChatRoom cr 
                JOIN UserChatRoom ucr ON cr.cr_id = ucr.cr_id 
            WHERE 
                ucr.u_id = ? 
            ORDER BY 
                cr.cr_id DESC
        `;
        return (await this.executeQuery(query, [u_id])) as ChatRoomDTO[];
    }

    async findOneByRoomId({ cr_id } : { cr_id : number }) : Promise<ChatRoomDTO | null> {
        const query = `
            SELECT 
                cr_id, 
                title 
            FROM 
                ChatRoom 
            WHERE 
                cr_id = ? 
            LIMIT 1
        `;
        const results = await this.executeQuery(query, [cr_id]);
        return results.length ? (results[0] as ChatRoomDTO) : null;
    }
    
    async create({ u_id, title } : { u_id : number, title : string }) : Promise<number>{
        const connection = await this.pool.getConnection();
        try{
            await connection.beginTransaction();

            const createRoomQuery = 'INSERT INTO ChatRoom (title) VALUES (?)';
            const [roomResult] = await connection.execute(createRoomQuery, [title]);
            const cr_id = (roomResult as any).insertId;

            const linkeUserQuery = 'INSERT INTO UserChatRoom (u_id, cr_id) VALUES (?,?)';
            await connection.execute(linkeUserQuery, [u_id, cr_id]);

            await connection.commit();
            return cr_id;
        } catch (error) {
            await connection.rollback();
            console.error(`Error generating chat room: ${error}`);
            throw error;
        } finally {
            connection.release();
        }
    }   

    async delete({ cr_id } : {cr_id : number}) : Promise<void> {
        const connection =await this.pool.getConnection();
        try{
            await connection.beginTransaction();

            const deleteUserChatRoomQuery = 'DELETE FROM UserChatRoom WHERE cr_id = ?'
            await connection.execute(deleteUserChatRoomQuery, [cr_id]);

            const deleteChatRoomQuery = 'DELETE FROM ChatRoom WHERE cr_id = ?';
            await connection.execute(deleteChatRoomQuery, [cr_id]);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error(error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async generateChatRoomStatusByRoomId( cr_id : number , chatRoomStatus : any ) {
        const query = `
            INSERT INTO ChatRoomStatus(cr_id, crs_resolve, crs_grade, crs_feedback)
            VALUES (?,?,?,?)
            ON DUPLICATE KEY UPDATE
                crs_resolve = VALUES(crs_resolve),
                crs_grade = VALUES(crs_grade),
                crs_feedback = VALUES(crs_feedback)
        `;

        await this.executeQuery(query, [
            cr_id,
            chatRoomStatus.resolved,
            chatRoomStatus.grade,
            chatRoomStatus.feedback
        ]);
    }
}