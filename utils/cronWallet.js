const {
  Account,
  ec,
  stark,
  Provider,
  hash,
  CallData,
  Contract,
  constants,
  num,
  json,
  RPC,
} = require("starknet");
const {
  encryptData,
  decryptData,
  formattedContractAddress,
  formatBalance,
} = require("./utils");

const fs = require("fs");

const {
  RPC_MAINET,
  ARGENTX_HASH,
  RPC_TESTNET,
  STRK_HASH,
  ETH_HASH,
} = require("../constants");

const CreatorPayerModel = require("../models/creatorPayer.model");

const createArgentWalletByEth = async (creator_address) => {
  let creator = await CreatorPayerModel.findOne({
    creator_address: creator_address,
    wallet_type: "ARGENTX",
  });
  if (creator) {
    if (creator.deploy_hash) {
      throw new Error(
        `User Address argentx already deploy at: ${creator.deploy_hash}`
      );
    }

    const decodePrivateKey = decryptData(creator.private_key);
    const starkKeyPubAX = ec.starkCurve.getStarkKey(decodePrivateKey);

    // Calculate future address of the ArgentX account
    const AXConstructorCallData = CallData.compile({
      owner: starkKeyPubAX,
      guardian: "0",
    });
    const provider = new Provider({ nodeUrl: RPC_TESTNET });
    const accountAX = new Account(
      provider,
      creator.payer_address,
      decodePrivateKey,
      undefined,
      constants.TRANSACTION_VERSION.V3
    );

    const estimateAccountDeployFee = await accountAX.estimateAccountDeployFee({
      classHash: ARGENTX_HASH,
      constructorCalldata: AXConstructorCallData,
      contractAddress: creator.payer_address,
    });
    let feeDeploy = formatBalance(estimateAccountDeployFee.suggestedMaxFee, 18);
    if (parseFloat(feeDeploy) < 0.0002) {
      feeDeploy = feeDeploy * 1000;
    }
    return {
      payer_address: creator.payer_address,
      creator_address: creator.creator_address,
      suggested_max_fee: feeDeploy.toString(),
      fee_type: "ETH",
    };
  }

  // Generate public and private key pair.
  const privateKeyAX = stark.randomAddress();

  const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKeyAX);

  // Calculate future address of the ArgentX account
  const AXConstructorCallData = CallData.compile({
    owner: starkKeyPubAX,
    guardian: "0",
  });

  const newPrivatekey = encryptData(privateKeyAX);

  const AXcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPubAX,
    ARGENTX_HASH,
    AXConstructorCallData,
    0
  );
  const payerAddress = formattedContractAddress(AXcontractAddress);
  //
  const provider = new Provider({ nodeUrl: RPC_TESTNET });

  const accountAX = new Account(provider, payerAddress, privateKeyAX);

  const estimateAccountDeployFee = await accountAX.estimateAccountDeployFee({
    classHash: ARGENTX_HASH,
    constructorCalldata: AXConstructorCallData,
    contractAddress: payerAddress,
  });

  //
  let col = {
    creator_address: creator_address,
    payer_address: payerAddress,
    private_key: newPrivatekey,
    wallet_type: "ARGENTX",
  };

  const newCreator = await CreatorPayerModel.create(col);

  newCreator.save();
  let feeDeploy = formatBalance(estimateAccountDeployFee.suggestedMaxFee, 18);

  if (parseFloat(feeDeploy) < 0.0002) {
    feeDeploy = feeDeploy * 1000;
  }

  return {
    payer_address: newCreator.payer_address,
    creator_address: newCreator.creator_address,
    suggested_max_fee: feeDeploy.toString(),
    fee_type: "ETH",
  };
};

