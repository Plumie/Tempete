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
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const ejs = require("ejs");
const fs = require("fs-extra");
const { execSync } = require("child_process");
const ora = require("ora");
class GenerateProject {
    constructor(dependencies) {
        this.generateIndex = () => __awaiter(this, void 0, void 0, function* () {
            if (this.dependencies.includes("SCSS")) {
                this.config.css = "scss";
            }
            if (this.dependencies.includes("Typescript")) {
                this.config.js = "ts";
            }
            ejs.renderFile(__dirname + "/ejs/index.ejs", { data: this.config }, (err, data) => {
                if (!err) {
                    fs.writeFile("index.html", data, (err) => { });
                }
            });
        });
        this.generateStyle = (content) => __awaiter(this, void 0, void 0, function* () {
            fs.writeFile(`style.${this.config.css}`, content, { flag: "a" }, function (err) {
                if (err) {
                    return console.error(err);
                }
            });
        });
        this.generateScript = (content) => __awaiter(this, void 0, void 0, function* () {
            fs.writeFile(`index.${this.config.js}`, content, { flag: "a" }, function (err) {
                if (err) {
                    return console.error(err);
                }
            });
        });
        this.generateFile = (name, content) => __awaiter(this, void 0, void 0, function* () {
            fs.writeFile(name, content, { flag: "a" }, function (err) {
                if (err) {
                    return console.error(err);
                }
            });
        });
        this.generateConfig = () => __awaiter(this, void 0, void 0, function* () {
            yield fs.readFile(__dirname + "/config/config.json", "utf8", (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error(err);
                    return;
                }
                data = JSON.parse(data);
                for (let i = 0; i < this.dependencies.length; i++) {
                    let spinner = ora(`Configuring: ${this.dependencies[i]}`).start();
                    let packageConfig = data[this.dependencies[i]];
                    if (packageConfig) {
                        let files = packageConfig.files;
                        for (let k = 0; k < files.length; k++) {
                            let file = files[k];
                            if (file.name == "style") {
                                yield this.generateStyle(file.content);
                            }
                            else if (file.name == "script") {
                                yield this.generateScript(file.content);
                            }
                            else if (file.name == "index") {
                                this.config.body = file.content,
                                    yield this.generateIndex();
                            }
                            else {
                                yield this.generateFile(file.name, file.content);
                            }
                        }
                        if (packageConfig.commands) {
                            let commands = packageConfig.commands;
                            for (let j = 0; j < commands.length; j++) {
                                let command = commands[j];
                                // return new Promise((resolve, reject) => {
                                try {
                                    execSync(command, { stdio: 'ignore' });
                                    spinner.succeed(chalk.green("Configured: ") + this.dependencies[i]);
                                }
                                catch (e) {
                                    spinner.fail(chalk.red("Error: ") + this.dependencies[i]);
                                }
                                // })
                            }
                        }
                        else {
                            spinner.succeed(chalk.green("Configured: ") + this.dependencies[i]);
                        }
                    }
                    else {
                        spinner.succeed(chalk.green("Configured: ") + this.dependencies[i]);
                    }
                }
            }));
        });
        this.dependencies = dependencies;
        this.config = {
            css: "css",
            js: "js",
            body: "",
        };
    }
}
exports.default = GenerateProject;
