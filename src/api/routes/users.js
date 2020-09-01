const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const Users = require("../controllers/users");

router.post("/signup", Users.createUser);

router.post("/login", Users.loginUser);

// checkAuth doesnt help much because any user logged in can delete other users
// so there have to be a much more robust way to block other users from deleting
// such as setting permissions and so on.
router.delete("/:userId", checkAuth, Users.deleteUser);

module.exports = router;
