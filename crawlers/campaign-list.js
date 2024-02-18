const {
    figletAsync,
    fetchPagePost,
    fetchFile,
    saveJsonData,
    fileNames,
    makeWriteStream,
} = require("./fetch-utils");
const cliProgress = require("cli-progress");
const { SingleBar } = require("cli-progress");

const progressBar = new SingleBar(
    {
        stopOnComplete: true,
    },
    cliProgress.Presets.shades_classic
);

async function fetchMain(url) {
    try {
        const response = await fetchPagePost(url, data);
        if (response) {
            const figletData = await figletAsync("Wadiz Campaign List Crawler");
            console.log(figletData);

            let result = response.data.data["list"];
            progressBar.start(result.length, 0);

            await Promise.all(
                result.map(async (e, i) => {
                    const delay = Math.random() * (1000 - 500) + 500; // 0.5초 ~ 1초
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    e.photoPath = await fetchImage(e.photoUrl, e.campaignId, i);
                })
            );

            await saveJsonData(fileNames.campaignList, result);
        }
    } catch (error) {
        progressBar.stop();
        console.error("Error fetching main:", error.message);
    }
}

async function fetchImage(url, id, index) {
    const response = await fetchFile(url);
    const name = `${id}.jpeg`;
    const file = await makeWriteStream(fileNames.campaignImage, name);

    if (response) {
        response.data.pipe(file);
        progressBar.update(index + 1);
    }

    return name;
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
