import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Checkbox as ChakraCheckbox,
  CheckboxGroup,
  CheckboxProps as ChakraCheckboxProps,
  Flex,
  Grid,
  GridItem,
  Text,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { authContext } from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

import ContentLayout from '../../layouts/ContentLayout';
import {
  Difficulty, DIFFICULTIES, DIFFICULTY_TAGS, MatchHistoryCardProps, MOCK_DATA,
} from './data';
import formatDate from '../../utils/format-date';

type CheckBoxProps = Difficulty & ChakraCheckboxProps;

function Checkbox({ label, value, ...props }: CheckBoxProps) {
  return (
    <ChakraCheckbox
      {...props}
      value={value}
      size="sm"
    >
      <Text
        fontSize="12px"
        fontWeight={500}
        color="brand-gray.2"
      >
        {label}
      </Text>
    </ChakraCheckbox>
  );
}

function MatchHistoryCard({ title, difficulty, date }: MatchHistoryCardProps) {
  return (
    <Flex
      key={title}
      bg="white"
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.01)"
      borderRadius={12}
      height="72px"
      width="100%"
      alignItems="center"
    >
      <Grid
        width="100%"
        templateColumns="5fr 2fr 2fr"
        fontSize="12px"
        color="brand-gray.3"
        fontWeight={500}
        alignItems="center"
      >
        <GridItem
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          px={8}
        >
          {title}
        </GridItem>
        <GridItem>
          <Text
            py={2}
            px={3}
            bg={DIFFICULTY_TAGS[difficulty].colour}
            color="white"
            fontSize={12}
            borderRadius={20}
            fontWeight={500}
            width="fit-content"
          >
            {DIFFICULTY_TAGS[difficulty].value}
          </Text>
        </GridItem>
        <GridItem>
          {formatDate(date)}
        </GridItem>
      </Grid>
    </Flex>
  );
}

function Dashboard() {
  const { user } = useContext(authContext);
  const toast = useToast();
  const [checkedDifficulties, setCheckedDifficulties] = useState<(string | number)[]>([
    'easy', 'medium', 'hard',
  ]);

  const handleSelectDifficulty: (value: (string | number)[]) => void = (value) => {
    setCheckedDifficulties(value);
  };

  return (
    <ContentLayout heading="Match history">
      <Grid
        height="400vh"
        width="100%"
        templateColumns="3fr 1fr"
        gap={4}
      >
        <GridItem>
          <Flex
            mt={-6}
            pt={6}
            pb={4}
            position="sticky"
            top="56px"
            bg="brand-white"
            zIndex={99}
          >
            <Flex
              bg="white"
              boxShadow="0px 0px 10px rgba(0, 0, 0, 0.01)"
              borderRadius={12}
              height="72px"
              width="100%"
              alignItems="center"
            >
              <Grid
                width="100%"
                templateColumns="5fr 2fr 2fr"
                fontSize="12px"
                color="brand-gray.2"
                fontWeight={500}
              >
                <GridItem pl={8}>
                  Title
                </GridItem>
                <GridItem>
                  Difficulty
                </GridItem>
                <GridItem>
                  Date
                </GridItem>
              </Grid>
            </Flex>
          </Flex>
          <Flex
            flexDirection="column"
            gap={4}
          >
            {MOCK_DATA
              .filter(({ difficulty }) => checkedDifficulties.includes(difficulty))
              .map(({ title, difficulty, date }) => (
                <MatchHistoryCard
                  title={title}
                  difficulty={difficulty}
                  date={date}
                />
              ))}
          </Flex>
        </GridItem>
        <GridItem>
          <Flex
            bg="white"
            direction="column"
            boxShadow="0px 0px 10px rgba(0, 0, 0, 0.01)"
            height="360px"
            width="100%"
            position="sticky"
            borderRadius={12}
            top="80px"
            p={6}
          >
            <Text
              as="h3"
              fontWeight={500}
              color="brand-gray.3"
              mb={4}
            >
              Difficulty
            </Text>
            <CheckboxGroup
              colorScheme="gray"
              onChange={handleSelectDifficulty}
              value={checkedDifficulties}
            >
              <Flex
                direction="column"
                gap={2}
              >
                {DIFFICULTIES.map(({ value, label }) => (
                  <Checkbox
                    value={value}
                    label={label}
                  />
                ))}
              </Flex>
            </CheckboxGroup>
          </Flex>
        </GridItem>
      </Grid>
    </ContentLayout>
  );
}

export default Dashboard;
