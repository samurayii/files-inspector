import { IInspectorConfig, IInspector, IInspectorResult } from "./interfaces";
import { ILogger } from "../logger";
import * as fs from "fs";
import * as path from "path";

export * from "./interfaces";

export class Inspector implements IInspector {

    private readonly _regexp_list: RegExp[]

    constructor (
        private readonly _config: IInspectorConfig,
        private readonly _logger: ILogger
    ) {

        this._regexp_list = [];

        for (const folder_path of this._config.folders) {
            const full_folder_path = path.resolve(process.cwd(), folder_path);
            if (!fs.existsSync(full_folder_path)) {
                this._logger.error(`Folder ${full_folder_path} not found`);
                process.exit(1);
            }
        }

        for (const regexp_text of this._config.regexp) {
            this._regexp_list.push(new RegExp(regexp_text, "i"));
        }

    }

    inspect (): IInspectorResult {

        this._logger.info("[File-inspector] Inspection starting ...", "dev");

        const result: IInspectorResult = {
            count: 0,
            files: []
        };

        const inspectFile = (file_path: string): boolean => {

            this._logger.log(`[File-inspector] Check file ${file_path}`, "debug");

            for (const reg of this._regexp_list) {
                if (reg.test(file_path)) {
                    this._logger.warn(`[File-inspector] File ${file_path} deemed suspicious`, "debug");
                    return true;
                }
            }

            return false;
        };

        const inspectFolder = (folder: string, files_list: string[]  = []): string[] => {

            if (!fs.existsSync(folder)) {
                return [];
            }

            const files = fs.readdirSync(folder);
        
            files.forEach( (file_path) => {
        
                const full_file_path = path.resolve(folder, file_path);
                const stat = fs.statSync(full_file_path);
        
                if (stat.isFile()) {
                    if (inspectFile(full_file_path)) {
                        files_list.push(full_file_path);
                    }
                } else {
                    inspectFolder(full_file_path, files_list);
                }
        
            });
        
            return files_list;
        
        };

        for (const folder_path of this._config.folders) {

            const full_folder_path = path.resolve(process.cwd(), folder_path);

            this._logger.log(`[File-inspector] Check folder ${full_folder_path}`, "debug");

            const files = inspectFolder(full_folder_path);

            result.count += files.length;
            result.files = result.files.concat(files);

        }

        return result;

    }

}