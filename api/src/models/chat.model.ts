import { IChat } from "../interfaces/user.interface";

import { dbConnect } from '../conf/db';

export class ChatModel {

    // Chats
    static async createChat(data: Omit<IChat, 'id' | 'created_at'>): Promise<IChat> {
        const { user1, user2} = data
        const created_at = new Date();
        const client = await dbConnect();

        try {
            const result = await client.query<IChat>(
                'INSERT INTO chats (user1, user2, created_at) VALUES ($1, $2, $3) RETURNING *',
                [user1, user2, created_at]
            )

            if (result.rows.length === 0) {
                throw new Error('No rows returned from insert');
            }
            return result.rows[0];

        } catch(error) {
            console.log('[ SERVER ] Failed to create new chat at model: ' + error)
            throw error
        } finally {
            await client.end(); // Libera el cliente después de usarlo
        }
    }

}