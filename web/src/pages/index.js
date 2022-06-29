import { Text } from "@chakra-ui/react";
import { Cards } from "../components/Cards";
import { Layout } from "../components/Layout";

import { listedCards } from "../lib/fixtures";

export const IndexPage = () => {
  const cards = listedCards;
  return (
    <Layout>
      <Text mb="6" fontSize={"xl"} fontWeight="bold" color="gray.700">
        Available NFTs to Borrow
      </Text>
      <Cards cards={cards} to="borrow" />
    </Layout>
  );
};
