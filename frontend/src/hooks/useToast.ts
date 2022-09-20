import { ToastId, useToast as useToastChakra } from '@chakra-ui/react';

interface ToastProps {
  title: string,
  description: string,
  status: 'info' | 'warning' | 'success' | 'error' | 'loading' | undefined,
}

export default function useToast(): (props: ToastProps) => ToastId {
  const toast = useToastChakra();

  return (props) => toast({
    ...props,
    position: 'bottom-right',
    duration: 9000,
    isClosable: true,
  });
}
