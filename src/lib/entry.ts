import { program } from "commander";
import * as chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as finder from "find-package-json";
import * as Ajv from "ajv";
import jtomler from "jtomler";
import json_from_schema from "json-from-default-schema";
import * as config_schema from "./schemes/config_schema.json";
import * as notification_email_schema from "./schemes/notification_email_schema.json";
import { IAppConfig } from "./config.interface";
import { IEmailOutputConfig } from "./notifications";

const pkg = finder(__dirname).next().value;

program.version(`version: ${pkg.version}`, "-v, --version", "output the current version.");
program.name(pkg.name);
program.option("-c, --config <type>", "Path to config file.");

program.parse(process.argv);

if (program.config === undefined) {

    if (process.env["FILE_INSPECTOR_CONFIG_PATH"] === undefined) {
        console.error(chalk.red("[ERROR] Not set --config key"));
        process.exit(1);
    } else {
        program.config = process.env["FILE_INSPECTOR_CONFIG_PATH"];
    }
 
}

const full_config_path = path.resolve(process.cwd(), program.config);

if (!fs.existsSync(full_config_path)) {
    console.error(chalk.red(`[ERROR] Config file ${full_config_path} not found`));
    process.exit(1);
}

const config: IAppConfig = <IAppConfig>json_from_schema(jtomler(full_config_path), config_schema);

let index = 0;

for (const item of config.notifications) {

    if (typeof item.output_type !== "string") {
        throw new Error("Config parsing error. Notifications output_type must be string");
    }

    const ajv_notifications_item = new Ajv();

    let validate_notifications_item;

    if (item.output_type === "email") {
        config.notifications[index] = <IEmailOutputConfig>json_from_schema(item, notification_email_schema);
        validate_notifications_item = ajv_notifications_item.compile(notification_email_schema);
    }

    if (validate_notifications_item === undefined) {
        console.error(chalk.red(`[ERROR] Config parsing error. Notifications output type ${item.output_type} not found`));
        process.exit(1);
    }

    if (!validate_notifications_item) {
        console.error(chalk.red(`[ERROR] Config parsing error. Schema errors:\n${JSON.stringify(validate_notifications_item.errors, null, 2)}`));
        process.exit(1);
    }

    index++;

}

const ajv = new Ajv();
const validate = ajv.compile(config_schema);

const valid = validate(config);

if (!valid) {
    console.error(chalk.red(`[ERROR] Config parsing error. Schema errors:\n${JSON.stringify(validate.errors, null, 2)}`));
    process.exit(1);
}

export default config;