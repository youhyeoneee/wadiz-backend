const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data");

const fileNames = {
    comments: "comments.json",
    campaignList: "campaign-list.json",
    campaignImage: "campaign-images",
};

async function readJson(fileName) {
    try {
        console.log(path.join(dataPath, fileName));
        const jsonFile = fs.readFileSync(path.join(dataPath, fileName), "utf8");
        return JSON.parse(jsonFile);
    } catch (error) {
        console.error(`\nError read jason file: ${fileName}`, error.message);
        return null;
    }
}

// Data 폴더 내에 json 데이터 저장
async function saveJson(fileName, data) {
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

module.exports = {
    fileNames,
    saveJson,
    readJson,
    makeWriteStream,
};
