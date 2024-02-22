const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { Campaign } = require("../models/Campaign.js");
const Comment = require("../models/Comment.js");

// 조회
router.get("/campaign", function (req, res, next) {
    Campaign.find()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return next(err);
        });
});

router.get("/:campaignId", async function (req, res, next) {
    const { campaignId } = req.params;
    try {
        const campaign = await Campaign.findById(campaignId).populate({
            path: "comments",
            populate: {
                path: "commentReplys",
            },
        });

        campaign.comments = campaign.comments.filter(
            (item) => item.depth === 0 || item.commentReplys.length > 0
        );
        res.json(campaign);
    } catch (err) {
        if (!mongoose.Types.ObjectId.isValid(campaignId)) {
            return res.status(404).send("Bad request: invalid campaign id");
        }
        return next(err);
    }
});

router.post("/:campaignId/comment", async function (req, res, next) {
    const { campaignId } = req.params;
    const { body, userNickname } = req.body;

    try {
        const comment = await Comment.writeComment(
            body,
            campaignId,
            userNickname
        );

        res.status(201).json(comment);
    } catch (err) {
        if (!mongoose.Types.ObjectId.isValid(campaignId)) {
            return res.status(404).send("Bad request: invalid campaign id");
        }
        return next(err);
    }
});

router.post("/:campaignId/comment/:commentId", async function (req, res, next) {
    const { campaignId, commentId } = req.params;
    const { body, userNickname } = req.body;
    try {
        const comment = await Comment.writeComment(
            body,
            campaignId,
            userNickname,
            commentId
        );

        res.status(201).json(comment);
    } catch (err) {
        if (!mongoose.Types.ObjectId.isValid(campaignId)) {
            return res.status(404).send("Bad request: invalid campaign id");
        } else if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(404).send("Bad request: invalid comment id");
        }
        return next(err);
    }
});

module.exports = router;
