import { Box, Button, Flex, Text, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import { accountState } from "../atoms/account";

import { shorten } from "../lib/utils";

export const Header = ({ isLanding }) => {
  const [account, setAccount] = useRecoilState(accountState);

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

  const disconnect = async () => {
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
    await web3Modal.clearCachedProvider();
    localStorage.clear();
    setAccount("");
    window.location.href = "/";
  };

  return (
    <Box>
      <Flex minH={"64px"} alignItems={"center"} justifyContent={"space-between"} py="8" px="4">
        <Text as={NavLink} fontSize="xl" fontWeight={"bold"} color="red.400" to="/" _focus={{ boxShadow: "none" }}>
          🖼️ XrossLend
        </Text>
        <Flex gap={"1"}>
          <>
            {!isLanding && (
              <>
                {!account ? (
                  <Button
                    onClick={connect}
                    fontSize={"xs"}
                    rounded={"2xl"}
                    backgroundColor="white"
                    border="1px"
                    borderColor="gray.200"
                  >
                    Connect Wallet
                  </Button>
                ) : (
                  <Menu>
                    <MenuButton
                      as={Button}
                      fontSize={"xs"}
                      rounded={"2xl"}
                      backgroundColor="white"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <Text>{`${shorten(account, 12)}...`}</Text>
                    </MenuButton>
                    <MenuList>
                      <MenuItem as={NavLink} to="/my" href="/my">
                        Lend
                      </MenuItem>
                      <MenuItem onClick={disconnect}>Disconnect</MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </>
            )}
          </>
        </Flex>
      </Flex>
    </Box>
  );
};
