const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");

// Admin Controller
const AdminOrderController = require("../app/http/controllers/admin/orderController");

const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");

function initRoutes(app) {
  app.get("/", homeController().index);

  // Auth Routes
  app.get("/login", guest, authController().login);
  app.post("/login", authController().createLogin);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().createAccount);

  app.post("/logout", authController().logout);

  // Cart Routes
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  // Customer Routes
  app.post("/orders", auth, orderController().store);
  app.get("/customer-orders", auth, orderController().index);

  // Admin Routes
  app.get("/admin-orders", auth, AdminOrderController().index);
}

module.exports = initRoutes;
