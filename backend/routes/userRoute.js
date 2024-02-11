const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getIndividualUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset").put(resetPassword);


router.route("/logout").get(logout);

router.route("/mydetails").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/profile/update").put(isAuthenticatedUser, updateUserProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getIndividualUser);

router
  .route("/delete/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router
  .route("/update/user-role/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
module.exports = router;
