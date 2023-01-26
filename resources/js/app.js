import axios from "axios";
import Noty from "noty";

const cardBtn = document.querySelectorAll(".card-btn");
const cartCounter = document.querySelector("#cart-counter");

cardBtn.forEach(function (btn) {
  btn.addEventListener("click", (e) => {
    let item = JSON.parse(btn.dataset.item);
    updateCart(item);
  });
});

function updateCart(item) {
  axios
    .post("/update-cart", item)
    .then((res) => {
      cartCounter.innerHTML = res.data.totalQty;
      new Noty({
        theme: "metroui",
        type: "success",
        timeout: 1500,
        layout: "bottomRight",
        text: `Item has been added to the cart 🎉`,
        progressBar: true,
      }).show();
    })
    .catch((err) => {
      new Noty({
        theme: "metroui",
        type: "error",
        timeout: 1500,
        layout: "bottomRight",
        text: `Something went wrong 🤔`,
        progressBar: true,
      }).show();
    });
}

// Remove order success alert after X seconds
const orderAlert = document.querySelector(".order-alert");
if (orderAlert) {
  setTimeout(() => {
    orderAlert.remove();
  }, 5000);
}
