#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var GenerateProject_1 = require("./GenerateProject");
var chalk = require("chalk");
var clear = require("clear");
var figlet = require("figlet");
var path = require("path");
var program = require("commander");
var inquirer = require("inquirer");
var exec = require("child_process").exec;
var ora = require("ora");
var Glacier = /** @class */ (function () {
    function Glacier() {
        var _this = this;
        this.clearScreen = function () {
            clear();
            console.log(chalk.cyan(figlet.textSync("Glacier", {
                horizontalLayout: "full",
                font: "cosmike"
            })), "\n");
        };
        this.chooseDependencies = function () {
            var output = [];
            var questions = [{
                    type: "list",
                    name: "bundlers",
                    message: chalk.cyan.underline("Module bundlers"),
                    choices: [
                        {
                            name: "Parcel",
                            value: {
                                name: "Parcel",
                                packages: "parcel-bundler"
                            }
                        }
                    ]
                },
                {
                    type: "list",
                    name: "css",
                    message: chalk.cyan.underline("CSS Preprocessor"),
                    choices: [
                        {
                            name: "SCSS",
                            value: {
                                name: "SCSS",
                                packages: "sass"
                            }
                        },
                        {
                            name: "none",
                            value: {
                                name: "none",
                                packages: ""
                            }
                        }
                    ]
                },
            ];
            program
                .name("glacier")
                .version("0.0.1")
                .description("A complete solution to build personalized boilerplates")
                .parse(process.argv);
            inquirer
                .prompt(questions)
                .then(function (answers) {
                console.log(answers);
                _this.questionsParser(answers);
            });
        };
        this.questionsParser = function (dependencies) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _i, dependency, i, generateProject;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log(chalk.cyan.bold('Installing dependencies...'));
                        _a = [];
                        for (_b in dependencies)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 10];
                        dependency = _a[_i];
                        if (!Array.isArray(dependencies[dependency])) return [3 /*break*/, 6];
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < dependencies[dependency].length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.installDependencies(dependencies[dependency][i])];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.installDependencies(dependencies[dependency])];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8:
                        generateProject = new GenerateProject_1["default"](this.output);
                        _c.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        this.installDependencies = function (dependency) { return __awaiter(_this, void 0, void 0, function () {
            var fullName, packageName, spinner_1;
            return __generator(this, function (_a) {
                fullName = dependency.name;
                packageName = dependency.packages;
                if (packageName != '') {
                    this.output.push(packageName);
                    spinner_1 = ora("Installing: " + fullName).start();
                    exec("npm install " + packageName + " --prefix ./", function (error, stdout, stderr) {
                        if (error == null) {
                            spinner_1.succeed("Installed: " + fullName);
                        }
                        else {
                            spinner_1.fail("Error: " + fullName);
                        }
                    });
                }
                return [2 /*return*/];
            });
        }); };
        this.output = [];
        this.clearScreen();
        this.chooseDependencies();
    }
    return Glacier;
}());
var glacier = new Glacier();
