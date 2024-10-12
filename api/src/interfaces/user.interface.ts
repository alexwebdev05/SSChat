export interface IUser {
    id?: number,
    username: Text,
    email: Text,
    password: Text,
    photo?: Text
}

export interface IChat {
    id?: number,
    user1: Text,
    user2: Text,
    created_at?: EpochTimeStamp
}