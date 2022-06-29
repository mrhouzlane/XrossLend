import React from "react";
import { Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { Layout } from "../components/Layout";
import { Cards } from "../components/Cards";

import { accountState } from "../atoms/account";
import { myCards } from "../lib/fixtures";

export const MyPage = () => {
  const [account] = useRecoilState(accountState);
  const cards = myCards;

  React.useEffect(() => {
    if (!account) {
      window.location.href = "/";
    }
  }, [account]);

  return (
    <Layout>
      <Text mb="6" fontSize={"xl"} fontWeight="bold" color="gray.700">
        Your NFTs to Lend
      </Text>
      <Cards cards={cards} to="lend" />
    </Layout>
  );
};
