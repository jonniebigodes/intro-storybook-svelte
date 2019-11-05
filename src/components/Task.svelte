<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // event handler for Pin Task
  function PinTask() {
    dispatch("onPinTask", {
      id: task.id
    });
  }
  // event handler for Archive Task
  function ArchiveTask() {
    console.log(`task ArchiveTask :${task.id}`);
    dispatch("onArchiveTask", {
      id: task.id
    });
  }
  //

  // props
  export let task = {
    id: "",
    title: "",
    state: "",
    updated_at: new Date(2019, 0, 1, 9, 0)
  };
  //

  $: isChecked = task.state === "TASK_ARCHIVED";
</script>

<!--initial code
 <script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch= createEventDispatcher()

    // event handler for Pin Task
    function PinTask(){
        dispatch('onPinTask',{
            id:task.id
        })
    }

    // event handler for Archive Task
    function ArchiveTask() {
        dispatch('onArchiveTask',{
            id:task.id
        });
    }
    //

  // Task props
  export let task={
      id:'',
      title:'',
      state:'',
      updated_at:new Date(2019, 0, 1, 9, 0)

  };
  //
</script><div class="list-item">
  <input type="text" value={task.title} readonly />
</div>-->

<!--simple component section updated code<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // event handler for Pin Task
  function PinTask() {
    dispatch("onPinTask", {
      id: task.id
    });
  }
  // event handler for Archive Task
  function ArchiveTask() {
    console.log(`task ArchiveTask :${task.id}`);
    dispatch("onArchiveTask", {
      id: task.id
    });
  }
  //

  // props
  export let task = {
    id: "",
    title: "",
    state: "",
    updated_at: new Date(2019, 0, 1, 9, 0)
  };
  //

  $: isChecked = task.state === "TASK_ARCHIVED";
</script><div class={`list-item ${task.state}`}>
  <label class="checkbox">
    <input type="checkbox" checked={isChecked} disabled name="checked" />
    <span class="checkbox-custom" on:click={ArchiveTask} />
  </label>
  <div class="title">
    <input type="text" readonly value={task.title} placeholder="Input title" />
  </div>
  <div class="actions">
    {#if task.state !== 'TASK_ARCHIVED'}
      <a href="/" on:click|preventDefault={PinTask}>
        <span class="icon-star" />
      </a>
    {/if}
  </div>
</div>-->

<!-- updated code for using addons section-->
<div class={`list-item ${task.state}`}>
  <label class="checkbox">
    <input type="checkbox" checked={isChecked} disabled name="checked" />
    <span class="checkbox-custom" on:click={ArchiveTask} />
  </label>
  <div class="title">
    <input
      type="text"
      readonly
      value={task.title}
      placeholder="Input title"
      style="text-overflow: ellipsis;" />
  </div>
  <div class="actions">
    {#if task.state !== 'TASK_ARCHIVED'}
      <a href="/" on:click|preventDefault={PinTask}>
        <span class="icon-star" />
      </a>
    {/if}
  </div>
</div>
