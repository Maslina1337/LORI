import fs from "fs";
import path from "path";

interface file {
    filepath: string,
    name: string,
    ext: string,
    stat:fs.Stats,
}

export default function read_files_sync(dir: string) {
    const files: Array<file> = [];

    fs.readdirSync(dir).forEach(filename => {
      const name = path.parse(filename).name;
      const ext = path.parse(filename).ext;
      const filepath = path.resolve(dir, filename);
      const stat = fs.statSync(filepath);
      const isFile = stat.isFile();

      if (isFile) files.push({ filepath, name, ext, stat });
    });

    files.sort((a, b) => {
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    return files;
}