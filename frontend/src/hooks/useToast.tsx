import React from 'react';
import {
  Box,
  ToastId,
  useToast as useToastChakra,
  ToastProps,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { IoClose } from 'react-icons/io5';

const statusToColour = {
  success: 'brand-green.1',
  error: 'brand-red.1',
  warning: 'brand-orange.1',
  info: 'brand-blue.1',
  loading: 'brand-gray.1',
};

export default function useToast(): (props: ToastProps) => ToastId {
  const toast = useToastChakra();

  return (props) => {
    const { status, title, description } = props;

    return toast({
      position: 'bottom-right',
      duration: 5000,
      render: ({ onClose }) => (
        <Box
          color="brand-white"
          py={2}
          px={4}
          bg={statusToColour[status || 'loading']}
          borderRadius={8}
          position="relative"
        >
          <IconButton
            aria-label="close"
            icon={<IoClose />}
            bg="none"
            size="xs"
            position="absolute"
            top={0}
            right={0}
            mr={1}
            mt={1}
            onClick={onClose}
            fontSize={16}
            _hover={{}}
            _active={{}}
          />
          <Text fontWeight={500} fontSize={16}>{title}</Text>
          <Text fontSize={14}>{description}</Text>
        </Box>
      ),
    });
  };
}
