export enum EMIT {
    // Auth
    LOGIN = "login",
    LOGIN_OF_OTHER_USER = "loginUsers",
    UPDATE_ACCOUNT = "UpdateAccount",
    UNAUTHORIZED = "unauthorized",

    // ERROR
    ERROR = "systemError",
    // Group / Chats
    GROUP_CREATED = "groupCreated",
    NEW_PUBLIC_CHAT = "newPublicChatCreated",
    NEW_CHAT = "newChatCreated"
}