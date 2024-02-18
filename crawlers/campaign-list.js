const axios = require("axios");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");

const headers = {
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
};

async function fetchPage(url) {
    try {
        const response = await axios.post(url, data, {
            headers: headers,
        });
        return response;
    } catch (error) {
        console.error(`Error fetching page: ${url}`, error.message);
        return null;
    }
}

async function fetchFile(url) {
    try {
        const response = await axios.get(url, {
            responseType: "stream",
            headers: headers,
        });
        return response;
    } catch (error) {
        console.error(`Error fetching file: ${url}`, error.message);
        return null;
    }
}

async function saveData(results) {
    fs.writeFileSync(filePath, JSON.stringify(results));
    console.log("Data Fetched Successfully!");
}

async function fetchMain(url) {
    try {
        const response = await fetchPage(url);
        if (response) {
            figlet("Wadiz Campagin List Crawler", async function (err, data) {
                if (err) {
                    console.log("Error in figlet:", err);
                    return;
                }
                console.log(data);

                let result = response.data.data["list"];

                await Promise.all(
                    result.map(async (e, i) => {
                        e.photoPath = await getImage(e.photoUrl, e.campaignId);
                    })
                );

                await saveData(result);
            });
        }
    } catch (error) {
        console.error("Error fetching main:", error.message);
    }
}

async function getImage(url, id) {
    const response = await fetchFile(url);
    const name = `${id}.jpeg`;
    const imageFilePath = path.join(dataPath, "images", name);
    const file = fs.createWriteStream(imageFilePath);

    if (response) {
        response.data.pipe(file);
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

// 경로 설정
const fileName = "campaign-list.json";
const dataPath = path.join(__dirname, "../data");
const filePath = path.join(dataPath, fileName);

// fetch
const url = "https://service.wadiz.kr/api/search/funding";
fetchMain(url);
