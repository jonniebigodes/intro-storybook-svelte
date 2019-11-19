//#region old format

/* import { storiesOf, addDecorator } from "@storybook/svelte";

import TaskList from "./TaskList.svelte";
import { task, actions } from "./Task.stories";

export const defaultTasks = [
  { ...task, id: "1", title: "Task 1" },
  { ...task, id: "2", title: "Task 2" },
  { ...task, id: "3", title: "Task 3" },
  { ...task, id: "4", title: "Task 4" },
  { ...task, id: "5", title: "Task 5" },
  { ...task, id: "6", title: "Task 6" }
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" }
];

storiesOf("TaskList", module)
  .add("default", () => {
    return {
      Component: TaskList,
      props: {
        tasks: defaultTasks
      },
      on: {
        ...actions
      }
    };
  })
  .add("withPinnedTasks", () => {
    return {
      Component: TaskList,
      props: {
        tasks: withPinnedTasks
      },
      on: {
        ...actions
      }
    };
  })
  .add("loading", () => {
    return {
      Component: TaskList,
      props: {
        loading: true
      },
      on: {
        ...actions
      }
    };
  })
  .add("empty", () => {
    return {
      Component: TaskList,
      on: {
        ...actions
      }
    };
  }); */

// updated code for data section

import { storiesOf } from "@storybook/svelte";

import PureTaskList from "./PureTaskList.svelte";
import { task, actions } from "./Task.stories";

export const defaultTasks = [
  { ...task, id: "1", title: "Task 1" },
  { ...task, id: "2", title: "Task 2" },
  { ...task, id: "3", title: "Task 3" },
  { ...task, id: "4", title: "Task 4" },
  { ...task, id: "5", title: "Task 5" },
  { ...task, id: "6", title: "Task 6" }
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" }
];

storiesOf("PureTaskList", module)
  .add("default", () => {
    return {
      Component: PureTaskList,
      props: {
        tasks: defaultTasks
      },
      on: {
        ...actions
      }
    };
  })
  .add("withPinnedTasks", () => {
    return {
      Component: PureTaskList,
      props: {
        tasks: withPinnedTasks
      },
      on: {
        ...actions
      }
    };
  })
  .add("loading", () => {
    return {
      Component: PureTaskList,
      props: {
        loading: true
      },
      on: {
        ...actions
      }
    };
  })
  .add("empty", () => {
    return {
      Component: PureTaskList,
      on: {
        ...actions
      }
    };
  });
//#endregion

//#region csf

//#endregion