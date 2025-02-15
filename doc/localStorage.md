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
        "created_at": "<time>",
        "id": "<int>",
        "token": "<UUID>",
        "user1": "<UUID>",
        "user2": "<UUID>"
    },
    {...}
]}