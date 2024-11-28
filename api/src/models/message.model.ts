import { IMessage } from "../interfaces/interfaces";

import { dbConnect } from "../conf/db";

export class MessageModel {

    // Get messages
    static async getMessages(data: IMessage): Promise<void> {
        const { sender, receiver } = data

    }
}