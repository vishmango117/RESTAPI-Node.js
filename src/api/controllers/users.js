const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user && user.length >= 1) {
                // We can either use Error 409 (CONFLICT) or Error 422 (UNPROCESSABLE ENTITY)
                // This condition for if the user with the request email already exists.
                res.status(409).json({
                    message: "Email already exists",
                });
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error) {
                        return res.status(500).json({
                            error: error,
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            // password: req.body.password, THIS IS A TERRIBLE WAY TO DO IT
                        });
                        user.save()
                            .then((result) => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created",
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(500).json({
                                    error: error,
                                });
                            });
                    }
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
};

exports.loginUser = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length < 1) {
                res.status(401).json({
                    message: "Auth Failed",
                });
            } else {
                bcrypt.compare(
                    req.body.password,
                    user[0].password,
                    (error, result) => {
                        if (error) {
                            res.status(401).json({
                                message: "Auth Failed",
                            });
                        }
                        if (result) {
                            const token = jwt.sign(
                                {
                                    email: user[0].email,
                                    userId: user[0]._id,
                                },
                                process.env.JWT_SECRET_KEY,
                                {
                                    expiresIn: "1h",
                                }
                            );
                            res.status(200).json({
                                message: "Logged In",
                                token: token,
                            });
                        }
                    }
                );
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error,
            });
        });
};

exports.deleteUser = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "User Deleted",
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error,
            });
        });
};
