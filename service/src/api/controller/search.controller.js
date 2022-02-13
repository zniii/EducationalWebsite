const { get } = require("../service/search.service");

async function getSearchResult(text) {
    return await get(text);
}

module.exports = { getSearchResult };
