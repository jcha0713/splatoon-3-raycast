import { z } from "zod";
import { useFetch } from "@raycast/utils";

const challengeSchedule = {
  name: z.union([
    z.literal("Splat Zones"),
    z.literal("Tower Control"),
    z.literal("Rainmaker"),
    z.literal("Clam Blitz"),
  ]),
  rule: z.union([z.literal("AREA"), z.literal("LOFT"), z.literal("GOAL"), z.literal("CLAM")]),
} as const;

const ruleTable = {
  regularSchedule: { name: z.literal("Turf War"), rule: z.literal("TURF_WAR") },
  bankaraSchedule: challengeSchedule,
  xSchedule: challengeSchedule,
} as const;

type ScheduleType = keyof typeof ruleTable;

function getScheduleSchema(context: ScheduleType) {
  const vsSpecifiedSchema = {
    vsStages: z.array(createVsStageSchema()),
    vsRule: createVsRuleSchema(context),
  };

  const scheduleSchemaTable = {
    regularSchedule: z.object({
      __isVsSetting: z.literal("RegularMatchSetting"),
      __typename: z.literal("RegularMatchSetting"),
      ...vsSpecifiedSchema,
    }),
    bankaraSchedule: z.object({
      __isVsSetting: z.literal("BankaraMatchSetting"),
      __typeName: z.literal("BankaraMatchSetting"),
      ...vsSpecifiedSchema,
      mode: z.union([z.literal("CHALLENGE"), z.literal("OPEN")]),
    }),
    xSchedule: z.object({
      __isVsSetting: z.literal("xScheduleSetting"),
      __typeName: z.literal("xScheduleSetting"),
      ...vsSpecifiedSchema,
    }),
  };

  return scheduleSchemaTable[context];
}

function createVsStageSchema() {
  return z.object({
    vsStageId: z.number(),
    name: z.string(),
    image: z.object({
      url: z.string().url({ message: "String must be a valid URL" }),
    }),
    id: z.string(),
  });
}

function createVsRuleSchema(context: ScheduleType) {
  return z.object(ruleTable[context]).extend({
    id: z.string(),
  });
}

export function fetchDataFromAPI() {
  const { isLoading, data, revalidate } = useFetch("https://splatoon3.ink/data/schedules.json");

  const testData = data?.data.regularSchedules.nodes[0];

  const testSchema = z.object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    regularMatchSetting: getScheduleSchema("regularSchedule"),
  });

  const test = testSchema.safeParse(testData);

  return { isLoading, test, revalidate };
}
