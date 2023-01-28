import axios from "axios";
import Noty from "noty";
import initAdmin from "./admin";
import moment from "moment";

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
  }, 3000);
}

// Change Order Status
let statuses = document.querySelectorAll(".status-line");
let hiddenInput = document.querySelector("#hidden-input");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);

let time = document.createElement("small");

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-done");
    status.classList.remove("current-step");
  });
  let stepCompleted = true;

  statuses.forEach((status) => {
    let dataStatus = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-done");
    }

    if (dataStatus === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current-step");
      }
    }
  });
}

updateStatus(order);

// Socket
let socket = io();
initAdmin(socket);

if (order) {
  socket.emit("join", `order_${order._id}`);
}

let adminAreaPath = window.location.pathname;
console.log(adminAreaPath);

if (adminAreaPath.includes("admin")) {
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    theme: "metroui",
    type: "success",
    timeout: 1500,
    layout: "topRight",
    text: "Order Updated Successfully 🎉",
    progressBar: true,
  }).show();
});
