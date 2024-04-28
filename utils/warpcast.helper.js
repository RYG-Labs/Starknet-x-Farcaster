const axios = require("axios");
const { validateFrameMessage } = require("frames.js");
const { WarpcastDocument } = require("../models/warpcast.model");
const WarpcastUser = require("../models/warpcastUser.model");
const nodeCache = require("node-cache");
const dotenv = require("dotenv");
const Card = require("../pages/imageCard").default;
const React = require("react");
const ReactDOMServer = require("react-dom/server");

const cache = new nodeCache();

async function getFarcasterNameForFid(fid) {
  try {
    const url = `${process.env.PINATA_HUB}/users/${fid}`;
    const apiKey = process.env.PINATA_KEY;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (res.status >= 200 && res.status < 300) {
      const data = res.data;
      const username = data.data.username;
      return username;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function getPostFrame(contractAddress, warpcast, target, label, message) {
  const frame = {
    version: "vNext",
    image: `${process.env.FLEX_URL}/warpcast/${contractAddress}/image?message=${message}`,
    imageAspectRatio: "1:1",
    buttons: [
      {
        label: label,
        action: "post",
        target: `${process.env.FLEX_URL}/warpcast/${contractAddress}/${target}`,
      },
    ],
    ogImage: `${warpcast.nftImage}`,
    postUrl: `${process.env.FLEX_URL}/warpcast/${contractAddress}/${target}`,
  };
  return frame;
}

function getStaticPostFrame(contractAddress, warpcast, target, label) {
  const frame = {
    version: "vNext",
    image: `${warpcast.nftImage}`,
    imageAspectRatio: "1:1",
    buttons: [
      {
        label: label,
        action: "post",
        target: `${process.env.FLEX_URL}/warpcast/${contractAddress}/${target}`,
      },
    ],
    ogImage: `${warpcast.nftImage}`,
    postUrl: `${process.env.FLEX_URL}/warpcast/${contractAddress}/${target}`,
  };
  return frame;
}

function getLinkFrame(contractAddress, warpcast, target, label, message) {
  const frame = {
    version: "vNext",
    image: `${process.env.FLEX_URL}/warpcast/${contractAddress}/image?message=${message}`,
    imageAspectRatio: "1:1",
    buttons: [
      {
        label: label,
        action: "link",
        target: `${target}`,
      },
    ],
    ogImage: `${warpcast.nftImage}`,
    postUrl: `${target}`,
  };
  return frame;
}

function getMintFrame(contractAddress, warpcast, message) {
  const frame = {
    version: "vNext",
    image: `${process.env.FLEX_URL}/warpcast/${contractAddress}/image?message=${message}`,
    imageAspectRatio: "1:1",
    inputText: "Enter your Starknet address",
    buttons: [
      {
        label: `Mint`,
        action: "post",
        target: `${process.env.FLEX_URL}/warpcast/${contractAddress}/mint`,
      },
    ],
    ogImage: `${warpcast.nftImage}`,
    postUrl: `${process.env.FLEX_URL}/warpcast/${contractAddress}/mint`,
  };
  return frame;
}

async function checkExistWarpcastUser(fid, nftContractIds) {
  const warpcastUser = await WarpcastUser.findOne({
    fid,
    nftContractIds,
  });
  return !!warpcastUser;
}

async function hasFollowQuest(warpcast) {
  try {
    if (!warpcast) {
      throw new Error("warpcast not found for the given contract address.");
    }

    const followQuestExists = warpcast.quests?.some(
      (quest) => quest.option === "Follow"
    );
    return !!followQuestExists;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

// Function to retrieve rendered HTML content (cached if available)
async function getRenderedComponentString(warpcast, message) {
  const cacheKey = `${warpcast.nftImage}:${message}`; // Unique cache key based on input parameters

  // Check cache for cached content
  const cachedContent = cache.get(cacheKey);
  if (cachedContent) {
    return cachedContent; // Return cached content if available
  }

  // If cached content is not available, render the component
  const componentString = ReactDOMServer.renderToString(
    React.createElement(Card, {
      message: message,
      image: warpcast.nftImage,
    })
  );
  // Cache the rendered component string
  cache.set(cacheKey, componentString); // Cache content with expiration settings if needed
  console.log("cacheKey: ", cacheKey);

  return componentString; // Return the rendered component string
}

module.exports = {
  getFarcasterNameForFid,
  getPostFrame,
  getStaticPostFrame,
  getLinkFrame,
  getMintFrame,
  checkExistWarpcastUser,
  hasFollowQuest,
  getRenderedComponentString,
};
