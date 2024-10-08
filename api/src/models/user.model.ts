import { Client } from 'pg';
import { IUser } from "../interfaces/user.interface";

import env from '../conf/env'
import { dbConnect } from '../conf/db';


class UserModel {

    // Modify data
    async create(userData: Omit<IUser, 'id'>): Promise<IUser> {
        const { username, email, password } = userData;

        const client = await dbConnect();

        const result = await client.query<IUser>(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password]
        );

        return result.rows[0]
    }

    async update() {
        
    }

    async delete() {
        
    }

    // Manage data
    async getAll() {
        
    }

    async getOne() {
        
    }

    async getImg() {
        
    }

}