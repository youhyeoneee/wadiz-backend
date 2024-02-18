const { fetchPageGet } = require("../utils/fetch");
const { readJson, saveJson, fileNames } = require("../utils/file");
const { figletAsync, progressBar } = require("../utils/third-party");

async function fetchMain(url) {
    try {
        const params = {
            page: 0,
            size: 20,
            commentGroupType: "CAMPAIGN",
            rewardCommentType: "",
        };

        const response = await fetchPageGet(url, params);
        if (response) {
            return response.data.data["content"];
        }
    } catch (error) {
        progressBar.stop();
        console.error("Error fetching main:", error.message);
    }
}

async function getCampaignIdList() {
    let campaignIdList = await readJson(fileNames.campaignList);
    campaignIdList = campaignIdList.map((e) => e.campaignId); // campaignId 값만 추출하여 변수에 다시 할당

    return campaignIdList;
}

async function run() {
    const figletData = await figletAsync("Wadiz Comment Crawler");
    console.log(figletData);

    campaignIdList = await getCampaignIdList();
    progressBar.start(campaignIdList.length, 0);

    let result = [];

    for (const campaignId of campaignIdList) {
        const url = `https://www.wadiz.kr/web/reward/api/comments/campaigns/${campaignId}`;
        const data = await fetchMain(url);
        result = result.concat(data);
        progressBar.increment();
    }

    await saveJson(fileNames.comments, result);
}

run();
