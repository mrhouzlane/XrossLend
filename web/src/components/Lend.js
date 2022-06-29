import React from "react";
import {
  Grid,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Checkbox,
  Stack,
  Select,
} from "@chakra-ui/react";
import { Card } from "./Card";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from "web3";

import { useRecoilState } from "recoil";

import SourceABI from "../../../artifacts/contracts/Source.sol/Source.json";
import ERC721ABI from "../../../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json";
import { accountState } from "../atoms/account";
import networks from "../../../networks.json";

export const Lend = ({ card }) => {
  const [account, setAccount] = useRecoilState(accountState);
  const [network, setNetwork] = React.useState("rinkeby");

  const connect = async () => {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "95f65ab099894076814e8526f52c9149",
          },
        },
      };
      const web3Modal = new Web3Modal({
        //network: "mainnet",
        providerOptions,
      });
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const [account] = await web3.eth.getAccounts();
      setAccount(account);
    } catch (err) {
      console.error(err);
    }
  };

  const lend = async () => {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "95f65ab099894076814e8526f52c9149",
          },
        },
      };
      const web3Modal = new Web3Modal({
        //network: "mainnet",
        providerOptions,
      });
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const [account] = await web3.eth.getAccounts();

      const sourceAddress = networks[network].contracts.source;
      const source = new web3.eth.Contract(SourceABI.abi, sourceAddress);
      const relay = {
        currencyContractAddress: networks[network].contracts.weth,
        nftContractAddress: card.nftContractAddress,
        from: account,
        tokenId: card.tokenId,
        price: 0,
        expiration: 9999999999,
        tokenURI: "",
      };
      // const erc721 = new web3.eth.Contract(ERC721ABI.abi, card.nftContractAddress);
      // await erc721.methods.setApprovalForAll(sourceAddress, true).send({ from: account });
      await source.methods.rent(relay).send({ from: account });
    } catch (err) {
      console.error(err);
    }

    const relay = {};
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <Card card={card} />
      <Box border="1px" borderColor="gray.200" rounded={"2xl"} p="8">
        <VStack spacing={3} mb="12">
          <FormControl>
            <FormLabel htmlFor="text">Price per Day</FormLabel>
            <Input id="text" type="price" placeholder="WETH" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="currency">Currency</FormLabel>
            <Select id="currency">
              <option value="eth">WETH</option>
              <option value="usdc" disabled>
                USDC
              </option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Allowed Chain</FormLabel>
            <Stack justify={"left"}>
              <Checkbox defaultChecked size="sm">
                Optimism
              </Checkbox>
              <Checkbox defaultChecked size="sm">
                Boba
              </Checkbox>
              <Checkbox defaultChecked size="sm">
                Polygon
              </Checkbox>
              <Checkbox defaultChecked size="sm">
                Gnosis Chain
              </Checkbox>
              <Checkbox defaultChecked size="sm">
                Cronos
              </Checkbox>
              <Checkbox defaultChecked size="sm">
                SKALE
              </Checkbox>
            </Stack>
          </FormControl>
        </VStack>
        {!account ? (
          <Button
            backgroundColor="red.400"
            _hover={{ bg: "red.500" }}
            color="white"
            width="100%"
            rounded={"2xl"}
            onClick={connect}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            backgroundColor="red.400"
            _hover={{ bg: "red.500" }}
            color="white"
            width="100%"
            rounded={"2xl"}
            onClick={lend}
          >
            Confirm
          </Button>
        )}
      </Box>
    </Grid>
  );
};
