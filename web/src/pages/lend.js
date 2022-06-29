import { Text } from "@chakra-ui/react";

import { Lend } from "../components/Lend";
import { Layout } from "../components/Layout";

import { myCards } from "../lib/fixtures";

export const LendPage = () => {
  const card = myCards[1];

  return (
    <Layout>
      <Text mb="6" fontSize={"xl"} fontWeight="bold" color="gray.700">
        Lend NFT
      </Text>
      <Lend card={card}></Lend>
    </Layout>
  );
};
