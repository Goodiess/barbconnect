const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    console.log("req.file:", req.file); // debug check

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check that Cloudinary URL exists
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res
        .status(500)
        .json({ message: "Upload failed, no URL returned" });
    }

    return res.status(200).json({
      message: "Upload received!",
      filename: req.file.originalname,
      url: imageUrl,
    });
  } catch (err) {
    console.error("Upload error:", JSON.stringify(err, null, 2)); // logs full error
    res.status(500).json({
      message: err.message || "Internal Server Error",
      stack: err.stack, // optional for dev debugging
    });
  }
});

module.exports = router;
