#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const path = require("path");
const program = require("commander");
const inquirer = require("inquirer");
const { exec } = require("child_process");
const ora = require("ora");
const fs = require('fs-extra');

class Glacier {
	constructor() {
        this.clearScreen();
		this.chooseDependencies();
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
		);
		console.log("\n");
	};

	public chooseDependencies = () => {
		program
			.name("glacier")
			.version("0.0.1")
			.description("A complete solution to build personalized boilerplates")
			.parse(process.argv);

		inquirer
			.prompt([
				{
					type: "checkbox",
					name: "packages",
					message: "Which package do you want to use ?",
					choices:[
						{
							name: "Parcel",
							value: {
								name: "Parcel",
								package: "parcel-bundler",
							},
						},
						{
							name: "Three.js",
							value: {
								name: "Three.js",
								package: "three",
							},
						},
						{
							name: "Tailwind",
							value: {
								name: "Tailwind",
								package: "tailwindcss",
							},
						},
					],
				},
			])
			.then((answers) => {
				this.installDependencies(answers);
			});
	};

	public installDependencies = (dependencies) => {
		console.log(chalk.cyan.bold('Installing dependencies...'))
		for (let i: number = 0; i < dependencies.packages.length; i++) {
			let fullName: string = dependencies.packages[i].name;
			let packageName: string = dependencies.packages[i].package;
			let spinner: any = ora(`Installing: ${fullName}`).start();
			exec(
				`npm install ${packageName} --prefix ./`,
				(error, stdout, stderr) => {
					if (error == null) {
						this.createDefaultFiles(packageName);
						spinner.succeed(`Installed: ${fullName}`);
						
					} else {
						spinner.fail(`Error: ${fullName}`);
					}
				}
			);
		}
	};

	public createDefaultFiles = (packages) => {
		fs.copy('../defaultFiles', process.cwd());
	}
}

let glacier = new Glacier();
