import { BestIntentSchema } from "../validators/bestIntent.schema";
import type { BestIntent } from "../types/intent.types";
import { logger } from "../logger/winston.logger";

const UNKNOWN_INTENT: BestIntent = {
  id: "UNKNOWN",
  label: "UNKNOWN",
  score: 0,
  matchedPhrase: "UNKNOWN",
  partialPhrases: [],
  weakTokens: [],
  strongTokens: [],
  fuzzyTokens: [],
};

export function parseLlmIntent(output: string): BestIntent {
  try {
    const cleaned = output
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const result = BestIntentSchema.safeParse(parsed);

    if (!result.success) {
      logger.error("Zod validation failed:", result.error.format());
      return UNKNOWN_INTENT;
    }

    return result.data as BestIntent;

  } catch (error) {
    logger.error("Parsing failed:", error);
    return UNKNOWN_INTENT;
  }
}
