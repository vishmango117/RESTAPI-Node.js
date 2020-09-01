const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        //Accept File
        cb(null, true);
    } else {
        // Reject File
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 15,
    },
    fileFilter: fileFilter,
});

// Handle incoming get requests
// This means that serverip/products/ will be handled by below.
router.get("/", (req, res, next) => {
    // If params in find is not specified it will find all
    // If items are 0 it will return an empty object []
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then((docs) => {
            console.log(docs);
            // We can setup an if condition and return a
            // different status if the data inside is an empty object
            //if(length >=0){ // return status 200}
            // else return status 404
            res.status(200).json({
                count: docs.length,
                products: docs.map((doc) => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        // Customizing the response for ease of use
                        // This way we can get the get request on the individual item itself.
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id,
                        },
                    };
                }),
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
});

// We can add as many handlers as we want and they will execute in order
// That means that upload.single first occurs then the arrow function inside occurs next
router.post("/", checkAuth, upload.single("productImage"), (req, res, next) => {
    //OUTPUT
    // fieldname: 'productImage',
    // originalname: 'task6_part-b.1.png',
    // encoding: '7bit',
    // mimetype: 'image/png',
    // destination: 'uploads/',
    // filename: '22886153d2a6610634325df580ef029b',
    // path: 'uploads/22886153d2a6610634325df580ef029b',
    console.log(req.file);

    // CREATING NEW PRODUCT
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
    });

    product
        .save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: "Product Created Successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + result._id,
                    },
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

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then((doc) => {
            console.log("From Database");

            // If Item with ID is available
            if (doc) {
                console.log(doc);
                res.status(200).json(doc);
            }

            // If item is not found
            else {
                res.status(404).json({
                    message: "No Valid Entry for products.",
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error,
            });
        });
});

// PATCH OPERATION : Needs the unique _id to selectively update its values.
// BODY FORMAT
// [
//     {"propName": "name", "value": "Harry Potter 18" },
//     {"propName": "price", "value": 12.50}
// ]

router.patch("/:productId", checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    // setting an object
    // in this example
    // 1st iteration updateOps[name] = Hala
    // 2nd iteration updateOps[price] = 12.50
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                message: "Product Updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id,
                },
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error,
            });
        });
});

//DELETE REQUEST

router.delete("/:productId", checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "Product Deleted",
                result: result,
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products/",
                    // Giving the API user how to structure the POST request.
                    body: { name: "String", price: "Number" },
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
});
module.exports = router;
