import { API } from '@env'

export const api = {
    url: `http://${API}/api`,
    
    // Users
    registerUser: `http://${API}/api/users/registeruser`,
    checkUsers: `http://${API}/api/users/checkuser`,
    checkToken: `http://${API}/api/users/checktoken`,

    // Chats
    newChat: `http://${API}/api/chats/newchat`,
    getChats: `http://${API}/api/chats/getchats`,

    // WebSocket
    websocket: `ws://192.168.89.91:8080`
}