#!/usr/bin/env node

import GenerateProject from "./GenerateProject";

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const program = require("commander");
const inquirer = require("inquirer");
const { exec } = require("child_process");
const ora = require("ora");
const fs = require("fs-extra");

class Glacier {
	output: string[];

	constructor() {
		this.output = [];
		this.clearScreen();
		this.init();
	}

	public init = async () => {
		await this.chooseDependencies();
		console.log(chalk.cyan.bold("\nConfiguring project..."));
		const project = new GenerateProject(this.output);
		await project.generateIndex();
		await project.generateStyle('');
		await project.generateScript('');
		await project.generateConfig();
	};

	public clearScreen = () => {
		clear();
		console.log(
			chalk.cyan(
				figlet.textSync("Tempete", {
					horizontalLayout: "full",
					font: "Delta Corps Priest 1",
				})
			),
			"\n"
		);
	};

	public chooseDependencies = async () => {
		let nodeModulesQuestions = {
			type: "confirm",
			name: "node_modules",
			message: chalk.yellow("node_modules detected, delete ?"),
		}

		let packagesQuestions: object[] = [
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
		]

		program
			.name("tempete")
			.version("0.0.1")
			.description("A complete solution to build personalized boilerplates")
			.parse(process.argv);

		if (fs.existsSync("./node_modules")) {
			await inquirer.prompt(nodeModulesQuestions).then(async (answers) => {
				if (answers.node_modules) {
					await fs.rmdir("./node_modules", { recursive: true });
				}
			})
		}

		console.log("\n");

		await inquirer.prompt(packagesQuestions).then(async (answers) => {
			await this.questionsParser(answers);
		})
	}

	public questionsParser = async (dependencies) => {
		console.log(chalk.cyan.bold("\nDownloading dependencies..."));
		for (let dependency in dependencies) {
			if (Array.isArray(dependencies[dependency])) {
				for (let i: number = 0; i < dependencies[dependency].length; i++) {
					await this.installDependencies(dependencies[dependency][i]);
				}
			} else {
				await this.installDependencies(dependencies[dependency]);
			}
		}
	}

	public installDependencies = (dependency) => {
		let fullName: string = dependency.name;
		let packageName: string = dependency.packages;
		if (packageName != "") {
			return new Promise((resolve, reject) => {
				this.output.push(fullName);
				// resolve();
				let spinner: any = ora(`Downloading: ${fullName}`).start();
				exec(
					`npm install ${packageName} --prefix ./`,
					(error, stdout, stderr) => {
						if (error == null) {
							spinner.succeed(chalk.green("Downloaded: ") + fullName);
							resolve(stdout ? stdout : stderr);
						} else {
							spinner.fail(chalk.green("Error: ") + fullName);
						}
					}
				)
			})
		}
	}
}

let glacier = new Glacier();