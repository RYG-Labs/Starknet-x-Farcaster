const mongoose = require("mongoose");

// Define the schema for the warpcast user document
const warpcastUserSchema = new mongoose.Schema({
  fid: { type: Number, required: true },
  nftContractIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Warpcast" }],
});

// Define the model for the warpcast user document
const WarpcastUser = mongoose.model("WarpcastUser", warpcastUserSchema);

module.exports = WarpcastUser;
