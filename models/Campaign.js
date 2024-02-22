const mongoose = require("mongoose");
const { connectDB, disconnectDB } = require("../utils/db");
const { readJson, fileNames } = require("../utils/file");
const { progressBar, figletAsync } = require("../utils/third-party");
const Comment = require("./Comment");

const campaignSchema = new mongoose.Schema(
    {
        campaignId: { type: String, required: true },
        categoryName: { type: String, required: true },
        title: { type: String, required: true },
        totalBackedAmount: { type: Number, required: true },
        photoUrl: { type: String, required: true },
        nickName: { type: String, required: true },
        coreMessage: { type: String, required: true },
        whenOpen: { type: Date, required: true },
        achievementRate: { type: Number, required: true },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
        },
        toObject: {
            virtuals: true,
            versionKey: false,
        },
    }
);

campaignSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "campaign",
    localField: "_id",
});

campaignSchema.statics.getCampaignList = async function (page = 1, size = 10) {
    return this.find()
        .skip((page - 1) * size)
        .limit(size);
};

campaignSchema.statics.getCampaign = async function (campaignId) {
    return await this.findById(campaignId).populate("comments");
};

const Campaign = mongoose.model("Campaign", campaignSchema);

async function saveDataToDB(jsonData) {
    const figletData = await figletAsync("Save Campaigns To DB");
    console.log(figletData);
    try {
        await connectDB();
        progressBar.start(jsonData.length, 0);
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

module.exports = { saveDataToDB, Campaign };

if (require.main === module) {
    (async () => {
        try {
            const jsonData = await readJson(fileNames.campaignList);
            saveDataToDB(jsonData);
        } catch (error) {
            console.error("Error reading JSON:", error);
        }
    })();
}
