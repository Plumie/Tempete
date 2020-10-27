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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GenerateProject_1 = __importDefault(require("./GenerateProject"));
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const program = require("commander");
const inquirer = require("inquirer");
const { exec } = require("child_process");
const ora = require("ora");
const fs = require("fs-extra");
class Glacier {
    constructor() {
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            yield this.chooseDependencies();
            console.log(chalk.cyan.bold("\nConfiguring project..."));
            const project = new GenerateProject_1.default(this.output);
            yield project.generateIndex();
            yield project.generateStyle('');
            yield project.generateScript('');
            yield project.generateConfig();
        });
        this.clearScreen = () => {
            clear();
            console.log(chalk.cyan(figlet.textSync("Tempete", {
                horizontalLayout: "full",
                font: "Delta Corps Priest 1",
            })), "\n");
        };
        this.chooseDependencies = () => __awaiter(this, void 0, void 0, function* () {
            let nodeModulesQuestions = {
                type: "confirm",
                name: "node_modules",
                message: chalk.yellow("node_modules detected, delete ?"),
            };
            let packagesQuestions = [
                {
                    type: "list",
                    name: "bundlers",
                    message: chalk.cyan.underline("Module bundler"),
                    choices: [
                        {
                            name: "Parcel",
                            value: {
                                name: "Parcel",
                                packages: "parcel-bundler",
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
                {
                    type: "list",
                    name: "js",
                    message: chalk.cyan.underline("JS Preprocessor"),
                    choices: [
                        {
                            name: "Typescript",
                            value: {
                                name: "Typescript",
                                packages: "typescript"
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
                {
                    type: "checkbox",
                    name: "jsFrameworks",
                    message: chalk.cyan.underline("JS Frameworks / Libraries"),
                    choices: [
                        {
                            name: "AlpineJS",
                            value: {
                                name: "AlpineJS",
                                packages: "alpinejs"
                            }
                        }
                    ]
                },
                {
                    type: "checkbox",
                    name: "cssFrameworks",
                    message: chalk.cyan.underline("CSS Frameworks"),
                    choices: [
                        {
                            name: "Tailwind",
                            value: {
                                name: "Tailwind",
                                packages: "tailwindcss"
                            }
                        }
                    ]
                }
            ];
            program
                .name("tempete")
                .version("0.0.1")
                .description("A complete solution to build personalized boilerplates")
                .parse(process.argv);
            if (fs.existsSync("./node_modules")) {
                yield inquirer.prompt(nodeModulesQuestions).then((answers) => __awaiter(this, void 0, void 0, function* () {
                    if (answers.node_modules) {
                        yield fs.rmdir("./node_modules", { recursive: true });
                    }
                }));
            }
            console.log("\n");
            yield inquirer.prompt(packagesQuestions).then((answers) => __awaiter(this, void 0, void 0, function* () {
                yield this.questionsParser(answers);
            }));
        });
        this.questionsParser = (dependencies) => __awaiter(this, void 0, void 0, function* () {
            console.log(chalk.cyan.bold("\nDownloading dependencies..."));
            for (let dependency in dependencies) {
                if (Array.isArray(dependencies[dependency])) {
                    for (let i = 0; i < dependencies[dependency].length; i++) {
                        yield this.installDependencies(dependencies[dependency][i]);
                    }
                }
                else {
                    yield this.installDependencies(dependencies[dependency]);
                }
            }
        });
        this.installDependencies = (dependency) => {
            let fullName = dependency.name;
            let packageName = dependency.packages;
            if (packageName != "") {
                return new Promise((resolve, reject) => {
                    this.output.push(fullName);
                    // resolve();
                    let spinner = ora(`Downloading: ${fullName}`).start();
                    exec(`npm install ${packageName} --prefix ./`, (error, stdout, stderr) => {
                        if (error == null) {
                            spinner.succeed(chalk.green("Downloaded: ") + fullName);
                            resolve(stdout ? stdout : stderr);
                        }
                        else {
                            spinner.fail(chalk.green("Error: ") + fullName);
                        }
                    });
                });
            }
        };
        this.output = [];
        this.clearScreen();
        this.init();
    }
}
let glacier = new Glacier();
