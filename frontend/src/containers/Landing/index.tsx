import React from 'react';
import {
  Flex,
  Heading,
} from '@chakra-ui/react';
import CenterLayout from '../../layouts/CenterLayout';
import { FEATURE_ITEMS } from './data';
import FeatureItem from '../../components/FeatureItem';

function LandingPage() {
  return (
    <CenterLayout>
      <Flex
        direction="column"
        alignItems="center"
        maxW={1120}
        mx="10%"
      >
        <Heading
          fontWeight={500}
          fontSize={{ base: 28, lg: 34 }}
          mb={{ base: 32, lg: 40 }}
          color="brand-gray.4"
          textAlign="center"
        >
          grind practice questions with peers.
        </Heading>
        <Flex
          gap={12}
          direction={{ base: 'column', lg: 'row' }}
        >
          {FEATURE_ITEMS.map(({ icon, heading, description }) => (
            <FeatureItem
              icon={icon}
              heading={heading}
              description={description}
            />
          ))}
        </Flex>

      </Flex>
    </CenterLayout>
  );
}

export default LandingPage;
