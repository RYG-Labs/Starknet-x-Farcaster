const {
  Contract,
  RpcProvider,
  json,
  uint256,
  num,
  Account,
  getChecksumAddress,
  validateChecksumAddress,
} = require("starknet");
const { abi, flexAddress, nftAddress, ETH_ADDRESS } = require("./warpcastUtil");
const dotenv = require("dotenv");
const fs = require("fs");
const { decryptData, formattedContractAddress } = require("./utils");

// Connect provider
const providerUrl = process.env.TEST_PROVIDER_URL;
const provider = new RpcProvider({ nodeUrl: providerUrl });

// Connect the ERC20 ETH instance
const { ETHabi } = require("../abis/erc20ABI");

async function mintNft(nftAddress, payer, toAddress) {

  // Connect your account
  const decodePrivateKey = decryptData(payer.private_key);
  const account0Address = payer.payer_address;
  const payerAccount = new Account(provider, account0Address, decodePrivateKey);
  const flexDropContract = new Contract(abi, flexAddress, provider);

  flexDropContract.connect(payerAccount);
  console.log(payer);
  console.log("Invoke Tx - Minting 1 NFT to...");
  try {
    const { transaction_hash: mintTxHash } = await flexDropContract.mint_public(
      nftAddress,
      1,
      "0x05dcb49a8217eab5ed23e4a26df044edaf1428a5c7b30fa2324fa39a28288f6b",
      toAddress,
      1,
      {
        maxFee: 900000000000000,
      }
    );
    // Wait for the invoke transaction to be accepted on Starknet
    console.log(`Waiting for Tx to be Accepted on Starknet - Minting...`);
    const txs = await provider.waitForTransaction(mintTxHash);

    return txs.transaction_hash;
  } catch (error) {
    console.log("Minting Failed");
    return error;
  }
}

async function checkPayerBalance(address) {
  const ethContract = new Contract(ETHabi, ETH_ADDRESS, provider);

  // Interactions with the contract with call
  const res1 = await ethContract.balanceOf(address);
  const balance = BigInt(uint256.uint256ToBN(res1.balance));
  const unsufficient = balance < 0.000025 ? true : false;
  return unsufficient;
}

/**
 * Splits a string into an array of short strings (felts). A Cairo short string (felt) represents up to 31 utf-8 characters.
 * @param {string} str - The string to convert
 * @returns {bigint[]} - The string converted as an array of short strings as felts
 */
function strToFeltArr(str) {
  const size = Math.ceil(str.length / 31);
  const arr = Array(size);

  let offset = 0;
  for (let i = 0; i < size; i++) {
    const substr = str.substring(offset, offset + 31).split("");
    const ss = substr.reduce(
      (memo, c) => memo + c.charCodeAt(0).toString(16),
      ""
    );
    arr[i] = BigInt("0x" + ss);
    offset += 31;
  }
  return arr;
}

function formatBalance(qty, decimals) {
  const balance = String("0").repeat(decimals) + qty.toString();
  const rightCleaned = balance.slice(-decimals).replace(/(\d)0+$/gm, "$1");
  const leftCleaned = BigInt(
    balance.slice(0, balance.length - decimals)
  ).toString();
  return leftCleaned + "." + rightCleaned;
}

function validateAddress(address) {
  try {
    // Check address length
    if (address.length !== 64 && address.length !== 66) {
      return false;
    }

    const checksumAddr = getChecksumAddress(address);

    const isValid = validateChecksumAddress(checksumAddr);

    // Remove "0x" prefix if present
    address = address.startsWith("0x") ? address.slice(2) : address;

    const regex = /^[0-9a-fA-F]{64}$/;

    // Check if address matches the format
    if (!regex.test(address)) {
      return false;
    }

    return isValid;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  mintNft,
  checkPayerBalance,
  strToFeltArr,
  formatBalance,
  validateAddress,
};
