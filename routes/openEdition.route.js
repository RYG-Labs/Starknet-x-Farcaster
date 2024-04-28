const express = require("express");
const router = express.Router();
const OpenEditionController = require("../controller/openedition.controller");

router.post("/create-wallet", OpenEditionController.createNewWallet);
router.post(
  "/confirm-deploy-account",
  OpenEditionController.confirmDeployAccount
);

module.exports = router;
