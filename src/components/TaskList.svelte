<!--initial composite component code
<script>
  import Task from "./Task.svelte";
  export let loading = false;
  export let tasks = [];


  $:noTasks= tasks.length===0;
  $:emptyTasks=tasks.length === 0 && !loading;
</script>
{#if loading}
  <div class="list-items">loading</div>
{/if}

{#if emptyTasks}
  <div class="list-items">empty</div>
{/if}


{#each tasks as task}
  <Task {task} on:onPinTask on:onArchiveTask/>
{/each}-->

<!-- updated composite component code 
<script>
  import Task from "./Task.svelte";
  import LoadingRow from "./LoadingRow.svelte";
  export let loading = false;
  export let tasks = [];


  $:noTasks= tasks.length===0;
  $:emptyTasks=tasks.length === 0 && !loading;
  $: tasksInOrder = [
    ...tasks.filter(t => t.state === "TASK_PINNED"),
    ...tasks.filter(t => t.state !== "TASK_PINNED")
  ];
</script>
{#if loading}
  <div class="list-items">
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </div>
{/if}

{#if tasks.length === 0 && !loading}
  <div class="list-items">
    <div class="wrapper-message">
      <span class="icon-check" />
      <div class="title-message">You have no tasks</div>
      <div class="subtitle-message">Sit back and relax</div>
    </div>
  </div>
{/if}

{#each tasksInOrder as task}
  <Task {task} on:onPinTask on:onArchiveTask />
{/each}-->

<!--code for data section-->
<script>
  import PureTaskList from './PureTaskList.svelte';
  /* import {store} from '../store';  */
  import {taskStore} from '../store'; 
  function onPinTask(event) {
    console.log(`tasklist pin task:${event.detail.id}`);
    store.archiveTask(event.detail.id)
    
  }
  function onArchiveTask(event) {
    console.log(`tasklist archive task:${event.detail.id}`);
    store.pinTask(event.detail.id)
  }
</script>

<div>
  <!-- code for data section
  <PureTaskList tasks={$store} on:onPinTask={onPinTask} on:onArchiveTask={onArchiveTask}/>-->
  <PureTaskList tasks={$taskStore} on:onPinTask={onPinTask} on:onArchiveTask={onArchiveTask}/>
</div>
<!---->