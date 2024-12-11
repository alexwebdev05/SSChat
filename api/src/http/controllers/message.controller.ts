import { Request, Response } from 'express';
import { IMessage } from '../interfaces/interfaces';

import { MessageModel } from '../models/message.model';

export class MessageController {

    // Get messages
    static async getmessages(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body
            const messageData = await MessageModel.getMessages(data)
            res.status(201).json(messageData)
        } catch(error) {
            console.log('[ SERVER ] Error getting messages at controller: ', error)
        }
    }

    // Send Message
    static async sendmessage(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body
            const messageData = await MessageModel.sendMessage(data)
            res.status(201).json(messageData)
        } catch(error) {
            console.log('[ SERVER ] Error sending messages at controller: ', error)
        }
    }

}