const deployArgentWalletByEth = async (creator_address) => {
  const userData = await CreatorPayerModel.findOne({
    creator_address: creator_address,
    wallet_type: "ARGENTX",
  });

  if (!userData) {
    throw new Error("User Address argentx not found");
  }
  if (userData.deploy_hash) {
    throw new Error(
      `User Address argentx already deploy at: ${userData.deploy_hash}`
    );
  }
  const decodePrivateKey = decryptData(userData.private_key);

  const provider = new Provider({ nodeUrl: RPC_TESTNET });
  const accountAX = new Account(
    provider,
    userData.payer_address,
    decodePrivateKey
  );

  const compiledERC20 = json.parse(
    fs.readFileSync("./abis/erc20OZ070.sierra.json").toString("ascii")
  );
  const contractEth = new Contract(compiledERC20.abi, ETH_HASH, provider);
  const initialEth = await contractEth.balanceOf(accountAX.address);

  const starkKeyPubAX = ec.starkCurve.getStarkKey(decodePrivateKey);
  const AXConstructorCallData = CallData.compile({
    owner: starkKeyPubAX,
    guardian: "0",
  });
  const deployAccountPayload = {
    classHash: ARGENTX_HASH,
    constructorCalldata: AXConstructorCallData,
    contractAddress: userData.payer_address,
    addressSalt: starkKeyPubAX,
  };
  const estimateAccountDeployFee = await accountAX.estimateAccountDeployFee({
    classHash: ARGENTX_HASH,
    constructorCalldata: AXConstructorCallData,
  });

  console.log("Balance ETH", formatBalance(initialEth, 18));
  if (initialEth < estimateAccountDeployFee.suggestedMaxFee) {
    throw new Error(
      `Insufficient ETH balance to deploy argentx wallet, required ${formatBalance(
        estimateAccountDeployFee.suggestedMaxFee,
        18
      )} ETH`
    );
  }
  console.log("Fee", estimateAccountDeployFee);
  const { transaction_hash: AXdAth, contract_address: AXcontractFinalAddress } =
    await accountAX.deployAccount(deployAccountPayload, {
      maxFee: estimateAccountDeployFee.suggestedMaxFee * 2n,
    });

  await provider.waitForTransaction(AXdAth);
  await CreatorPayerModel.findOneAndUpdate(
    { creator_address: userData.creator_address, wallet_type: "ARGENTX" },
    { deploy_hash: AXdAth },
    { new: true }
  );

  return {
    payer_address: AXcontractFinalAddress,
    creator_address: userData.creator_address,
    deploy_hash: AXdAth,
    fee_type: "ETH",
  };
};

const createArgentWalletByStrk = async (creator_address) => {
  let creator = await CreatorPayerModel.findOne({
    creator_address: creator_address,
    wallet_type: "ARGENTX",
  });
  if (creator) {
    if (creator.deploy_hash) {
      throw new Error(
        `User Address argentx already deploy at: ${creator.deploy_hash}`
      );
    }

    const decodePrivateKey = decryptData(creator.private_key);
    const starkKeyPubAX = ec.starkCurve.getStarkKey(decodePrivateKey);

    // Calculate future address of the ArgentX account
    const AXConstructorCallData = CallData.compile({
      owner: starkKeyPubAX,
      guardian: "0",
    });
    const provider = new Provider({ nodeUrl: RPC_TESTNET });
    const accountAX = new Account(
      provider,
      creator.payer_address,
      decodePrivateKey,
      undefined,
      constants.TRANSACTION_VERSION.V3
    );

    const estimateAccountDeployFee = await accountAX.estimateAccountDeployFee({
      classHash: ARGENTX_HASH,
      constructorCalldata: AXConstructorCallData,
      contractAddress: creator.payer_address,
    });
    let feeDeploy = formatBalance(estimateAccountDeployFee.suggestedMaxFee, 18);
    if (parseFloat(feeDeploy) < 0.4) {
      feeDeploy = feeDeploy * 100;
    }

    return {
      payer_address: creator.payer_address,
      creator_address: creator.creator_address,
      suggested_max_fee: feeDeploy.toString(),
      fee_type: "STRK",
    };
  }

  // Generate public and private key pair.
  const privateKeyAX = stark.randomAddress();

  const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKeyAX);

  // Calculate future address of the ArgentX account
  const AXConstructorCallData = CallData.compile({
    owner: starkKeyPubAX,
    guardian: "0",
  });

  const newPrivatekey = encryptData(privateKeyAX);

  const AXcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPubAX,
    ARGENTX_HASH,
    AXConstructorCallData,
    0
  );
  const payerAddress = formattedContractAddress(AXcontractAddress);

  //
  const provider = new Provider({ nodeUrl: RPC_TESTNET });
  // const accountAX = new Account(provider, payerAddress, privateKeyAX, undefined,
  //     constants.TRANSACTION_VERSION.V3);
  const accountAX = new Account(provider, payerAddress, privateKeyAX);

  const estimateAccountDeployFee = await accountAX.estimateAccountDeployFee({
    classHash: ARGENTX_HASH,
    constructorCalldata: AXConstructorCallData,
    contractAddress: payerAddress,
  });

  //
  let col = {
    creator_address: creator_address,
    payer_address: payerAddress,
    private_key: newPrivatekey,
    wallet_type: "ARGENTX",
  };

  const newCreator = await CreatorPayerModel.create(col);
  newCreator.save();
  let feeDeploy = formatBalance(estimateAccountDeployFee.suggestedMaxFee, 18);
  if (parseFloat(feeDeploy) < 0.4) {
    feeDeploy = feeDeploy * 100;
  }
  return {
    payer_address: newCreator.payer_address,
    creator_address: newCreator.creator_address,
    suggested_max_fee: feeDeploy.toString(),
    fee_type: "STRK",
  };
};

