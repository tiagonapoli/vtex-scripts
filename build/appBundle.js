"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = __importDefault(require("commander"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const request_1 = __importDefault(require("request"));
const zlib_1 = __importDefault(require("zlib"));
const VtexConfig_1 = require("./VtexConfig");
commander_1.default
    .option('-e, --extract', 'Extract', false)
    .option('-d, --dir <path>', 'Download path', '.')
    .option('-w, --workspace <workspace>', 'Workspace', VtexConfig_1.VtexConfig.workspace)
    .option('-a, --account <account>', 'Account', VtexConfig_1.VtexConfig.account)
    .option('-p, --app <appName>', 'App name');
commander_1.default.parse(process.argv);
const filenameRegex = /filename=(.*)/g;
console.log(`Download bundle ${chalk_1.default.blue.bold(`${commander_1.default.account}/${commander_1.default.workspace}/${commander_1.default.app}`)} ==> ${commander_1.default.dir}`);
const req = request_1.default.get(`http://apps.aws-us-east-1d.vtex.io/${commander_1.default.account}/${commander_1.default.workspace}/apps/${commander_1.default.app}/bundle`, { headers: { Authorization: VtexConfig_1.VtexConfig.token } });
req.on('response', res => {
    const filename = filenameRegex.test(res.headers['content-disposition'])[1];
    console.log(res.headers);
    const out = fs_1.default.createWriteStream(path_1.default.join(commander_1.default.dir, filename));
    if (commander_1.default.extract && res.headers['content-type'].includes('gzip')) {
        const unzip = zlib_1.default.createUnzip();
        res.pipe(unzip).pipe(out);
    }
    else
        res.pipe(out);
});
//# sourceMappingURL=appBundle.js.map