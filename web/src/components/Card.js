import { Box, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export const Card = ({ card, to }) => {
  return (
    <Box spacing="4" border="1px" borderColor="gray.200" rounded={"2xl"}>
      <Box as={to ? NavLink : ""} to={to ? `/${to}` : ""}>
        <Box position="relative">
          <Image src={card.image} alt={card.name} draggable="false" fallback={<Skeleton />} borderTopRadius="2xl" />
        </Box>
        <Stack spacing="1" px="4" py="2">
          <Text fontSize="sm" color="gray.700">
            {card.collection}
          </Text>
          <Text fontSize="md" color="gray.700">
            {card.name}
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};
