<script>
  import { onMount } from "svelte";
  import axios from "axios";
  export let url;
  export let show;
  export let current = null;
  export let onHide = () => {};
  export let onEditSubmit = () => {};
  export let onAddSubmit;

  let intialformData;
  let inputs = [];

  onMount(() => {
    getPaths().then(res => {
      inputs = res.data.data.map(item => ({ label: item, value: "" }));
      const tempData = {};
      res.data.data.forEach(item => {
        tempData[item] = "";
      });
      intialformData = tempData;
    });
  });

  async function getPaths() {
    const data = await axios.get(`${url}/translation/paths`);
    return data;
  }

  let formData;
  $: if (show) {
    if (current) {
      formData = current;
    } else {
      formData = { ...intialformData };
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    formData[name] = value;
    formData = { ...formData };
  }

  function onSubmit() {
    if (current) {
      onEditSubmit(formData);
    } else {
      onAddSubmit(formData);
    }
    formData = { ...intialformData };
  }

  function onHideClick() {
    onHide();
    formData = { ...intialformData };
  }
</script>

<div class="w3-modal" style=" display: {show ? 'block' : 'none'} ">
  <div class="w3-modal-content w3-animate-top w3-card-4">
    <header class="w3-container">
      <span class="w3-button w3-display-topright" on:click={onHideClick}>
        &times;
      </span>
      <h2>{current ? 'Edit' : 'Add'} Field</h2>
    </header>
    <div class="w3-container">
      <form class="w3-container">
        {#each inputs as input (input.label)}
          <p>
            <label>{input.label}</label>
            <input
              class="w3-input w3-border w3-round"
              type="text"
              name={input.label}
              value={formData ? formData[input.label] : ''}
              on:change={handleChange} />
          </p>
        {/each}

      </form>
    </div>
    <footer class="w3-container w3-padding-16">
      <button
        class="w3-btn w3-green w3-border w3-border-white w3-round-xlarge
        w3-right"
        on:click={onSubmit}>
        {current ? 'Update' : 'Save'}
      </button>
    </footer>
  </div>
</div>
