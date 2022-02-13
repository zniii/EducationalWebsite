const express = require("express");
const { expressConfig } = require("./config");

function createServer() {
    const app = expressConfig(express());
    return app;
}

module.exports = { createServer };
