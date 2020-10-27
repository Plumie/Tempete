export default class GenerateProject {
    dependencies: string[];
    config: any;
    constructor(dependencies: string[]);
    generateIndex: () => Promise<void>;
    generateStyle: (content: any) => Promise<void>;
    generateScript: (content: any) => Promise<void>;
    generateFile: (name: any, content: any) => Promise<void>;
    generateConfig: () => Promise<void>;
}
