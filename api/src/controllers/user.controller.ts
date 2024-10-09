import { Request, Response } from 'express';
import { IUser } from '../interfaces/user.interface';

import { UserModel } from '../models/user.model';

export class UserController {
    static async create(req: Request, res: Response): Promise<Response<IUser | { message: string }>> {
        try {
            const userData: Omit<IUser, 'id'> = req.body; 
            const newUser = await UserModel.create(userData);
            return res.status(201).json(newUser);
        } catch(error) {
            console.log('Failed to create a new user: ' + error);
            return res.status(500).json({message: 'Failed to create a new user'});
        }
    }


}