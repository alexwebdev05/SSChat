export const api = {
    url: 'https://sschat-api-production.up.railway.app/api/',
    
    // Users
    registerUser: 'https://sschat-api-production.up.railway.app/api/users/registeruser/',
    chaeckUsers: 'https://sschat-api-production.up.railway.app/api/users/checkuser/',

    // Chats
    newChat: 'https://sschat-api-production.up.railway.app/api/chats/newchat/',
    getChats: 'https://sschat-api-production.up.railway.app/api/chats/getchats/',

    // Messages
    getMessages: 'https://sschat-api-production.up.railway.app/api/messages/getmessages/',
    sendMessage: 'https://sschat-api-production.up.railway.app/api/messages/sendmessage/',

    // WebSocket
    websocket: 'wss://sschat-api-production.up.railway.app'
}