import React, { useEffect, useRef } from 'react';
import { Text, Flex } from '@chakra-ui/react';

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

  const scrollToBottom = () => {
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
      return <Text key={id} color="brand-gray.2">{content}</Text>;
    }
    // user chat
    return (
      <Text color="brand-blue.1" key={id} ref={isLastChat ? chatsEndRef : undefined}>
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
