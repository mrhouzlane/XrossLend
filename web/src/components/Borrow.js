import React from "react";
import {
  Grid,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Stack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { ethers } from "ethers";

import { accountState } from "../atoms/account";
import { Card } from "./Card";

import TargetABI from "../../../artifacts/contracts/Target.sol/Target.json";
import OptimisticOracleV2 from "../../../artifacts/@uma/core/contracts/oracle/implementation/OptimisticOracleV2.sol/OptimisticOracleV2.json";
import networks from "../../../networks.json";

const utf8ToHex = (input) => ethers.utils.formatBytes32String(input);
const identifier = utf8ToHex("YES_OR_NO_QUERY");

export const Borrow = ({ card }) => {
  const [account, setAccount] = useRecoilState(accountState);
  const [network, setNetwork] = React.useState("rinkeby");

  const zeroAddress = "0x0000000000000000000000000000000000000000";

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

  const confirm = async () => {
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
      const targetAddress = networks[network].contracts.target;
      const optimisticOracleAddress =
        networks[network].contracts.optimisticOracle;
      const target = new web3.eth.Contract(TargetABI.abi, targetAddress);
      const relay = {
        currencyContractAddress: networks[network].contracts.weth,
        nftContractAddress: zeroAddress,
        from: zeroAddress,
        tokenId: 0,
        price: 0,
        expiration: 9999999999,
        tokenURI: "",
      };
      const hash = await target.methods.hashRelay(relay).call();
      const message = await target.methods.encodeRelay(relay).call();
      await target.methods.lock(relay).send({ from: account });
      const requestLockTimestamp = await target.methods
        .requestedAt(hash)
        .call();
      const optimisticOracle = new web3.eth.Contract(
        OptimisticOracleV2.abi,
        optimisticOracleAddress
      );
      await optimisticOracle.methods
        .proposePriceFor(
          account,
          targetAddress,
          identifier,
          requestLockTimestamp,
          message,
          0
        )
        .send({ from: account });
      await target.methods.confirm(relay).send({ from: account });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <Card card={card} />
      <Box border="1px" borderColor="gray.200" rounded={"2xl"} p="8">
        <VStack spacing={3} mb="12">
          <FormControl>
            <FormLabel htmlFor="price">Price per Day</FormLabel>
            <Text id="price">0 ETH</Text>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="allowed">Allowed Chain</FormLabel>
            <RadioGroup id="allowed" onChange={setNetwork} value={network}>
              <Stack>
                <Radio value="rinkeby" size="sm">
                  Rinkeby
                </Radio>
                <Radio value="optimism" size="sm">
                  Optimism
                </Radio>
                <Radio value="boba" size="sm">
                  Boba
                </Radio>
                <Radio value="polygon" size="sm">
                  Polygon
                </Radio>
                <Radio value="gnosis" size="sm">
                  Gnosis Chain
                </Radio>
                <Radio value="cronos" size="sm">
                  Cronos
                </Radio>
                <Radio value="skale" size="sm">
                  SKALE
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="period">Period</FormLabel>
            <Input id="number" type="period" disabled value="1" />
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
            onClick={confirm}
          >
            Confirm
          </Button>
        )}
      </Box>
    </Grid>
  );
};
