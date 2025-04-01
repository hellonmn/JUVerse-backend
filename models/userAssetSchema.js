const mongoose = require('mongoose');
const { Schema } = mongoose;

const userAssetSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: { type: String, required: true },
    type: { type: String, required: true },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAsset", userAssetSchema);
