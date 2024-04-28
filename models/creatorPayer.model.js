const { default: mongoose } = require("mongoose");

const CreatorPayerModel = new mongoose.Schema(
  {
    // address wallet
    payer_address: {
      type: String,
      required: true,
    },
    private_key: {
      type: String,
    },
    wallet_type: {
      type: String,
      // enum: ["ARGENTX", "BRAAVOS"],
    },
    creator_address: {
      type: String,
    },
    deploy_hash: {
      type: String,
    },
  },
  {
    collection: "creatorPayer",
    timestamps: true,
  }
);
module.exports = mongoose.model("creatorPayer", CreatorPayerModel);
