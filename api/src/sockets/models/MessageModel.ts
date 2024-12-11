import { dbConnect } from "../../conf/db";
import { IMessage } from "../interfaces";

export class MessageModel {

    // Get messages
    static async getMessages(data: IMessage) {
        const client = await dbConnect();

        try {
            console.log(data)
            const sender = data.sender
            const receiver = data.receiver

            const response = await client.query(
                'SELECT * FROM messages WHERE (sender = $1 OR receiver = $1) AND (sender = $2 OR receiver = $2);',
                [sender, receiver]
            )


            return response.rows;


        } catch (error) {

            console.log('[ SERVER ] Failed to get messages at model: ' + error)

        } finally {
            await client.end();
        }
    }

}