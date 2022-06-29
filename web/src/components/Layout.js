import { Box, Container, Flex } from "@chakra-ui/react";

import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = ({ children, isLanding }) => {
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Header isLanding={isLanding} />
      <Box flex={1}>
        <Container maxW={"5xl"}>{children}</Container>
      </Box>
      <Footer />
    </Flex>
  );
};
