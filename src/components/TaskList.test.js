// initial code
/* import TaskList from "./TaskList.svelte";
import { render } from "@testing-library/svelte";
import { withPinnedTasks } from "./TaskList.stories";
describe("TaskList", () => {
  it("renders pinned tasks at the start of the list", () => {
    setTimeout(() => {
      const { container } = render(TaskList, {
        props: {
          tasks: withPinnedTasks
        }
      });
      expect(container.firstChild.classList.contains("TASK_PINNED")).toBe(true);
    }, 10);
  });
}); */

// update code for data section
import PureTaskList from "./PureTaskList.svelte";
import {render} from '@testing-library/svelte';
import { withPinnedTasks } from './PureTaskList.stories';

describe("TaskList",()=>{
    it('renders pinned tasks at the start of the list',()=>{
        setTimeout(() => {
            const {container}= render(PureTaskList,{
                props:{
                    tasks:withPinnedTasks
                }
            })
            expect(container.firstChild.classList.contains('TASK_PINNED')).toBe(true)
        }, 10);
    })
})
//
