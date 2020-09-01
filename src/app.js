const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config({
    path: "./src/dbconfig.env",
});

// for password it is better to encode as a system env variable for security
// e.g. process.env.MONGO_ATLAS_PWD

// Connection URL
const URL = process.env.DB_URL;

//Ensuring connection to the DB
mongoose.connection.on("open", (ref) => {
    console.log("Connection to Mongo Server Established");
});

mongoose.connection.on("error", (error) => {
    console.log("Connection Failed Below is the Error");
    console.log(error);
});

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

//Enable Logging
app.use(morgan("dev"));

// Since a upload route is not created to handle requests we need to make the uploads publicly accessible
// or either create a route that helps deal with the upload requests.
// with this we expose the folder at /uploads/imagelist and hence when we get the
// path it can ignore this /uploads and take the image value as is
app.use("/uploads", express.static("uploads")); // Makes folders publicly available
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Ensure to prevent CORS Error
app.use((req, res, next) => {
    // allows access from anywhere
    res.header("Access-Control-Allow-Origin", "*");
    // You can also restrict access from only this website can access the api
    // though it is not recommended. But it doesnt protect/restrict access from testing tools like Postman
    // res.header('Access-Control-Allow-Origin', 'http"//my-cool-page.com')

    // Specifies which headers can we can accept
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With , Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        // Set Requested methods youd wish to support.
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
    }
    // THE AUTHOR HERE IS AN ABSOLUTE DUMBASS FORGOT TO PUT THE LINE BELOW
    // ALlow other routes to take over as well
    next();
});

// Incoming app must go through use
//Anything contained in /products will be forwarded to the productRoutes application
app.use("/products", productRoutes);

//Order Routes
app.use("/orders", orderRoutes);

//User Routes In usage
app.use("/users", userRoutes);

// if they make through the above we can assume that anything above cannot be handle which implies they are errors
app.use((req, res, next) => {
    const error = new Error("End of App");
    error.status = 404;
    //Forward this error request below
    next(error);
});

// To Handle all sorts of errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
