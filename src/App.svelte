<script>
  // initial code
  /* export let name; */
  import { AppStore } from "./store";
  import InboxScreen from "./components/InboxScreen.svelte";
</script>

<!-- initial code<style>
  h1 {
    color: purple;
  }
</style><h1>Hello {name}!</h1> -->
<InboxScreen error={$AppStore} />

