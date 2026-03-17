import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { IntentFileSchema } from "../validators/intent.schema";
import { IntentDefinition } from "../types/intent.types";
import { logger } from '../logger/winston.logger';


function normalizeArray(arr: string[]): string[] {
  return [...new Set(arr.map(v => v.trim().toLowerCase()))];
}

export function loadIntentsFromFile(filePath: string): IntentDefinition[] {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Intent File path does not exist: ${filePath}`);
    }

    const rawJson = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(rawJson);

    const parsed = IntentFileSchema.parse(json);
    logger.info(`Successfully loaded ${parsed.intents.length} intents from file`);

    return parsed.intents.map(intent => ({
      id: intent.id,
      label: intent.label,
      phrases: normalizeArray(intent.phrases),
      strongTokens: normalizeArray(intent.strongTokens || []),
      weakTokens: normalizeArray(intent.weakTokens || [])
    }));

  } catch (error) {
    logger.error(`Error in loading intents file`, error);
    throw new InternalServerErrorException(error.message);
  }
}
