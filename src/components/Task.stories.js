/* import { storiesOf } from "@storybook/svelte";
import { action} from "@storybook/addon-actions";

import Task from "./Task.svelte";

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

storiesOf("Task", module)
  .add("default", () => {
    return {
      Component: Task,
      props: {
        task
      },
       on: {
        ...actions
      }
    };
  })
  .add("pinned", () => {
    return {
      Component: Task,
      props: {
        task: {
          ...task,
          state: "TASK_PINNED"
        }
      },
      on: {
        ...actions
      }
    };
  })
  .add("archived", () => {
    return {
      Component: Task,
      props: {
        task: {
          ...task,
          state: "TASK_ARCHIVED"
        }
      },
      on: {
        ...actions
      }
    };
  }); */

// updated code for knobs addon
import { storiesOf } from "@storybook/svelte";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs";
import Task from "./Task.svelte";
const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not`;
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

storiesOf("Task", module)
  .addDecorator(withKnobs)
  .add("default", () => {
    return {
      Component: Task,
      props: {
        task: object("task", { ...task })
      },
      on: {
        ...actions
      }
    };
  })
  .add("pinned", () => {
    return {
      Component: Task,
      props: {
        task: {
          ...task,
          state: "TASK_PINNED"
        }
      },
      on: {
        ...actions
      }
    };
  })
  .add("archived", () => {
    return {
      Component: Task,
      props: {
        task: {
          ...task,
          state: "TASK_ARCHIVED"
        }
      },
      on: {
        ...actions
      }
    };
  })
  .add("longTitle", () => {
    return {
      Component: Task,
      props: {
        task: {
          ...task,
          title: longTitle
        }
      }
    };
  });
