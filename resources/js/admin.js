import axios from "axios";
import moment from "moment";
import Noty from "noty";

function initAdmin(socket) {
  const orderTableBody = document.querySelector(".order-table-body");
  let orders = [];
  let markup;

  axios
    .get("/admin-orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      (orders = res.data),
        (markup = generateMarkup(orders)),
        (orderTableBody.innerHTML = markup);
    })
    .catch((err) => {
      console.log(err);
    });

  function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map((menuItem) => {
        return `<p>${menuItem.item.name} = ${menuItem.qty} pcs</p>`;
      })
      .join("");
  }

  function generateMarkup(orders) {
    return orders
      .map((order) => {
        return `
            <tr>
                <td class="order-items">
                    <p>${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td>${order.customerId.name}</td>
                <td>${order.address}</td>
                <td>
                    <div class="status-form">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${
                              order._id
                            }" />
                            <select name="status" onchange="this.form.submit()" class="status-select">
                                <option value="order_placed" ${
                                  order.status === "order_placed"
                                    ? "selected"
                                    : ""
                                }>Placed</option>
                                <option value="confirmed" ${
                                  order.status === "confirmed" ? "selected" : ""
                                }>Confirmed</option>
                                <option value="prepared" ${
                                  order.status === "prepared" ? "selected" : ""
                                }>Prepared</option>
                                <option value="delivered" ${
                                  order.status === "delivered" ? "selected" : ""
                                }>Delivered</option>
                                <option value="completed" ${
                                  order.status === "completed" ? "selected" : ""
                                }>Completed</option>
                            </select>
                        </form>
                        <div class=""></div>
                    </div>
                </td>
                <td>
                    ${moment(order.createdAt).format("hh:mm A")}
                </td>
            </tr>
        `;
      })
      .join("");
  }

  socket.on("orderPlaced", (order) => {
    new Noty({
      theme: "metroui",
      type: "success",
      timeout: 1500,
      layout: "topRight",
      text: "Order Placed Successfully 🎉",
      progressBar: true,
    }).show();

    orders.unshift(order);
    orderTableBody.innerHTML = "";
    orderTableBody.innerHTML = generateMarkup(orders);
  });
}

export default initAdmin;
