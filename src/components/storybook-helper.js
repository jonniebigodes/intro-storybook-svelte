import { action } from "@storybook/addon-actions";
export const task = {
    id: "1",
    title: "Test Task",
    state: "Task_INBOX",
    updated_at: new Date(2019, 0, 1, 9, 0)
  };
  
  export const actions = {
    onPinTask: action("onPinTask"),
    onArchiveTask: action("onArchiveTask")
  };