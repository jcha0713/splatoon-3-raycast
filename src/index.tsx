import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { fetchDataFromAPI } from "./api/schema";

export default function Command() {
  const { isLoading, test: data, revalidate } = fetchDataFromAPI();

  console.log(data);

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
