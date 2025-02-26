import { API } from '@env'

export const api = {
    url: `http://192.168.1.34/api`,
    
    // Users
    registerUser: `http://192.168.1.34:8080/api/users/registeruser`,
    checkUsers: `http://192.168.1.34:8080/api/users/checkuser`,
    checkToken: `http://192.168.1.34:8080/api/users/checktoken`,

    // WebSocket
    websocket: `ws://192.168.1.34:8080`
}