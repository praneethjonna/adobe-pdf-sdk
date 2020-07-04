#!/usr/bin/env node
const adobeCreatePdf = require('../src/createpdf/create-pdf-from-static-html');
const yargs = require("yargs");
const path = require('path');
const fs = require('fs');

function fileCheck(filename) {
    try {
        fs.accessSync(filename, fs.R_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const options = yargs
    .usage("Usage: <input path> <output path>")
    .option("input", { alias: "input", describe: "file location of static htmls zip", type: "string" })
    .option("output", { alias: "output", describe: "file location to generate the pdf", type: "string" })
    .check(function (args) {

        let input = args._[0];
        let output = args._[1];
        if (input == undefined || output == undefined) {

            throw new Error('<path-to-the-HTML-zip> or <path-to-the-created-pdf>');
        }

        if(input.indexOf(".zip") < 0){
            throw new Error('Argument check failed: <path-to-the-HTML-zip> is not a zip file');
        }

        if(output.indexOf(".pdf") < 0){
            throw new Error('Argument check failed: <path-to-the-created-pdf>  doesn\'t end with .pdf extention');
        }

        if(!fileCheck(input)){
            
            throw new Error('Argument check failed: <path-to-the-HTML-zip> is not a readable file');
        }

        console.log(input + ':' + output);

        return true;
    })
    .argv;

adobeCreatePdf.execute(options._[0], options._[1]);