import { Flex, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Flex minH={"64px"} alignItems={"center"} justifyContent={"center"} px="4" py="8" gap={"16px"}>
      <Text fontSize={"xs"} fontWeight={"medium"} color="red.400">
        XrossLend
      </Text>
    </Flex>
  );
};
