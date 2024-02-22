const { saveDataToDB } = require("../models/Campaign");
const { fetchPagePost } = require("../utils/fetch");
const { fileNames, saveJson } = require("../utils/file");
const { figletAsync } = require("../utils/third-party");

async function fetchMain(url) {
    try {
        const response = await fetchPagePost(url, data);
        if (response) {
            const figletData = await figletAsync("Wadiz Campaigns Crawler");
            console.log(figletData);

            let result = response.data.data["list"];

            // DB에 적재
            saveDataToDB(result);

            // 파일로 저장
            await saveJson(fileNames.campaignList, result);
        }
    } catch (error) {
        console.error("Error fetching main:", error.message);
    }
}

const data = {
    startNum: 0,
    order: "support",
    limit: 20,
    categoryCode: "",
    endYn: "",
};

// fetch
const url = "https://service.wadiz.kr/api/search/funding";
fetchMain(url);
