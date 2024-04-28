const { OK, BAD } = require("../core/success.response");
const puppeteer = require("puppeteer");
const warpcastModel = require("../models/warpcast.model");
const WarpcastUser = require("../models/warpcastUser.model.js");
const ImageWithText = require("../pages/basePage.jsx").default;
const Card = require("../pages/imageCard.jsx").default;
const ReactDOMServer = require("react-dom/server");
const {
  getFrameHtml,
  validateFrameMessage,
  getFrameMessage,
  Frame,
} = require("frames.js");
const {
  getFarcasterNameForFid,
  getPostFrame,
  getLinkFrame,
  getStaticPostFrame,
  getMintFrame,
  checkExistWarpcastUser,
  hasFollowQuest,
  getRenderedComponentString,
} = require("../utils/warpcast.helper.js");
const browserPromise = puppeteer.launch();
const {
  checkPayerBalance,
  mintNft,
  validateAddress,
} = require("../utils/contract.js");
const { decryptData, formattedContractAddress } = require("../utils/utils");
const PayerModel = require("../models/creatorPayer.model");

class WarpcastController {
  addContract = async (req, res, next) => {
    try {
      const {
        contractAddress,
        quests,
        nftImage,
        tokenAmount,
        farcasterFid,
        payerAddress,
      } = req.body;
      const warpcast = new warpcastModel({
        contractAddress,
        quests,
        nftImage,
        tokenAmount,
        farcasterFid,
        payerAddress,
      });
      const savedWarpcast = await warpcast.save();
      return new OK({
        metadata: {
          contractAddress: contractAddress,
          payerAddress: payerAddress,
        },
      }).send(res);
    } catch (error) {
      console.error("Error adding data to collection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getWarpcastByAddress = async (req, res, next) => {
    try {
      const contractAddress = req.params.contract_address;

      // Check if the Warpcast document exists
      const warpcast = await warpcastModel.findOne({
        contractAddress: contractAddress,
      });

      if (!warpcast) {
        return res.status(404).json({ error: "Warpcast document not found." });
      }

      const creatorName = await getFarcasterNameForFid(warpcast.farcasterFid);

      if (req.accepts("html")) {
        const imageWithTextProps = {
          imageUrl: warpcast.nftImage,
          nftName: "Test NFT",
          creator: creatorName,
        };

        const appHtml = ReactDOMServer.renderToString(
          ImageWithText(imageWithTextProps)
        );

        res.setHeader("Content-Type", "text/html");
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta http-equiv="Content-Security-Policy" content="img-src 'self' data: https://hyperflex.market;">
              <meta charset="UTF-8">
              <meta property="og:title" content="Flex Marketplace Openedition on Starknet" />
              <meta property="og:image" content="${warpcast.nftImage}" />
              <meta name="fc:frame" content="vNext" />
              <meta name="fc:frame:image" content="${warpcast.nftImage}" />
              <meta name="fc:frame:button:1" content="Get Started" />
              <meta name="fc:frame:post_url" content="${process.env.FLEX_URL}/warpcast/${contractAddress}/start" />
            </head>
            <body>
              <div id="root">${appHtml}</div>
            </body>
            </html>
          `);
      } else {
        return res.status(200).json(warpcast);
      }
    } catch (error) {
      console.error("Error finding warpcast:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getMessageImage = async (req, res, next) => {
    const contractAddress = req.params.contractAddress;
    const message = req.query.message || "Flex Starknet Marketplacee";
    try {
      // Check if the Warpcast document exists
      const warpcast = await warpcastModel.findOne({
        contractAddress: contractAddress,
      });

      if (!warpcast) {
        return res.status(404).json({ error: "Warpcast document not found." });
      }

      // Check if the image file exists
      if (warpcast.nftImage) {
        const browser = await browserPromise; // Reuse the global browser instance
        const page = await browser.newPage();

        // Set viewport size
        await page.setViewport({ width: 800, height: 800 });

        // Set the HTML content of the page to the rendered React component
        const componentString = await getRenderedComponentString(
          warpcast,
          message
        ); // Function to retrieve rendered HTML content (cached if available)
        await page.setContent(componentString);

        // Screenshot the component
        const imageBuffer = await page.screenshot({ fullPage: true });

        // Set response headers
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": imageBuffer.length,
        });

        // Send the image buffer as response
        res.end(imageBuffer);
      } else {
        res.status(404).send("Image not found");
      }
    } catch (error) {
      console.error("Error rendering component:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  postStartFrame = async (req, res, next) => {
    try {
      const body = req.body;
      const { isValid, message } = await validateFrameMessage(body, {
        hubHttpUrl: `${process.env.HUB_URL}`,
      });

      if (!isValid || !message) {
        return res.status(400).send("Invalid message");
      }

      const contractAddress = req.params.contractAddress;
      // Check if the Warpcast document exists
      const warpcast = await warpcastModel.findOne({
        contractAddress: contractAddress,
      });

      if (!warpcast) {
        return res.status(404).json({ error: "Warpcast document not found." });
      }

      let frame;
      const creatorName = await getFarcasterNameForFid(warpcast.farcasterFid);
      if (message?.data.frameActionBody.castId?.fid == warpcast.farcasterFid) {
        frame = getLinkFrame(
          contractAddress,
          warpcast,
          `https://warpcast.com/${creatorName}`,
          `Please go to the author @${creatorName} page to enroll in the event`,
          "NFT Openedition on Flex Marketplace"
        );
      } else {
        frame = getStaticPostFrame(
          contractAddress,
          warpcast,
          "react",
          "Like and Recast to claim the NFT"
        );
      }

      const html = getFrameHtml(frame);
      res.status(200).send(html);
    } catch (error) {
      res.status(500).json({ error: error.message }); // Assuming error.message provides a meaningful error description
    }
  };

  postReactFrame = async (req, res, next) => {
    try {
      const body = req.body;
      const { isValid, message } = await validateFrameMessage(body, {
        hubHttpUrl: `${process.env.HUB_URL}`,
      });

      const contractAddress = req.params.contractAddress;
      // Check if the Warpcast document exists
      const warpcast = await warpcastModel.findOne({
        contractAddress: contractAddress,
      });

      if (!warpcast) {
        return res.status(404).json({ error: "warpcast document not found." });
      }

      if (warpcast != null) {
        const frameMessage = await getFrameMessage(body, {
          hubHttpUrl: `${process.env.HUB_URL}`,
        });

        const userFid = frameMessage.requesterFid;

        let frame;
        if (frameMessage.likedCast && frameMessage.recastedCast) {
          if (await hasFollowQuest(warpcast)) {
            frame = getStaticPostFrame(
              contractAddress,
              warpcast,
              "follow",
              "Follow to claim the NFT"
            );
            const html = getFrameHtml(frame);
            return res
              .status(200)
              .header("Content-Type", "text/html")
              .send(html);
          }
          const claimedUser = await checkExistWarpcastUser(
            userFid,
            warpcast._id
          );

          if (await checkPayerBalance(warpcast.payerAddress)) {
            frame = getLinkFrame(
              contractAddress,
              warpcast,
              `${process.env.FLEX_DOMAIN}`,
              "Mint on Flex",
              "Free Claim NFTs reached limits"
            );
          }
          if (!claimedUser) {
            frame = getMintFrame(
              contractAddress,
              warpcast,
              "Congrats! You're eligible for the NFT"
            );
          } else {
            frame = getLinkFrame(
              contractAddress,
              warpcast,
              `${process.env.FLEX_DOMAIN}`,
              "Learn How To Make This At Flex",
              "You have claimed the NFT"
            );
          }
        } else {
          frame = getPostFrame(
            contractAddress,
            warpcast,
            "react",
            "Refresh",
            "Refresh if you have liked and recasted"
          );
        }
        const html = getFrameHtml(frame);
        res.status(200).header("Content-Type", "text/html").send(html);
      } else {
        res.status(404).json({
          message: "No warpcast found with contractAddress: " + contractAddress,
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  postFollowFrame = async (req, res, next) => {
    try {
      const body = req.body;
      const { isValid, message } = await validateFrameMessage(body, {
        hubHttpUrl: `${process.env.HUB_URL}`,
      });
      const contractAddress = req.params.contractAddress;
      // Check if the Warpcast document exists
      const warpcast = await warpcastModel.findOne({
        contractAddress: contractAddress,
      });

      if (!warpcast) {
        return res.status(404).json({ error: "Warpcast document not found." });
      }
      const frameMessage = await getFrameMessage(body, {
        hubHttpUrl: `${process.env.HUB_URL}`,
      });

      let frame;
      if (frameMessage.requesterFollowsCaster) {
        const userFid = frameMessage.castId?.fid;
        const claimedUser = await checkExistWarpcastUser(userFid, warpcast._id);
        // TODO: check warpcast quantity available
        const isAvailableToClaim = await checkPayerBalance(
          warpcast.payerAddress
        );

        if (isAvailableToClaim) {
          frame = getLinkFrame(
            contractAddress,
            warpcast,
            `${process.env.FLEX_DOMAIN}`,
            "Mint on Flex",
            "Free Claim NFTs reached limits"
          );

          const html = getFrameHtml(frame);
          return res.status(200).header("Content-Type", "text/html").send(html);
        }
        if (!claimedUser) {
          frame = getMintFrame(
            contractAddress,
            warpcast,
            "Congrats! You're eligible for the NFT"
          );
        } else {
          frame = getLinkFrame(
            contractAddress,
            warpcast,
            `${process.env.FLEX_DOMAIN}`,
            "Learn How To Make This At Flex",
            "You have claimed the NFT"
          );
        }
      } else {
        frame = getPostFrame(
          contractAddress,
          warpcast,
          "follow",
          "Refresh",
          "Refresh if you have followed the Creator"
        );
      }
      const html = getFrameHtml(frame);
      return res.status(200).header("Content-Type", "text/html").send(html);
    } catch (error) {
      return new BAD({
        message: error.message,
      }).send(res);
    }
  };

  postMintFrame = async (req, res, next) => {
    try {
      const body = req.body;
      const { isValid, message } = await validateFrameMessage(body, {
        hubHttpUrl: `${process.env.HUB_URL}`,
      });

      if (!isValid || !message) {
        return res.status(400).send("Invalid message");
      }

      const frameMessage = await getFrameMessage(body, {
        hubHttpUrl: `${process.env.HUB_URL}`,
      });

      const receiver = frameMessage.inputText;

      let frame;

      const contractAddress = req.params.contractAddress;
      // Check if the Warpcast document exists
      const warpcast = await warpcastModel.findOne({
        contractAddress: contractAddress,
      });

      if (!warpcast) {
        return res.status(404).json({ error: "Warpcast document not found." });
      }

      if (!validateAddress(receiver)) {
        frame = getMintFrame(
          contractAddress,
          warpcast,
          "Not a valid Stacknet address"
        );

        const html = getFrameHtml(frame);
        return res.status(200).header("Content-Type", "text/html").send(html);
      }

      let payer = await PayerModel.findOne({
        payer_address: formattedContractAddress(warpcast.payerAddress),
      });

      if (!payer) {
        return new BAD({
          message: "Payer not Found",
        }).send(res);
      }
      const fid = frameMessage.requesterFid;

      const claimedUser = await checkExistWarpcastUser(fid, warpcast._id);
      if (!claimedUser) {
        try {
          frame = getLinkFrame(
            contractAddress,
            warpcast,
            `${process.env.FLEX_INVENTORY}/${receiver}`,
            "Check Your NFT",
            "Claimed successfully !!"
          );
          const html = getFrameHtml(frame);

          res.status(200).send(html);
          const warpcastUser = new WarpcastUser({
            fid,
            nftContractIds: [warpcast._id],
          });
          const savedWarpcastUser = await warpcastUser.save();
          const claimFrameResult = await mintNft(
            warpcast.contractAddress,
            payer,
            receiver
          );
        } catch (err) {
          console.log(err);
          return new BAD({
            message: error.message,
          }).send(res);
        }
      }
    } catch (error) {
      console.log(error);
      return new BAD({
        message: error.message,
      }).send(res);
    }
  };
}

module.exports = new WarpcastController();
