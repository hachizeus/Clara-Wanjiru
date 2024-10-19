import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);

    const addChat = (chat) => {
        setChats((prevChats) => {
            const existingChat = prevChats.find(c => c.id === chat.id);
            if (existingChat) {
                return prevChats; // If chat exists, don't add it again
            }
            return [...prevChats, chat]; // Add new chat
        });
    };

    return (
        <ChatContext.Provider value={{ chats, addChat }}>
            {children}
        </ChatContext.Provider>
    );
};
