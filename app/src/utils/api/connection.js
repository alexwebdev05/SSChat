export const api = {
    url: 'http://192.168.1.81:3000/api/',
    
    // Users
    registerUser: 'http://192.168.1.81:3000/api/users/registeruser/',
    chaeckUsers: 'http://192.168.1.81:3000/api/users/checkuser/',

    // Chats
    newChat: 'http://192.168.1.81:3000/api/chats/newchat/',
    getChats: 'http://192.168.1.81:3000/api/chats/getchats/',

    // Messages
    getMessages: 'http://192.168.1.81:3000/api/messages/getmessages/',
    sendMessage: 'http://192.168.1.81:3000/api/messages/sendmessage/',

    // WebSocket
    websocket: 'ws://192.168.1.81:4000'
}