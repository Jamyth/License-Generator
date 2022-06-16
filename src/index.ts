import * as yargs from "yargs";
import * as path from "path";
import * as fs from "fs-extra";
import { License } from "./license";
import { createConsoleLogger } from "@iamyth/logger";

interface Argument {
    license: License;
    name: string;
}

const logger = createConsoleLogger("License Generator");

export class LicenseGenerator {
    private license: License | undefined;
    private name: string | undefined;
    private targetLocation = path.resolve(process.cwd(), "LICENSE");
    private licenseTemplatePath: string | undefined;

    generate() {
        this.checkYargs();
        this.chooseLicense();
        this.writeLicense();
    }

    private checkYargs() {
        const { license, name }: Argument = (yargs as any).parseSync();

        logger.task("Reading options...");
        if (!license || !name) {
            console.error("--license or --name is not provided");
            process.exit(1);
        }

        this.license = license;
        this.name = name;
    }

    private chooseLicense() {
        logger.task("Choosing License...");
        switch (this.license?.toUpperCase() || "") {
            case License.MIT:
                this.licenseTemplatePath = path.resolve(__dirname, "template", "MIT.license");
                break;
            case License.APACHE:
            case License.GNU:
            case License.ISC:
                this.licenseTemplatePath = "";
                break;
            default:
                logger.error("LICENSE is not valid...");
                process.exit(1);
        }
    }

    private writeLicense() {
        logger.task("Adding LICENSE to your project...");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- chooseLicense checked
        const content = fs.readFileSync(this.licenseTemplatePath!, { encoding: "utf-8" });
        const yearReg = /{year}/g;
        const nameReg = /{name}/g;
        const newContent = content
            .replace(yearReg, new Date().getFullYear().toString())
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checkYargs checked
            .replace(nameReg, this.name!);
        fs.writeFileSync(this.targetLocation, newContent, { encoding: "utf-8" });

        logger.info("Added LICENSE file, enjoy !");
    }
}
