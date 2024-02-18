const mongoose = require("mongoose");
const connectDB = require("../utils/connectDB");

const campaignSchema = new mongoose.Schema({
    campaignId: { type: String, required: true },
    categoryName: { type: String, required: true },
    title: { type: String, required: true },
    totalBackedAmount: { type: Number, required: true },
    photoUrl: { type: String, required: true },
    nickName: { type: String, required: true },
    coreMessage: { type: String, required: true },
    whenOpen: { type: Date, required: true },
    achievementRate: { type: Number, required: true },
});

const Campaign = mongoose.model("Campaign", campaignSchema);

async function loadJsonToDB() {
    connectDB();
}

module.exports = Campaign;

loadJsonToDB();
