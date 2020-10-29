const chalk = require("chalk");
const ejs = require("ejs");
const fs = require("fs-extra");
const { execSync } = require("child_process");
const ora = require("ora");

export default class GenerateProject {
	dependencies: string[];
	config: any;

	constructor(dependencies: string[]) {
		this.dependencies = dependencies;
		this.config = {
            css: "css",
			js: "js",
			body: "",
        };
	}

	public generateIndex = async () => {
		if (this.dependencies.includes("SCSS")) {
			this.config.css = "scss";
		}

		if (this.dependencies.includes("Typescript")) {
			this.config.js = "ts";
		}

		ejs.renderFile(
			__dirname + "/ejs/index.ejs",
			{ data: this.config },
			(err, data) => {
				if (!err) {
					fs.writeFile("index.html", data, (err) => {});
				}
			}
		)
	}

	public generateStyle = async (content) => {
        fs.writeFile(`style.${this.config.css}`, content, { flag: "a" }, function (err) {
            if (err) {
                return console.error(err);
            }
        })
	}

	public generateScript = async (content) => {
        fs.writeFile(`index.${this.config.js}`, content, { flag: "a" }, function (err) {
            if (err) {
                return console.error(err);
            }
        });
	}

	public generateFile = async (name, content) => {
        fs.writeFile(name, content, { flag: "a" }, function (err) {
            if (err) {
                return console.error(err);
            }
        });
	}

	public generateConfig = async () => {
		await fs.readFile(
			__dirname + "/config/config.json",
			"utf8",
			async (err, data) => {
				if (err) {
					console.error(err);
					return;
				}

				data = JSON.parse(data);

				for (let i = 0; i < this.dependencies.length; i++) {
					let spinner: any = ora(
						`Configuring: ${this.dependencies[i]}`
					).start();
					let packageConfig = data[this.dependencies[i]];
					if (packageConfig) {
						let files = packageConfig.files;

						for (let k = 0; k < files.length; k++) {
							let file = files[k];
							if (file.name == "style") {
								await this.generateStyle(file.content);
							} else if (file.name == "script") {
								await this.generateScript(file.content);
							} else if (file.name == "index") {
								this.config.body = file.content,
								await this.generateIndex();
							} else {
								await this.generateFile(file.name, file.content);
							}
						}

						if(packageConfig.commands) {
							let commands = packageConfig.commands;
							for (let j = 0; j < commands.length; j++) {
								let command = commands[j];
								// return new Promise((resolve, reject) => {
									try {
										execSync(command, {stdio: 'ignore'});
										spinner.succeed(
											chalk.green("Configured: ") + this.dependencies[i]
										);
									} catch(e) {
										spinner.fail(chalk.red("Error: ") + this.dependencies[i]);
									}
								// })
							}
						} else {
							spinner.succeed(chalk.green("Configured: ") + this.dependencies[i]);
						}
					} else {
						spinner.succeed(chalk.green("Configured: ") + this.dependencies[i]);
					}
				}
			}
		)
	}
}
