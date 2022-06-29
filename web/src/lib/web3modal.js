import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import * as UAuthWeb3Modal from "@uauth/web3modal";
import UAuthSPA from "@uauth/js";

const uauthOptions = {
  clientID: "3ea6923c-2583-4dbf-907f-ceb6483bf22b",
  redirectUri: "https://hackathon-polygon-encoded.web.app/",
  scope: "openid wallet",
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "95f65ab099894076814e8526f52c9149",
    },
  },
  "custom-uauth": {
    // The UI Assets
    display: UAuthWeb3Modal.display,

    // The Connector
    connector: UAuthWeb3Modal.connector,

    // The SPA libary
    package: UAuthSPA,

    // The SPA libary options
    options: uauthOptions,
  },
};

export const web3Modal = new Web3Modal({ providerOptions });
UAuthWeb3Modal.registerWeb3Modal(web3Modal);
