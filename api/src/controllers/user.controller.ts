import { Request, Response } from 'express';
import { IUser } from '../interfaces/user.interface';

import { UserModel } from '../models/user.model';

export class UserController {
    // Create user
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const userData: Omit<IUser, 'id'> = req.body; 
            const newUser = await UserModel.create(userData);
            console.log('[ SERVER ] New client has been created: ' + newUser);
            res.status(201).json({ user: newUser });
        } catch(error) {
            console.log('[ SERVER ] Failed to create a new user at controller: ' + error);
            res.status(500).json({ error: 'The username or email are in use.' });
        }
    }

    // Check user
    static async checkuser(req: Request, res: Response): Promise<void> {
        try {

            const data: Omit<IUser, 'id' | 'username' | 'photo'> = req.body;
            const dataChecker = await UserModel.getOne(data);
            console.log('[ SERVER ] New client has been checked: ' + dataChecker);
            res.status(201).json({ user: dataChecker.username, check: "Success" });

        } catch(error) {
            console.log('[ SERVER ] Error checking the user' + error)
            res.status(500).json({ error: 'Error checking the user.' });
        }
    }


}