import mysql from 'mysql2/promise';
import { Inject, Service } from 'typedi';
import Repository from './index.repository';
import { ChatRoomDTO, ChatRoomWithUsersDTO, MessageDTO } from '../dto/response/chat';

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

    async findMessagesByChatRoomId({ cr_id } : { cr_id : number }) : Promise<MessageDTO[]> {
        const query = `
            SELECT 
                m_id, 
                cr_id, 
                u_id, 
                sender_name, 
                content, 
                createAt 
            FROM 
                Message 
            WHERE 
                cr_id = ? 
            ORDER BY 
                createAt DESC
        `;

        const results = await this.executeQuery(query, [cr_id]);
        return results as MessageDTO[];
    }

    async findOneByRoomId({ cr_id } : { cr_id : number }) : Promise<ChatRoomDTO | null> {
        const query = `
            SELECT 
                m_id, 
                cr_id, 
                u_id, 
                sender_name, 
                content, 
                createAt 
            FROM 
                Message 
            WHERE 
                cr_id = ? 
            ORDER BY 
                createAt DESC
        `;

        const results = await this.executeQuery(query, [cr_id]);
        return results.length ? (results[0] as ChatRoomDTO) : null;
    }


    async findOneWithUsersByRoomId({ cr_id } : { cr_id : number }) : Promise<ChatRoomWithUsersDTO | null> {
        const chatRoomQuery = `
            SELECT 
                cr.cr_id,
                cr.title
            FROM 
                ChatRoom cr
            WHERE
                cr.cr_id = ?
            LIMIT 1
        `;
        const usersQuery = `
            SELECT 
                ucr.u_id
            FROM 
                USerChatRoom ucr
            WHERE 
                ucr.cr_id = ?
        `;

        const [chatRoomResults] = await this.executeQuery(chatRoomQuery, [cr_id]);
        const userResults = await this.executeQuery(usersQuery, [cr_id]);

        if (!chatRoomResults || chatRoomResults.length === 0){
            return null;
        }


        return {
            cr_id : chatRoomResults[0].cr_id,
            title : chatRoomResults[0].title,
            users : Array.isArray(userResults) ? userResults.map((row: any) => row.u_id) : []
        } as ChatRoomWithUsersDTO;
    }
    
    async create({ u_id, title } : { u_id : number, title : string }) : Promise<number> {
        if (u_id === undefined || title === undefined) {
            throw new Error('u_id와 title 이 정의되지 않았습니다');
        }
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
    
            const createRoomQuery = 'INSERT INTO ChatRoom (title) VALUES (?)';
            const [roomResult] = await connection.execute(createRoomQuery, [title]);
    
            const cr_id = (roomResult as any).insertId;
    
            const linkUserQuery = 'INSERT INTO UserChatRoom (u_id, cr_id) VALUES (?, ?)';
            await connection.execute(linkUserQuery, [u_id, cr_id]);
    
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

    async createOneToOneChatRoom({ u_id, other_u_id, title } : { u_id : number, other_u_id : number, title : string }) : Promise<number> {
        if (u_id === undefined || other_u_id === undefined || title  === undefined) {
            throw new Error(' u_id, other_u_id, title 이 정의되지 않았습니다');
        }

        const connection = await this.pool.getConnection();
        try{
            await connection.beginTransaction();

            const createRoomQuery = 'INSERT INTO ChatRoom (title) VALUES (?)';
            const [roomResult] = await connection.execute(createRoomQuery, [title]);

            const cr_id = (roomResult as any).insertId;

            const linkUserQuery = 'INSERT INTO UserChatRoom (u_id, cr_id) VALUES (?, ?';
            await connection.execute(linkUserQuery, [u_id, cr_id]);
            await connection.execute(linkUserQuery, [other_u_id, cr_id]);

            await connection.commit();

            return cr_id;
        } catch (error) {
            await connection.rollback();
            console.error(`Error generatind one-to-one chat room : ${error}`);
            throw error;
        } finally {
            connection.release();
        }
    }

    async addUserToChatRoom({ u_id, cr_id } : { u_id : number, cr_id : number }) : Promise<void> {
        if (u_id === undefined || cr_id === undefined) {
            throw new Error('u_id와 cr_id 가 정의되지 않았습니다');
        }

        const connection = await this.pool.getConnection();
        try{
            await connection.beginTransaction();

            const linkUserQuery = "INSERT INTO UserChatRoom (u_id, cr_id) VALUES (?, ?)";
            await connection.execute(linkUserQuery, [u_id, cr_id]);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error(`Error adding user to chat room : ${error}`);
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

    async saveMessage({ cr_id, u_id, sender_name, content} : { cr_id : number, u_id : number, sender_name : string, content : string }) : Promise<number> {
        const query = `
            INSERT INTO Message (cr_id, u_id, sender_name, content, createAt)
            VALUES (?, ?, ?, ?, NOW())
        `;
        
        const result = await this.executeQuery(query, [cr_id, u_id, sender_name, content]);
        return (result as any).insertId;
    }
}