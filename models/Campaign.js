const mongoose = require("mongoose");
const { connectDB, disconnectDB } = require("../utils/db");
const { readJson, fileNames } = require("../utils/file");
const { progressBar, figletAsync } = require("../utils/third-party");

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

async function saveDataToDB() {
    try {
        const figletData = await figletAsync("Save Campaigns To DB");
        console.log(figletData);

        const jsonData = await readJson(fileNames.campaignList);
        progressBar.start(jsonData.length, 0);

        await connectDB();

        for (const data of jsonData) {
            const campaign = new Campaign({
                campaignId: data.campaignId,
                categoryName: data.categoryName,
                title: data.title,
                totalBackedAmount: data.totalBackedAmount,
                photoUrl: data.photoUrl,
                nickName: data.nickName,
                coreMessage: data.coreMessage,
                whenOpen: new Date(data.whenOpen),
                achievementRate: data.achievementRate,
            });
            await campaign.save();
            progressBar.increment();
        }
        disconnectDB();
        console.log("\nData saved successfully!");
    } catch (error) {
        progressBar.stop();
        console.error("\nError saving data:", error);
    }
}

module.exports = Campaign;

if (require.main === module) {
    saveDataToDB();
}
