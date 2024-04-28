const { BAD, OK } = require("../core/success.response");
const {
  createArgentWalletByEth,
  deployArgentWalletByEth,
  createArgentWalletByStrk,
  deployArgentWalletBySTRK,
} = require("../utils/cronWallet");
const { decryptData, formattedContractAddress } = require("../utils/utils");
const Warpcast = require("../models/warpcast.model");
const PayerModel = require("../models/creatorPayer.model");
const {
  Account,
  Contract,
  Provider,
  constants,
  num,
  CallData,
  cairo,
} = require("starknet");

const abiFlex = require("../abis/flexAbi.json");

const {
  FLEX_HASH,
  RPC_MAINET,
  FLEX_RECIPT_HASH,
  STRK_HASH,
  ETH_HASH,
  RPC_TESTNET,
  FLEXDROP_TESTNET,
} = require("../constants");

class OpenEditionController {
  createNewWallet = async (req, res, next) => {
    const { creator_address, fee_type } = req.body;
    const FeeType = ["ETH", "STRK"];
    let formatCreatorAddress = formattedContractAddress(creator_address);
    if (FeeType.indexOf(fee_type) === -1) {
      return new BAD({
        message: "Invalid Fee Type. It Must be ETH or STRK",
      });
    }

    try {
      let data;
      if (fee_type === "ETH") {
        data = await createArgentWalletByEth(formatCreatorAddress);
      } else if (fee_type == "STRK") {
        data = await createArgentWalletByStrk(formatCreatorAddress);
      }

      return new OK({
        metadata: {
          payer_address: data.payer_address,
          creator_address: data.creator_address,
          suggested_max_fee: data.suggested_max_fee,
          fee_type: data.fee_type,
        },
      }).send(res);
    } catch (error) {
      return new BAD({ message: error.message }).send(res);
    }
  };
  confirmDeployAccount = async (req, res, next) => {
    const { creator_address, fee_type } = req.body;
    const FeeType = ["ETH", "STRK"];
    let formatCreatorAddress = formattedContractAddress(creator_address);
    if (FeeType.indexOf(fee_type) === -1) {
      return new BAD({
        message: "Invalid Fee Type. It Must be ETH or STRK",
      });
    }
    try {
      let data;
      if (fee_type === "ETH") {
        data = await deployArgentWalletByEth(formatCreatorAddress);
      } else if (fee_type == "STRK") {
        data = await deployArgentWalletBySTRK(formatCreatorAddress);
      }
      return new OK({
        metadata: {
          payer_address: data.payer_address,
          creator_address: data.creator_address,
          deploy_hash: data.deploy_hash,
          fee_type: data.fee_type,
        },
      }).send(res);
    } catch (error) {
      return new BAD({
        message: error.message,
        metadata: error.meta,
      }).send(res);
    }
  };
}

module.exports = new OpenEditionController();
