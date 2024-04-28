const config = require("../config");
const crypto = require("crypto");
const { secret_key, secret_iv, ecnryption_method } = config.moudle;

/// Encrypt and Decrypt Data
if (!secret_key || !secret_iv || !ecnryption_method) {
  throw new Error("secretKey, secretIV, and ecnryptionMethod are required");
}

const key = crypto
  .createHash("sha512")
  .update(secret_key)
  .digest("hex")
  .substring(0, 32);
const encryptionIV = crypto
  .createHash("sha512")
  .update(secret_iv)
  .digest("hex")
  .substring(0, 16);

function encryptData(data) {
  const cipher = crypto.createCipheriv(ecnryption_method, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64"); // Encrypts data and converts to hex and base64
}

// Decrypt data
function decryptData(encryptedData) {
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv(
    ecnryption_method,
    key,
    encryptionIV
  );
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  ); // Decrypts data and converts to utf8
}

// Format Contract address is valid length
function formattedContractAddress(contractAddress) {
  while (contractAddress.length < 66) {
    contractAddress = contractAddress.replace("0x", "0x0");
  }

  return contractAddress.toLowerCase().trim();
}
// Format Balance to Decimal
// Example: 1 FRI => 10**-18 STRK
function formatBalance(qty, decimals) {
  const balance = String("0").repeat(decimals) + qty.toString();
  const rightCleaned = balance.slice(-decimals).replace(/(\d)0+$/gm, "$1");
  const leftCleaned = BigInt(
    balance.slice(0, balance.length - decimals)
  ).toString();
  return leftCleaned + "." + rightCleaned;
}

function isValidObjectId(str) {
  return /^[0-9a-fA-F]{24}$/.test(str);
}

module.exports = {
  formatBalance,
  encryptData,
  decryptData,
  formattedContractAddress,
  isValidObjectId,
};
