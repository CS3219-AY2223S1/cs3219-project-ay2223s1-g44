import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import {
  Text, Flex, InputGroup, Input, InputRightElement, IconButton,
} from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5';

import { authContext } from '../../hooks/useAuth';

export type Chat = {
  id: string;
  username?: string;
  content: string;
};

export type ChatsProps = {
  chats: Chat[]
};

type ChatBoxProps = {
  chats: Chat[];
  handleChatSend: (chat: string) => void;
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
        <Flex
          key={id}
          justifyContent="center"
        >
          <Text
            color="brand-gray.2"
            ref={isLastChat ? chatsEndRef : undefined}
          >
            {content}
          </Text>
        </Flex>
      );
    }
    // user chat
    const isCurrentUser = username === currentUsername ? 'brand-blue.1' : 'brand-red.1';
    return (
      <Flex
        key={id}
        margin={isCurrentUser ? '0 0 0 auto' : '0 auto 0 0'}
        maxW="80%"
        bg={isCurrentUser ? 'brand-blue.1' : 'brand-red.1'}
        px={3}
        py={2}
        opacity={0.8}
        borderRadius={8}
      >
        <Text
          color="brand-white"
          ref={isLastChat ? chatsEndRef : undefined}
        >
          {content}
        </Text>
      </Flex>
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
      gap={2}
    >
      {chats
        && chats.map((chat, idx) => renderChat({ chat, isLastChat: idx === chats.length - 1 }))}
    </Flex>
  );
}

function ChatBox({ chats, handleChatSend }: ChatBoxProps) {
  const [newChat, setNewChat] = useState<string>('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    handleChatSend(newChat);
    setNewChat('');
  };

  return (
    <>
      <Chats chats={chats} />
      <form onSubmit={handleSubmit}>
        <InputGroup borderTop="1px solid" borderColor="brand-gray.1">
          <Input
            type="text"
            name="input"
            onChange={(event) => setNewChat(event.target.value)}
            value={newChat}
            borderRadius={12}
            borderTopRadius={0}
            fontSize={12}
            variant="filled"
            bg="white"
            border="none"
            color="brand-gray.4"
            _hover={{ bg: 'gray.50' }}
            _focus={{
              border: 'none',
              bg: 'gray.100',
            }}
          />
          <InputRightElement>
            <IconButton
              aria-label="submit"
              type="submit"
              bg="none"
              fontSize={16}
              color="brand-blue.1"
              icon={<IoSend />}
              _hover={{
                bg: 'none',
                color: 'brand-blue.2',
              }}
              _active={{
                bg: 'none',
                color: 'brand-blue.3',
              }}
            />
          </InputRightElement>
        </InputGroup>
      </form>
    </>
  );
}

export default ChatBox;
