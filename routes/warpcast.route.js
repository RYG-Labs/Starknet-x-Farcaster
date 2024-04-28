const express = require("express");
const router = express.Router();
const warpcastController = require("../controller/warpcast.controller");

router.get("/:contract_address", warpcastController.getWarpcastByAddress);
router.post("/addContract", warpcastController.addContract);
router.get("/:contractAddress/image", warpcastController.getMessageImage);
router.post("/:contractAddress/start", warpcastController.postStartFrame);
router.post("/:contractAddress/react", warpcastController.postReactFrame);
router.post("/:contractAddress/follow", warpcastController.postFollowFrame);
router.post("/:contractAddress/mint", warpcastController.postMintFrame);

module.exports = router;
