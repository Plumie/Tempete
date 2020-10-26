let ejs = require('ejs');
const fs = require('fs-extra');

export default class GenerateProject {
    dependencies: string[];
    constructor(dependencies: string[]) {
        dependencies = this.dependencies;
        this.indexFile(dependencies);
    }

    public indexFile = (dependencies) => {
        console.log(dependencies);
        // fs.copy('../defaultFiles/index.html', process.cwd());
    }
}