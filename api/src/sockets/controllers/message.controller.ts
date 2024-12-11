import { MessageModel } from "../models/MessageModel"

import { IMessage } from "../interfaces"

export class MessageController {

    static async getmessages(data: IMessage) {

        try {
            const messageData = await MessageModel.getMessages(data)
            return(messageData)
        } catch(error) {
            console.log('[ SERVER ] Error getting messages at controller: ', error)
        }

        // const response = JSON.stringify(message.message)
        // return response
    }
}