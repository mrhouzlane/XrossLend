const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Source Unit Test", function () {
  let weth;
  let mockNFT;
  let source;
  let deployer;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();
    const ExpandedERC20 = await ethers.getContractFactory("ExpandedERC20");
    weth = await ExpandedERC20.deploy("WETH", "weth", 6);
    await weth.deployed();

    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy();
    await mockNFT.deployed();

    const Source = await ethers.getContractFactory("Source");
    source = await Source.deploy();
    await source.deployed();
  });

  it("rent", async function () {
    const tokenId = 0;
    await mockNFT.mint(deployer.address);
    await mockNFT.setApprovalForAll(source.address, true);
    const relay = {
      currencyContractAddress: weth.address,
      nftContractAddress: mockNFT.address,
      from: deployer.address,
      tokenId,
      price: 0,
      expiration: 9999999999,
      tokenURI: "",
    };
    await expect(source.rent(relay)).to.emit(source, "Rent");
  });
});
