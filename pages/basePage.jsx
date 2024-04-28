const React = require("react");

function ImageWithText({ imageUrl, nftName, creator }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ flex: "3", paddingRight: "20px" }}>
        <img
          src="/community.png"
          alt="Image"
          style={{ width: "100%", maxWidth: "75vw", height: "auto" }}
        />
      </div>
      <div style={{ flex: "1" }}>
        <div style={{ marginBottom: "10px" }}>
          <strong>{nftName}</strong>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <span>{creator}</span>
        </div>
        <a href="https://hyperflex.market/" style={{ textDecoration: "none" }}>
          <button
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Mint on Flex
          </button>
        </a>
      </div>
    </div>
  );
}

export default ImageWithText; 
