#!/usr/bin/env node

import GenerateProject from "./GenerateProject";

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const path = require("path");
const program = require("commander");
const inquirer = require("inquirer");
const { exec } = require("child_process");
const ora = require("ora");

class Glacier {

	output: string[];

	constructor() {
		this.output = [];
		this.clearScreen();
		this.init();
	}

	public init = async () => {
		const result = await this.chooseDependencies();
		await console.log('asynchronous');
	}

	public clearScreen = () => {
		clear();
		console.log(
			chalk.cyan(
				figlet.textSync("Glacier", {
					horizontalLayout: "full",
					font: "cosmike",
				})
			)
		, "\n");
	};

	public chooseDependencies = async () => {
		let output: [] = [];
		let questions: object[] = [{
			type: "list",
			name: "bundlers",
			message: chalk.cyan.underline("Module bundler"),
			choices:[
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
			choices:[
				{
					name: "SCSS",
					value: {
						name: "SCSS",
						packages: "sass",
					}
				},
				{
					name: "none",
					value: {
						name: "none",
						packages: "",
					}
				}
			]
		},
	
		];

		await program
			.name("glacier")
			.version("0.0.1")
			.description("A complete solution to build personalized boilerplates")
			.parse(process.argv);

		await inquirer
			.prompt(questions)
			.then(async (answers) => {
				await this.questionsParser(answers);
			});
	};

	public questionsParser = async (dependencies) => {
		console.log(chalk.cyan.bold('\nInstalling dependencies...'))
		for (let dependency in dependencies) {
			if(Array.isArray(dependencies[dependency])) {
				for (let i: number = 0; i < dependencies[dependency].length; i++) {
					await this.installDependencies(dependencies[dependency][i]);
				}
			} else {
				await this.installDependencies(dependencies[dependency]);
			}
		}
	};

	public installDependencies = (dependency) => {
		let fullName: string = dependency.name;
		let packageName: string = dependency.packages;
		if(packageName != '') {
			this.output.push(packageName);
			let spinner: any = ora(`Installing: ${fullName}`).start();
			return new Promise((resolve, reject) => {
				exec(
					`npm install ${packageName} --prefix ./`,
					(error, stdout, stderr) => {
						if (error == null) {
							spinner.succeed(`Installed: ${fullName}`);
							resolve(stdout? stdout : stderr);
						} else {
							spinner.fail(`Error: ${fullName}`);
						}
					}
				);
			});
		}
	}
}

let glacier = new Glacier();
