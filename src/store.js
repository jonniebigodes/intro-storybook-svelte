//initial code
//import { writable } from 'svelte/store';
/* const TaskBox = () => {
 
  // creates a new writable store populated with some initial data
    const { subscribe, update } = writable([
      { id: "1", title: "Something", state: "TASK_INBOX" },
      { id: "2", title: "Something more", state: "TASK_INBOX" },
      { id: "3", title: "Something else", state: "TASK_INBOX" },
      { id: "4", title: "Something again", state: "TASK_INBOX" }
    ]);
    
    return {
        subscribe,
        // method to archive a task, think of a action with redux or Vuex
        archiveTask:(id)=>update(tasks=>{
          tasks.map(task=>task.id===id?{...task,state:'TASK_ARCHIVED'}:task)
          console.log(`store archive task=>${JSON.stringify(tasks,null,2)} id:${id}`)
          return tasks
        }),
        // method to pin a task, think of a action with redux or Vuex
        pinTask:(id)=>update(tasks=>{
          tasks.map(task=>task.id===id?{...task,state:'TASK_PINNED'}:task)
          console.log(`store pin task=>${JSON.stringify(tasks,null,2)} id:${id}`)
          return tasks
        })
    }
  }; 
  // We export the constructed svelte store
  export const taskStore = TaskBox(); */
//

// updated code for screen section
import { writable } from "svelte/store";
const TaskBox = () => {
  const { subscribe, update } = writable([
    { id: "1", title: "Something", state: "TASK_INBOX" },
    { id: "2", title: "Something more", state: "TASK_INBOX" },
    { id: "3", title: "Something else", state: "TASK_INBOX" },
    { id: "4", title: "Something again", state: "TASK_INBOX" }
  ]);

  return {
    subscribe,
    archiveTask: id =>
      update(tasks => tasks.map(task =>
        task.id === id ? { ...task, state: "TASK_ARCHIVED" } : task
      )),
    pinTask: id =>
      update(tasks =>  tasks.map(task =>
        task.id === id ? { ...task, state: "TASK_PINNED" } : task
      ))
  };
};
export const taskStore = TaskBox();

const appState = () => {
  const { subscribe, update } = writable(false);
  return {
    subscribe,
    error: () => update(error => !error)
  };
};

export const AppStore = appState();
