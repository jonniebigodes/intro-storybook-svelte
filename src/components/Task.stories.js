//#region old_format
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
/* import { storiesOf } from "@storybook/svelte";
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
  }); */

// updated for creating addons section
/* import { storiesOf } from "@storybook/svelte";
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
  .addParameters({
    assets: [
      "path/to/your/asset.png",
      "path/to/another/asset.png",
      "path/to/yet/another/asset.png"
    ]
  })
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
 */

//final code
/* import { storiesOf } from "@storybook/svelte";
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
  .addParameters({
    assets: [
      "./image_1.jpg",
      "./image_2.jpg",
      "./image_3.jpg"
    ]
  })
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
  }); */
//#endregion

//#region csf
import { action } from '@storybook/addon-actions';
import Task from "./Task.svelte";
import { withKnobs, object } from "@storybook/addon-knobs";
export default {
  title: "Task",
  //knobs code
  decorators: [withKnobs],
  excludeStories: /.*Data$/,
  //
  // create addons code
  parameters:{
    assets: [
      "./image_1.jpg",
      "./image_2.jpg",
      "./image_3.jpg"
    ]
  }
  //
};

export const taskData = {
  id: "1",
  title: "Test Task",
  state: "Task_INBOX",
  updated_at: new Date(2019, 0, 1, 9, 0)
};

export const actionsData = {
  onPinTask: action("onPinTask"),
  onArchiveTask: action("onArchiveTask")
};

const reallylongTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not`;
export const Default = () => ({
  Component: Task,
  props: {
    //task initial
    task: object("task", { ...taskData }) // knobs addon
  },
  on: {
    ...actionsData
  }
});
export const Pinned = () => ({
  Component: Task,
  props: {
    task: {
      ...taskData,
      state: "TASK_PINNED"
    }
  },
  on: {
    ...actionsData
  }
});
export const Archived = () => ({
  Component: Task,
  props: {
    task: {
      ...taskData,
      state: "TASK_ARCHIVED"
    }
  },
  on: {
    ...actionsData
  }
});
//
export const LongTitle = () => ({
  Component: Task,
  props: {
    task: {
      ...taskData,
      title: reallylongTitle
    }
  }
});
//#endregion
