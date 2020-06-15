<script>
  import axios from "axios";
  import Modal from "./Modal.svelte";
  import Table from "./Table.svelte";
  import Search from "./Search.svelte";
  import Loader from "./Loader.svelte";

  const baseURL = `${window.location.protocol}//${window.location.hostname}:3006`;

  let page = 1,
    limit = 20,
    search = "";
  // crud functions
  async function getData(page, limit, search) {
    const url = `${baseURL}/translation/?page=${page}&limit=${limit}&search=${search}`;
    const res = await axios.get(url);
    return res.data.data;
  }

  async function updateData(input) {
    const url = `${baseURL}/translation/${input._id}`;
    const res = await axios.post(url, input);
  }

  async function addData(input) {
    const url = `${baseURL}/translation/add`;
    const res = await axios.post(url, input);
  }

  async function deleteData(input) {
    const url = `${baseURL}/translation/${input._id}`;
    const res = await axios.delete(url);
  }

  let data = [];
  let show;
  let current = null;

  function onEdit(item) {
    show = true;
    current = item;
  }

  function onAdd() {
    show = true;
  }

  function onEditSubmit(input) {
    updateData(input)
      .then(res => {
        show = false;
        current = null;
        data = getData(page, limit, search);
      })
      .catch(e => console.log(e));
  }

  function onAddSubmit(input) {
    addData(input)
      .then(() => {
        show = false;
        current = null;
        data = getData(page, limit, search);
      })
      .catch(e => console.log(e));
  }

  function onDelete(input) {
    if (confirm(`Do you want to delete ${input.fieldName}`)) {
      deleteData(input)
        .then(() => {
          data = getData(page, limit, search);
        })
        .catch(e => console.log(e));
    }
  }

  function onClose() {
    show = false;
    current = null;
  }

  function changePage(num) {
    page = num;
  }

  function onSearch(input) {
    search = input;
  }

  $: {
    data = getData(page, limit, search);
  }
</script>

<Modal
  {show}
  {current}
  onHide={onClose}
  url={baseURL}
  {onEditSubmit}
  {onAddSubmit} />
<div class="w3-container w3-margin-bottom">
  <div class="w3-row">
    <Search {onSearch} />
    <div class="w3-col m6">
      <button
        class="w3-button w3-right w3-green w3-round-large"
        on:click={e => onAdd()}>
        + Add New Field
      </button>
    </div>
  </div>
</div>
{#await data}
  <Loader />
{:then result}
  <Table data={result} {onEdit} {changePage} {onDelete} />
{:catch error}
  <p>{error.message}</p>
{/await}
