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
            console.log(error)
            throw new error
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

    static async getOne() {
        
    }

    static async getImg() {
        
    }

}