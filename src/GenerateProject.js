"use strict";
exports.__esModule = true;
var ejs = require('ejs');
var fs = require('fs-extra');
var GenerateProject = /** @class */ (function () {
    function GenerateProject(dependencies) {
        this.indexFile = function (dependencies) {
            console.log('bip');
            // fs.copy('../defaultFiles/index.html', process.cwd());
        };
        dependencies = this.dependencies;
        this.indexFile(dependencies);
    }
    return GenerateProject;
}());
exports["default"] = GenerateProject;
