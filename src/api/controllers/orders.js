// I am only putting orders.js in the controllers i will also leave a route(products) as it is
// i.e.

const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");
// Handle incoming get requests
// This means that serverip/products/ will be handled by below.
exports.getOrders = (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        // What populate does is put the values inside the product object and displays it
        // When you query order you can also query the product details with the associated order as well.
        // Down below you can see the product information inside as well.
        // "orders": [
        //     {
        //         "_id": "5f2e88bac5b1bc014b7235f9",
        //         "product": {
        //             "_id": "5f2bffd4cf9add03eb9273df",
        //             "name": "Harry Potter 4",
        //             "price": 25,
        //             "__v": 0
        //         },
        //         "quantity": 10,
        //         "request": {
        //             "type": "GET",
        //             "url": "http://localhost:3000/orders/5f2e88bac5b1bc014b7235f9"
        //         }
        //     },
        // SYNTAX product(object to refer, fields of the object)
        .populate("product", "name")
        .exec() // Turn into a real promise
        .then((result) => {
            console.log(result);
            res.status(200).json({
                count: result.length,
                orders: result.map((res) => {
                    return {
                        _id: res._id,
                        product: res.product,
                        quantity: res.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + res._id,
                        },
                    };
                }),
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Failed",
                error: error,
            });
        });
};

exports.postOrders = (req, res, next) => {
    Product.findById(req.body.productId).then((product) => {
        if (!product) {
            return res.status(500).json({
                message: "Product not found",
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId,
        });
        order
            .save()
            .then((result) => {
                console.log(result);
                res.status(201).json({
                    message: "Order successfully created",
                    createdOrder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity,
                    },
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/orders/${result._id}`,
                    },
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err,
                });
            });
    });
};

exports.getOneOrder = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then((order) => {
            if (!order) {
                res.status(404).json({
                    message: "Order not found",
                });
            } else {
                res.status(200).json({
                    order: order,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders",
                    },
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
};

exports.editOrder = (req, res, next) => {
    res.status(200).json({
        message: "Updated Order",
    });
};

exports.deleteOrder = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "Deleted Order",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: { productId: "ID", quantity: "Number" },
                },
            });
        })
        .catch();
};
