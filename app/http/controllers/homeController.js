const Menu = require("../../models/menu.js");

function homeController() {
  return {
    async index(req, res) {
      const items = await Menu.find();
      res.render("home", { items: items });
    },
  };
}

module.exports = homeController;
