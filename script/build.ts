import path from "path";
import fs from "fs-extra";
import { spawn } from "./spawn";
import { createConsoleLogger } from "@iamyth/logger";

const logger = createConsoleLogger("PKGRoll Compiler");

require("./format");
require("./lint");

function build() {
    logger.task("Build and Transpile");
    spawn("tsc", ["--project", path.join(__dirname, "../config/tsconfig.src.json")], "Build Failed.");
}

function copyTemplate() {
    const location = path.resolve(__dirname, "../src/template");
    const target = path.resolve(__dirname, "../dist/template");
    fs.copySync(location, target, { recursive: true });
}

build();
copyTemplate();
