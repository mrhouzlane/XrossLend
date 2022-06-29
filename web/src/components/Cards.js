import { Grid, GridItem } from "@chakra-ui/react";
import { Card } from "./Card";

export const Cards = ({ cards, to }) => {
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {cards.map((card, i) => {
        return (
          <GridItem key={i}>
            <Card card={card} to={to} />
          </GridItem>
        );
      })}
    </Grid>
  );
};