const deployArgentWalletBySTRK = async (creator_address) => {
  const userData = await CreatorPayerModel.findOne({
    creator_address: creator_address,
    wallet_type: "ARGENTX",
  });

  if (!userData) {
    throw new Error("User Address argentx not found");
  }
  if (userData.deploy_hash) {
    throw new Error(
      `User Address argentx already deploy at: ${userData.deploy_hash}`
    );
  }
  const decodePrivateKey = decryptData(userData.private_key);

  const provider = new Provider({ nodeUrl: RPC_TESTNET });
  const accountAX = new Account(
    provider,
    userData.payer_address,
    decodePrivateKey,
    undefined,
    constants.TRANSACTION_VERSION.V3
  );
  const starkKeyPubAX = ec.starkCurve.getStarkKey(decodePrivateKey);

  const compiledERC20 = json.parse(
    fs.readFileSync("./abis/erc20OZ070.sierra.json").toString("ascii")
  );
  const accountAXsierra = json.parse(
    fs.readFileSync("./abis/argentXAccount031.sierra.json").toString("ascii")
  );
  const calldataAX = new CallData(accountAXsierra.abi);
  const AXConstructorCallData = calldataAX.compile("constructor", {
    owner: starkKeyPubAX,
    guardian: "0",
  });

  const strkContract = new Contract(compiledERC20.abi, STRK_HASH, accountAX);
  // Calculate future address of the ArgentX account
  const balSTRK = await strkContract.call("balanceOf", [
    userData.payer_address,
  ]);
  const estimateAccountDeployFee = await accountAX.estimateAccountDeployFee({
    classHash: ARGENTX_HASH,
    constructorCalldata: AXConstructorCallData,
  });

  console.log("Current Balance", formatBalance(balSTRK, 18));
  if (balSTRK < estimateAccountDeployFee.suggestedMaxFee) {
    throw new Error(
      `Insufficient STRK balance to deploy argentx wallet, required ${formatBalance(
        estimateAccountDeployFee.suggestedMaxFee,
        18
      )} STRK`
    );
  }

  const deployAccountPayload = {
    classHash: ARGENTX_HASH,
    constructorCalldata: AXConstructorCallData,
    contractAddress: userData.payer_address,
    addressSalt: starkKeyPubAX,
  };

  const { transaction_hash: AXdAth, contract_address: accountAXFinalAdress } =
    await accountAX.deployAccount(deployAccountPayload);

  return {
    payer_address: accountAXFinalAdress,
    creator_address: userData.creator_address,
    deploy_hash: AXdAth,
    fee_type: "STRK",
  };
};

module.exports = {
  createArgentWalletByEth,
  createArgentWalletByStrk,
  deployArgentWalletByEth,
  deployArgentWalletBySTRK,
};
