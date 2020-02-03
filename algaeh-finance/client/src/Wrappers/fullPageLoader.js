let AlgaehLoader = options => {
  if (options.show === true) {
    //  document.getElementsByTagName("body")[0].style.overflow = "hidden";
    document.getElementById("fullPageLoader").classList.add("d-block");
  } else {
    // document.getElementsByTagName("body")[0].style.overflow = "";
    document.getElementById("fullPageLoader").classList.remove("d-block");
  }
};
export default AlgaehLoader;
