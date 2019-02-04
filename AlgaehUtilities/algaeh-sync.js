async function algaehSync(list) {
  let promiseList = [];
  for (let i = 0; i < list.length; i++) {
    promiseList.push(await list[i]);
  }
  return Promise.all(promiseList);
}
module.exports = algaehSync;
