const { getSitemap } = require("../controller/sitemap.controller");
const route = require("express").Router();
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const { Readable } = require("stream");
const { Affiliation } = require("../model/Affiliation.model");
const { Logger } = require("../lib/logger");

let sitemap;

route.get("/", async (req, res) => {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");

    if (sitemap) {
        res.send(sitemap);
        return;
    }

    try {
        const smStream = new SitemapStream({
            hostname: "https://pathsala.listnepal.com",
        });
        const pipeline = smStream.pipe(createGzip());

        const items = [];

        let homepage = {
            url: "",
            name: "Home Page",
            changefreq: "daily",
            priority: 0.3,
            date: Date.now(),
        };
        items.push(homepage);

        const result = await getSitemap();
        for (let i = 0; i < result.length; i++) {
            items.push(result[i]);
        }
        for (let i = 0; i < items.length; i++) {
            smStream.write(items[i]);
        }
        streamToPromise(pipeline).then((sm) => (sitemap = sm));
        smStream.end();
        pipeline.pipe(res).on("error", (e) => {
            throw e;
        });
    } catch (error) {
        return res.status(500).json({
            message: "Operation Failed",
            data: error.message,
        });
    }
});

module.exports = route;
