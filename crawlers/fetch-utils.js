const axios = require("axios");
const fs = require("fs");
const figlet = require("figlet");
const path = require("path");

const dataPath = path.join(__dirname, "../data");

const fileNames = {
    comments: "comments.json",
    campaignList: "campaign-list.json",
    campaignImage: "campaign-images",
};

const headers = {
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
};

async function fetchPageGet(url, params) {
    try {
        const response = await axios.get(url, {
            params: params,
            headers: headers,
        });
        return response;
    } catch (error) {
        console.error(`\nError fetching page: ${url}`, error.message);
        return null;
    }
}

async function fetchPagePost(url, data) {
    try {
        const response = await axios.post(url, data, {
            headers: headers,
        });
        return response;
    } catch (error) {
        console.error(`\nError fetching page: ${url}`, error.message);
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
        console.error(`\nError fetching file: ${url}`, error.message);
        return null;
    }
}

// Data 폴더 내에 json 데이터 저장
async function saveJsonData(fileName, data) {
    try {
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath);
        }
        fs.writeFileSync(path.join(dataPath, fileName), JSON.stringify(data));
        console.log("\nData saved Successfully!");
    } catch (error) {
        console.error(`\nError saving json data: ${fileName}`, error.message);
        return null;
    }
}

async function makeWriteStream(dirName, fileName) {
    try {
        const targetDir = path.join(dataPath, dirName);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const file = fs.createWriteStream(path.join(targetDir, fileName));
        return file;
    } catch (error) {
        console.error(`\nError saving image data: ${fileName}`, error.message);
        return null;
    }
}

async function figletAsync(text) {
    return new Promise((resolve, reject) => {
        figlet(text, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

async function readJsonFile(fileName) {
    try {
        console.log(path.join(dataPath, fileName));
        const jsonFile = fs.readFileSync(path.join(dataPath, fileName), "utf8");
        return JSON.parse(jsonFile);
    } catch (error) {
        console.error(`\nError read jason file: ${fileName}`, error.message);
        return null;
    }
}

module.exports = {
    fetchPagePost,
    fetchPageGet,
    fetchFile,
    saveJsonData,
    figletAsync,
    readJsonFile,
    makeWriteStream,
    fileNames,
};
