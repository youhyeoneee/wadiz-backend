const express = require("express");
const router = express.Router();

const Campaign = require("../models/Campaign.js");
const { mongoose } = require("mongoose");

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
            (item) => item.depth !== 1 && item.commentReplys.length !== 0
        );
        res.json(campaign);
    } catch (err) {
        if (!mongoose.Types.ObjectId.isValid(campaignId)) {
            return res.status(404).send("Bad request: invalid campaign id");
        }
        return next(err);
    }
});

module.exports = router;
