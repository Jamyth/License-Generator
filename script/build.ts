import path from "path";
import fs from "fs-extra";
import { spawn } from "./spawn";
import { createConsoleLogger } from "@iamyth/logger";

const logger = createConsoleLogger("PKGRoll Compiler");

require("./format");
require("./lint");

const FilePath = {
    src: path.join(__dirname, "../src"),
    dist: path.join(__dirname, "../dist"),
};

function build() {
    logger.task("Build and Transpile");
    spawn("tsc", ["--project", path.join(__dirname, "../config/tsconfig.src.json")], "Build Failed.");
}

function copyTemplate() {
    const location = path.resolve(FilePath.src, "template");
    const target = path.resolve(FilePath.dist, "template");
    fs.copySync(location, target, { recursive: true });
}

function copyAsset() {
    fs.copyFileSync(path.join(__dirname, "../package.json"), path.join(FilePath.dist, "package.json"));
    fs.copyFileSync(path.join(__dirname, "../LICENSE"), path.join(FilePath.dist, "LICENSE"));
}

build();
copyTemplate();
copyAsset();
