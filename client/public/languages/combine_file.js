#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

const ar_files = execSync("ls | grep _en").toString().split("\n");
console.log(ar_files);

const translations = {};

ar_files.forEach((filename) => {
  if (filename) {
    const data = require(`./${filename}`);
    Object.assign(translations, data);
  }
});

fs.writeFile("en.json", JSON.stringify(translations), (err) =>
  console.log(err)
);
