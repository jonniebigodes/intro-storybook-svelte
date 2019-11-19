import { action } from "@storybook/addon-actions";
// defines a example task to be used with the stories
export const task = {
  id: "1",
  title: "Test Task",
  state: "Task_INBOX",
  updated_at: new Date(2019, 0, 1, 9, 0)
};

// bundles the actions associated with the component
export const actions = {
  onPinTask: action("onPinTask"),
  onArchiveTask: action("onArchiveTask")
};

// defines a set of test tasks for our stories and tests
export const defaultTasks = [
  { ...task, id: "1", title: "Task 1" },
  { ...task, id: "2", title: "Task 2" },
  { ...task, id: "3", title: "Task 3" },
  { ...task, id: "4", title: "Task 4" },
  { ...task, id: "5", title: "Task 5" },
  { ...task, id: "6", title: "Task 6" }
];

// expands the default tasks adding a new pinned task that will be used across our tests and stories
export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" }
];
