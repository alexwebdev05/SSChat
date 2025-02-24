import { API } from '@env'

export const api = {
    url: `http://${API}/api`,
    
    // Users
    registerUser: `http://${API}/api/users/registeruser`,
    checkUsers: `http://${API}/api/users/checkuser`,
    checkToken: `http://${API}/api/users/checktoken`,

    // Chats
    newChat: `http://${API}/api/chats/newchat`,

    // WebSocket
    websocket: `ws://192.168.1.34:8080`
}