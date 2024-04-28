const { default: mongoose } = require("mongoose");

// Define the interface for quest document
const QuestSchema = new mongoose.Schema({
  option: {
    type: String,
    enum: ["Like", "Follow", "Recast", "NFTHold", "PoapHold"], // Restrict options
    required: true,
  },
  selection: {
    type: String,
    required: function () {
      return !!this.option;
    },
  },
});

// Define the interface for openedition document
const WarpcastSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    unique: true,
  },
  quests: [QuestSchema], // quests is now optional
  nftImage: String,
  tokenAmount: Number,
  farcasterFid: Number,
  payerAddress: String,
});

module.exports = mongoose.model("Warpcast", WarpcastSchema);
