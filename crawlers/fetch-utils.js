const axios = require("axios");
const fs = require("fs");
const figlet = require("figlet");

const headers = {
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
};

async function fetchPage(url, data) {
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

async function saveData(filePath, results) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(results));
        console.log("\nData saved Successfully!");
    } catch (error) {
        console.error(`\nError saving data: ${filePath}`, error.message);
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

module.exports = { fetchPage, fetchFile, saveData, figletAsync };
