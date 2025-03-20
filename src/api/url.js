import { API } from '@env'

export const api = {
    url: `https://${API}/api`,
    
    // Users
    registerUser: `https://sschat-api-production.up.railway.app/api/users/registeruser`,
    checkUsers: `https://sschat-api-production.up.railway.app/api/users/checkuser`,
    checkToken: `https://sschat-api-production.up.railway.app/api/users/checktoken`,

    // Chats
    newChat: `https://sschat-api-production.up.railway.app/api/chats/newchat`,
    getChats: `https://sschat-api-production.up.railway.app/api/chats/getchats`,

    // WebSocket
    websocket: `wss://sschat-api-production.up.railway.app`
}