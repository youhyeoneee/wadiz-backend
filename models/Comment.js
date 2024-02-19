const mongoose = require("mongoose");
const { connectDB, disconnectDB } = require("../utils/db");
const { readJson, fileNames } = require("../utils/file");
const { progressBar, figletAsync } = require("../utils/third-party");
const Campaign = require("./Campaign");

const commentSchema = new mongoose.Schema({
    body: { type: String, required: true },
    campaign: {
        type: mongoose.Schema.Types.ObjectId, // 수정된 부분
        ref: "Campaign",
        required: true,
    },
    commentType: { type: String },
    userNickname: { type: String }, // nickName
    whenCreated: { type: Date, required: true },
    commentReplys: {
        type: [mongoose.Schema.Types.ObjectId], // 수정된 부분
        ref: "Comment",
        default: [],
    },
    depth: { type: Number, required: true, default: 0 },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

// 재귀적으로 데이터를 저장하는 함수
async function saveComments(data, results) {
    const campaign = await Campaign.findOne({ campaignId: data.commonId });
    if (!campaign) {
        throw new Error("Campaign not found");
    }
    const comment = new Comment({
        body: data.body,
        campaign: campaign._id,
        commentType: data.commentType,
        userNickname: data.nickName,
        whenCreated: new Date(data.whenCreated),
        depth: data.depth,
        commentReplys: [],
    });

    if (data.commentReplys) {
        for (const commentReply of data.commentReplys) {
            comment.commentReplys.push(
                await saveComments(commentReply, results)
            );
        }
    }
    results.push(comment);
    return comment._id;
}

async function saveDataToDB() {
    try {
        const figletData = await figletAsync("Save Comments To DB");
        console.log(figletData);

        await connectDB();

        const comments = await readJson(fileNames.comments);
        let results = [];

        console.log("\nGet all comments from json");
        progressBar.start(comments.length, 0);
        for (const comment of comments) {
            await saveComments(comment, results);
            progressBar.increment();
        }

        console.log("\nSave to db");
        progressBar.start(results.length, 0);
        for (const comment of results) {
            await comment.save();
            progressBar.increment();
        }

        disconnectDB();
        console.log("\nData saved successfully!");
    } catch (error) {
        progressBar.stop();
        console.error("\nError saving data:", error);
    }
}

if (require.main === module) {
    saveDataToDB();
}
