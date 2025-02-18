isLoggedIn
{
    "loggedStatus":"<boolean>"
}

userData
{
    "username":"<string>",
    "email":"<string>",
    "photo":"<string>",
    "token":"<UUID>",
}

chats
{[
    {
        "username": "<string>",
        "userID": "<UUID>",
        "created_at": "<time>",
        "token": "<UUID>",
    },
    {...}
]}

<userID> (Contains user messages)
[
    {
        "created_at": "<date>",
        "id": <int>,
        "message": "<string>",
        "receiver": "<UUID>",
        "sender": "<UUID>"
    },
    {...}
]