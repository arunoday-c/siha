<script>
  export let onSearch;
  let search;
</script>

<div class="w3-col m6">
  <div class="w3-row">
    <div class="w3-col m7 w3-margin-right">
      <input
        bind:value={search}
        class="w3-input w3-border w3-round"
        type="text"
        placeholder="Search Fields" />
    </div>
    <div class="w3-col m4 ">
      <button
        on:click={onSearch(search)}
        class="w3-button w3-green"
        style="width:5rem">
        Search
      </button>
    </div>
  </div>
</div>
