import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { z } from "zod";

export default function Command() {
  const { isLoading, error, data: rawData } = useFetch("https://splatoon3.ink/data/schedules.json");
  const regularSchedules = z.object({
    startTime: z.string(),
    endTime: z.string(),
  });

  const scheduleNodes = z.object({
    nodes: z.array(regularSchedules),
  });

  const parsed = regularSchedules.parse(rawData.data.regularSchedules.nodes);
  console.log(parsed);

  return (
    <List>
      <List.Item
        icon="list-icon.png"
        title="Greeting"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
