<script>
  export let data;
  export let onEdit;
  export let onDelete;
  export let changePage;

  function onPageClick(no, e) {
    e.preventDefault();
    changePage(no);
  }
</script>

<style>
  table {
    margin: 0 auto;
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    text-align: center;
  }

  td,
  th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: #4caf50;
    color: white;
  }
</style>

<div>
  <table id="customer">
    <tr>
      <th>Actions</th>
      <th>Field Name</th>
      <th>English</th>
      <th>Arabic</th>
    </tr>
    {#each data.docs as item (item._id)}
      <tr>
        <td>
          <button
            class="w3-button w3-white w3-border w3-border-green w3-round-large"
            on:click={e => onEdit(item)}>
            Edit
          </button>
          <button
            class="w3-button w3-red w3-round-large"
            on:click={e => onDelete(item)}>
            Delete
          </button>
        </td>
        <td>{item.fieldName}</td>
        <td>{item.en}</td>
        <td>{item.ar}</td>
      </tr>
    {/each}
  </table>
  <div class="w3-container">
    <div class="w3-bar ">
      <button
        class="w3-button"
        on:click={e => onPageClick(data.prevPage, e)}
        disabled={!data.hasPrevPage}>
        &laquo;
      </button>
      {#each new Array(data.totalPages) as _, i (i)}
        <button
          class="w3-button {data.page === i + 1 ? 'w3-green' : ''}"
          on:click={e => onPageClick(i + 1, e)}>
          {i + 1}
        </button>
      {/each}
      <button
        class="w3-button"
        on:click={e => onPageClick(data.nextPage, e)}
        disabled={!data.hasNextPage}>
        &raquo;
      </button>
    </div>
  </div>
</div>
