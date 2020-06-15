<script>
  import { fade } from "svelte/transition";
  import Main from "./Main.svelte";
  import Login from "./Login.svelte";
  export let title;

  let signedIn = false;

  function signIn() {
    signedIn = true;
  }
</script>

<style>
  main {
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  .center {
    text-align: center;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  {#if signedIn}
    <div transition:fade>
      <h4 class="center">{title}</h4>
      <Main />
    </div>
  {:else}
    <div transition:fade>
      <Login {signIn} />
    </div>
  {/if}
</main>
