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

/* import { storiesOf } from "@storybook/svelte";

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
  }); */
//#endregion

//#region csf
/* import TaskList from "./TaskList.svelte";
import { actions, defaultTasks, withPinnedTasks } from "./storybook-helper";
export default {
  title: "TaskList"
};

// default TaskList state
export const standard = () => ({
  Component: TaskList,
  props: {
    tasks: defaultTasks
  },
  on: {
    ...actions
  }
});

export const pinnedTasks = () => ({
  Component: TaskList,
  props: {
    tasks: withPinnedTasks
  },
  on: {
    ...actions
  }
});
export const loading = () => ({
  Component: TaskList,
  props: {
    loading: true
  },
});
export const empty = () => ({
  Component: TaskList,
}); */

// updated code for data section
import PureTaskList from "./PureTaskList.svelte";
import { taskData, actionsData } from "./Task.stories";
export default {
  title: "PureTaskList",
  excludeStories: /.*Data$/
};
export const defaultTasksData = [
  { ...taskData, id: "1", title: "Task 1" },
  { ...taskData, id: "2", title: "Task 2" },
  { ...taskData, id: "3", title: "Task 3" },
  { ...taskData, id: "4", title: "Task 4" },
  { ...taskData, id: "5", title: "Task 5" },
  { ...taskData, id: "6", title: "Task 6" }
];
export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" }
];
// default TaskList state
export const Default  = () => ({
  Component: PureTaskList,
  props: {
    tasks: defaultTasksData
  },
  on: {
    ...actionsData
  }
});

export const WithPinnedTasks = () => ({
  Component: PureTaskList,
  props: {
    tasks: withPinnedTasksData
  },
  on: {
    ...actionsData
  }
});
export const Loading = () => ({
  Component: PureTaskList,
  props: {
    loading: true
  }
});
export const Empty = () => ({
  Component: PureTaskList
});
//
//#endregion
