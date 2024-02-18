const express = require("express");
const router = express.Router();

const Campaign = require("../models/Campaign.js");

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

module.exports = router;
