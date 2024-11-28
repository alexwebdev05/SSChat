import { Request, Response } from 'express';
import { IMessage } from '../interfaces/interfaces';

import { MessageModel } from '../models/message.model';

export class MessageController {

    // New message

    // Get messages
    static async getmessages(req: Request, res: Response): Promise<void> {
        try {
            const data: IMessage = req.body
            const messageData = await MessageModel.getMessages(data)
            res.status(201).json(messageData)
        } catch(error) {
            console.log('[ SERVER ] Error getting messages at controller: ', error)
        }
    }

}