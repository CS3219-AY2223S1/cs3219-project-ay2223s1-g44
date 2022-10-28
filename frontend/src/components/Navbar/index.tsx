import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  SlideFade,
  Link,
  Popover,
  PopoverTrigger,
  useBreakpointValue,
  useDisclosure,
  FlexProps,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import {
  MdOutlineAccountCircle,
} from 'react-icons/md';

import { authContext } from '../../hooks/useAuth';

import { NavItemProps, ROUTES } from './data';

type DesktopNavProps = {
  navItems: Array<NavItemProps>;
  isAuthed: boolean;
};

function DesktopNav({ isAuthed, navItems }: DesktopNavProps) {
  const linkColor = 'brand-gray.2';
  const linkHoverColor = 'brand-gray.3';

  return (
    <Stack direction="row" spacing={4}>
      {isAuthed && navItems.map((navItem) => (
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

function MobileNavItem({ label, href, onClick }: NavItemProps & FlexProps) {
  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        onClick={onClick}
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
          color="gray.600"
        >
          {label}
        </Text>
      </Flex>
    </Stack>
  );
}

type MobileNavProps = {
  navItems: Array<NavItemProps>
  onToggle: () => void
};

function MobileNav({ navItems, onToggle }: MobileNavProps) {
  return (
    <Stack
      bg="brand-white"
      p={4}
      display={{ md: 'none' }}
      width="100vw"
    >
      {navItems.map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          onClick={onToggle}
          {...navItem}
        />
      ))}
    </Stack>
  );
}

export default function NavBar() {
  const { isOpen, onToggle } = useDisclosure();
  const { isAuthed } = useContext(authContext);

  const navItems = isAuthed ? ROUTES.protectedRoutes : ROUTES.publicRoutes;

  return (
    <Box
      position="relative"
      zIndex={999} // for dark overlay
    >
      <Flex
        bg="brand-white"
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
          flex={{ base: 1 }}
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
        <Flex
          flex={{ base: 1, md: 'auto' }}
          justify={{ base: 'center', md: 'flex-start' }}
        >
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            as={RouterLink}
            to="/"
            color="brand-gray.4"
            fontFamily="heading"
            fontWeight={700}
          >
            PeerPrep
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={6}>
            <DesktopNav navItems={navItems} isAuthed={isAuthed} />
          </Flex>
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify="flex-end"
          mr={{ base: -2 }}
        >
          {!isAuthed
            ? (
              <Flex
                display={{ base: 'none', md: 'flex' }}
                direction="row"
                gap={6}
              >
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
              </Flex>
            )
            : (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MdOutlineAccountCircle />}
                  color="brand-gray.4"
                  variant="ghost"
                  fontSize={24}
                />
                <MenuList
                  fontSize={12}
                  color="brand-gray.2"
                >
                  <MenuItem
                    fontWeight={500}
                  >
                    Account Settings
                  </MenuItem>
                  <MenuItem
                    fontWeight={500}
                  >
                    Log Out
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
        </Flex>
      </Flex>

      <Flex
        position="absolute"
        bg={isOpen ? 'rgba(0, 0, 0, 0.4)' : ''}
        pointerEvents={isOpen ? 'auto' : 'none'}
        transition="background 150ms ease-out"
        height="100vh"
      >
        <SlideFade
          in={isOpen}
          offsetY="-10px"
        >
          <MobileNav navItems={navItems} onToggle={onToggle} />
        </SlideFade>
      </Flex>
    </Box>
  );
}
