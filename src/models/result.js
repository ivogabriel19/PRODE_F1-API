// src/models/Result.js
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  raceId: String,
  raceYear: Number,
  prediccion: {
    p1: String,
    p2: String,
    p3: String,
  },
  submittedAt: Date,
  processedAt: { type: Date, default: Date.now },
  score: { type: Number, required: true },
});

const Result = mongoose.model("Result", resultSchema);

export default Result;
