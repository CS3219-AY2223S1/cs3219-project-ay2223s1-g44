import React, { useEffect, useRef, useContext } from 'react';
import { Text, Flex } from '@chakra-ui/react';

import { authContext } from '../../hooks/useAuth';

export type Chat = {
  id: string,
  username?: string,
  content: string,
};

export type ChatsProps = {
  chats: Chat[]
};

function Chats({ chats }: ChatsProps) {
  const chatsEndRef = useRef<HTMLDivElement>(null);
  const { user: { username: currentUsername } } = useContext(authContext);

  const scrollToBottom = async () => {
    if (chatsEndRef.current) {
      chatsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const renderChat = ({ chat, isLastChat } : { chat: Chat, isLastChat: boolean }) => {
    const { id, username, content } = chat;
    // server chat
    if (!username) {
      return (
        <Text
          key={id}
          color="brand-gray.2"
          ref={isLastChat ? chatsEndRef : undefined}
        >
          {content}
        </Text>
      );
    }
    // user chat
    return (
      <Text
        color={username === currentUsername ? 'brand-blue.1' : 'brand-red.1'}
        key={id}
        ref={isLastChat ? chatsEndRef : undefined}
      >
        <Text as="span" fontWeight={700}>{username}</Text>
        {': '}
        <Text as="span">{content}</Text>
      </Text>
    );
  };

  return (
    <Flex
      fontSize={12}
      flexGrow={1}
      direction="column"
      overflow="scroll"
      maxHeight="100%"
      p={4}
      gap={1}
    >
      {chats
        && chats.map((chat, idx) => renderChat({ chat, isLastChat: idx === chats.length - 1 }))}
    </Flex>
  );
}

export default Chats;
