const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

// React style import doesnt work just an FYI
// e.g. import * from modules;
const Orders = require("../controllers/orders");

// The functionality as been moved to getOrders functionality to adopt a MVC design or MC in this case.
router.get("/", checkAuth, Orders.getOrders);

// ORDER POST REQUEST
// BODY STRUCTURE EXAMPLE:
// {
//     "productId": "5f2bffd4cf9add03eb9273df",
//     "quantity": 15
// }

router.post("/", checkAuth, Orders.postOrders);

router.get("/:orderId", checkAuth, Orders.getOneOrder);

router.patch("/:orderId", checkAuth, Orders.editOrder);
router.delete("/:orderId", checkAuth, Orders.deleteOrder);

module.exports = router;
