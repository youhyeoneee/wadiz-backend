const axios = require("axios");

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

module.exports = {
    fetchPagePost,
    fetchPageGet,
    fetchFile,
};
