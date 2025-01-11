import { API } from '@env'

export const api = {
    url: `https://${API}/api/`,
    
    // Users
    registerUser: `https://${API}/api/users/registeruser/`,
    checkUsers: `https://${API}/api/users/checkuser/`,
    checkToken: `https://${API}/api/users/checktoken/`,

    // Chats
    newChat: `https://${API}/api/chats/newchat/`,
    getChats: `https://${API}/api/chats/getchats/`,

    // WebSocket
    websocket: `wss://${API}`
}