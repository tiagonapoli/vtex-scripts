"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const vtexConfigPath = path_1.default.join(os_1.default.homedir(), '.config', 'configstore', 'vtex.json');
class VtexConfig {
    static get token() {
        return this.config.token;
    }
    static get workspace() {
        return this.config.workspace;
    }
    static get account() {
        return this.config.account;
    }
}
VtexConfig.config = JSON.parse(fs_1.default.readFileSync(vtexConfigPath, { encoding: 'utf8' }));
exports.VtexConfig = VtexConfig;
//# sourceMappingURL=VtexConfig.js.map