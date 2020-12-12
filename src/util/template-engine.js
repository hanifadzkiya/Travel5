const ejs = require("ejs");
const fs = require("fs");

const renderFromFile = (path, data) => {
    let template = fs.readFileSync(path, encoding="utf-8");
    return ejs.render(template, data);
}

module.exports = { renderFromFile };