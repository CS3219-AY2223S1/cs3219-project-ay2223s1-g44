import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';

import { authContext } from '../../hooks/useAuth';

import { NavItemProps, ROUTES } from '../../configs';

type DesktopNavProps = {
  navItems: Array<NavItemProps>
};

function DesktopNav({ navItems }: DesktopNavProps) {
  const linkColor = useColorModeValue('brand-gray.2', 'gray.200');
  const linkHoverColor = useColorModeValue('brand-gray.3', 'white');

  return (
    <Stack direction="row" spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link
                p={2}
                as={RouterLink}
                to={navItem.href ?? '#'}
                fontSize={12}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
}

function MobileNavItem({ label, children, href }: NavItemProps) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
        <Icon
          as={ChevronDownIcon}
          transition="all .25s ease-in-out"
          transform={isOpen ? 'rotate(180deg)' : ''}
          w={6}
          h={6}
        />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align="start"
        >
          {children
              && children.map((child) => (
                <Link
                  key={child.label}
                  py={2}
                  as={RouterLink}
                  to={child.href ?? '#'}
                >
                  {child.label}
                </Link>
              ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}

type MobileNavProps = {
  navItems: Array<NavItemProps>
};

function MobileNav({ navItems }: MobileNavProps) {
  return (
    <Stack
      bg={useColorModeValue('brand-white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
}

export default function NavBar() {
  const { isOpen, onToggle } = useDisclosure();
  const { isAuthed } = useContext(authContext);

  const navItems = isAuthed ? ROUTES.protectedRoutes : ROUTES.publicRoutes;

  return (
    <Box>
      <Flex
        bg={useColorModeValue('brand-white', 'gray.800')}
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 6 }}
        align="center"
        boxShadow="0px 0.5px 1px 1px rgba(0,0,0,0.1)"
        position="relative"
        zIndex={1}
      >
        {/* mobile menu */}
        <Flex
          grow={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex grow={{ base: 1 }} justify={{ base: 'center', md: 'flex-start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            as={RouterLink}
            to="/"
            color={useColorModeValue('brand-gray.4', 'white')}
            fontFamily="heading"
            fontWeight={700}
          >
            PeerPrep
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={6}>
            <DesktopNav navItems={navItems} />
          </Flex>
        </Flex>
        <Flex
          grow={{ base: 1, md: 0 }}
          justify="flex-end"
          direction="row"
          gap={6}
        >
          {!isAuthed
            && (
            <>
              <Button
                as={RouterLink}
                to="login"
                fontSize={12}
                fontWeight={500}
                color="brand-gray.2"
                variant="link"
                _active={
                  { color: 'brand-gray.3' }
                }
              >
                Log In
              </Button>
              <Button
                as={RouterLink}
                to="register"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={12}
                fontWeight={500}
                color="brand-white"
                bg="brand-blue.1"
                variant="button"
                borderRadius={8}
                height="40px"
                _hover={
                  { bg: 'brand-blue.2' }
                }
                _active={
                  { bg: 'brand-blue.3' }
                }
              >
                Sign Up
              </Button>
            </>
            )}
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={navItems} />
      </Collapse>
    </Box>
  );
}
