import { IUser } from "../interfaces/user.interface";

import { dbConnect } from '../conf/db';

export class UserModel {

    // Modify data
    static async create(userData: Omit<IUser, 'id'>): Promise<IUser> {
        const { username, email, password } = userData;
        const client = await dbConnect();

        try {
            const result = await client.query<IUser>(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
                [username, email, password]
            );
            return result.rows[0]

        } catch(error) {
            console.log('[ SERVER ] Failed to create a new user at model: ' + error)
            throw error

        } finally {
            await client.end();
        }
        

        
    }

    static async update() {
        
    }

    static async delete() {
        
    }

    // Manage data
    static async getAll() {
        
    }

    static async getOne(data: Omit<IUser, 'id' | 'username' | 'photo'>): Promise<IUser> {
        const { email, password } = data
        const client = await dbConnect();

        try {

            const result = await client.query<IUser>(
                'SELECT * FROM users WHERE email = $1 AND password = $2',
                [email, password]
            )
            return result.rows[0]

        } catch(error) {
            console.log('[ SERVER ] Failed to check user at model: ' + error)
            throw error
        } finally {
            await client.end();
        }
    }

    static async getImg() {
        
    }

}