import { plainToInstance, Transform } from "class-transformer";
import { IsArray, IsString, validateSync } from "class-validator";

import { AppEnvInterface } from "../interface/app-env.interface";


export class AppEnvConfigClass implements AppEnvInterface {
  @IsString()
  GOOGLE_ACCOUNT_JSON_FILE_PATH: string;

  @Transform(({ value }) => (value as string).split(','))
  @IsArray()
  GOOGLE_SHEETS_IDS: string[];
}


export const appEnvConfigValidateFn = (config: Record<string, any>) => {
  const transformConfig = plainToInstance(AppEnvConfigClass, config);

  const errors = validateSync(transformConfig);

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }


  return transformConfig;
}

