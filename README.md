# Starknet NFT with Farcaster Frame

- This repository showcases the integration of Flex NFT Marketplace Openedition contract, with Farcaster Frame—a feature of the Farcaster protocol launched on Warpcast. Farcaster Frames revolutionize user experiences by seamlessly embedding external applications within social feeds, enhancing engagement and security. With this integration, users can claim Starknet NFTs directly within Warpcast, simplifying the NFT experience and fostering a more immersive environment for collectors and communities. Explore the repository to learn more about how Flex leverages Farcaster Frame to enhance the NFT marketplace experience.
- Creators have the ability to craft OpenEdition NFT Frames, allowing Warpcast users to claim NFTs by completing quests such as liking, recasting, or following the creator. This innovative feature incentivizes user engagement and fosters a deeper connection between creators and their audience. The creators needs to fund the payer_address for the NFTs claimming transactions of the users, the frame will respond reasonably to the balance of the payer_address.
## Table of Contents
- [Introduction](#starknet-nft-with-farcaster-frame)
- [Installation](#installation)
- [Endpoints](#endpoints)

## Installation

To use the this repository, ensure you have the necessary dependencies installed. The API requires Node.js and npm. Clone the repository and install dependencies using the following commands:

```bash
git clone https://github.com/TranNhi27/flex-warpcast.git
cd flex-warpcast
npm install
```
- .env file:
```bash
PROVIDER_URL={The URL of the mainnet provider.}
TEST_PROVIDER_URL={The URL of the test provider.}
FLEX_URL={The URL for the service, typically running locally on port 3000.}
HUB_URL=https://nemes.farcaster.xyz:2281 {The URL for the Farcaster hub service, used for interaction with Farcaster Hub}
FLEX_DOMAIN=https://hyperflex.market {The domain for the Hyperflex marketplace, where NFTs are traded.}
FLEX_INVENTORY=https://hyperflex.market/user 
PINATA_HUB=https://api.pinata.cloud/v3/farcaster {The URL for the Pinata farcaster hub service}
PINATA_KEY= {The API key for accessing Pinata services.}
MONGODB_URI={The URI for connecting to MongoDB}

SECRET_KEY_ENCODED={The encoded secret key used for encryption or authentication.}
SECREY_IV_ENCODED={The encoded initialization vector (IV) used for encryption.}
ENCRYPTION_METHOD={The encryption method or algorithm used for encoding data.}

```
## Endpoints
1. POST /wallets/create
This endpoint creates a new wallet for a creator with the specified fee type (ETH or STRK).
```bash
{
  "creator_address": "<Creator's Ethereum or Starknet address>",
  "fee_type": "ETH" | "STRK"
}
```

2. POST /wallets/deploy
This endpoint confirms the deployment of the wallet account for a creator with the specified fee type (ETH or STRK).
```bash
{
  "creator_address": "<Creator's Ethereum or Starknet address>",
  "fee_type": "ETH" | "STRK"
}
```
**Save the payer_address to use for #3 API**

3. POST /contracts/add
- By using the /contracts/add endpoint, the server creates a Farcaster NFT Frame, allowing users to interact with the added contract within the Warpcast platform seamlessly.
- Request Body
```bash
{
  "contractAddress": "<Contract Address>",
  "quests": "<Quests>",
  "nftImage": "<NFT Image URL>",
  "tokenAmount": "<Token Amount>",
  "farcasterFid": "<Farcaster FID>",
  "payerAddress": "<Payer Address>"
}
```
- Example:
```bash
{
  "contractAddress": "0x51ae51aa498b72616720197d3ac98bb0a6778ed32b018b7b75154b2f90f23d6",
  "quests": [
    {
      "option": "Follow",
      "selection": "375631"
    },
    {
      "option": "Like",
      "selection": "375631"
    }
  ],
  "nftImage": "https://hyperflex.market/assets/avt-mint-d59caf22.png",
  "tokenAmount": 100,
  "farcasterFid": 375631,
  "payerAddress": "0x6781b9fdd8bd73b901be20780bf1f2c4dbbd9b9a7e18eeab197b38475a9c4c3"
}

```
### Frame URI
The Frame URI for accessing the added contract will be servername/contractAddress. The creators simply **casts** this link to Warpcast, enabling users to interact with the NFT Frame effortlessly.
 
