"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function read_files_sync(dir) {
    const files = [];
    fs_1.default.readdirSync(dir).forEach(filename => {
        const name = path_1.default.parse(filename).name;
        const ext = path_1.default.parse(filename).ext;
        const filepath = path_1.default.resolve(dir, filename);
        const stat = fs_1.default.statSync(filepath);
        const isFile = stat.isFile();
        if (isFile)
            files.push({ filepath, name, ext, stat });
    });
    files.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });
    return files;
}
exports.default = read_files_sync;
