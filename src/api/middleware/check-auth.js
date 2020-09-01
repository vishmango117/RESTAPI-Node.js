const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // We call this when it succedes.
    //verify will decode and then return the value decoded
    try {
        const decoded = jwt.verify(
            // We can access the headers information since it is recommended to just
            // place JWT in the header section we then split since the syntax is
            //JWT Header: "Bearer TOKEN_VALUE"
            req.headers.authorization.split(" ")[1],
            process.env.JWT_SECRET_KEY,
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(401).json({
                        message: "Log In Failed",
                    });
                }
                if (result) {
                    console.log(result);
                    req.userData = result;
                    next();
                }
            }
        );
    } catch {
        res.status(401).json({
            message: "Log In Failed",
        });
    }
};
