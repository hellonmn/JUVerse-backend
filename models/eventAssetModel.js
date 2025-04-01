const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventAssetSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    path: { type: String, required: true },
    filename: { type: String, required: true },
    type: { type: String, required: true },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventAsset", eventAssetSchema);
