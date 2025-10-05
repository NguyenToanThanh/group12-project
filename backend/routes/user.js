const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
<<<<<<< HEAD
=======
router.put("/users/:id", userController.updateUser); // PUT
router.delete("/users/:id", userController.deleteUser); // DELETE
>>>>>>> 8b4701d470cc2192f38f68c68e1bf929b09a4edc

module.exports = router;
