import { Text } from "@chakra-ui/react";

import { Borrow } from "../components/Borrow";
import { Layout } from "../components/Layout";

import { listedCards } from "../lib/fixtures";

export const BorrowPage = () => {
  const card = listedCards[0];
  return (
    <Layout>
      <Text mb="6" fontSize={"xl"} fontWeight="bold" color="gray.700">
        Borrow NFT
      </Text>
      <Borrow card={card}></Borrow>
    </Layout>
  );
};
