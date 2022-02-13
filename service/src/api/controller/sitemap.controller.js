const { get } = require("../service/sitemap.service");

async function getSitemap() {
    return await get();
}

module.exports = {
    getSitemap,
};
