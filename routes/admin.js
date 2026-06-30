const express = require("express");

const router = express.Router();

const {
  dashboard,

  getUsers,
  updateUser,
  deleteUser,

  getAgents,

  getProperties,
  deleteProperty,

  getInquiries,
  deleteInquiry,

} = require("../controllers/adminController");

const {
  protect,
  admin,
} = require("../middleware/admin");

/* Dashboard */

router.get(
  "/dashboard",
  protect,
  admin,
  dashboard
);

/* Users */

router.get(
  "/users",
  protect,
  admin,
  getUsers
);

router.put(
  "/users/:id",
  protect,
  admin,
  updateUser
);

router.delete(
  "/users/:id",
  protect,
  admin,
  deleteUser
);

/* Agents */

router.get(
  "/agents",
  protect,
  admin,
  getAgents
);

/* Properties */

router.get(
  "/properties",
  protect,
  admin,
  getProperties
);

router.delete(
  "/properties/:id",
  protect,
  admin,
  deleteProperty
);

/* Inquiries */

router.get(
  "/inquiries",
  protect,
  admin,
  getInquiries
);

router.delete(
  "/inquiries/:id",
  protect,
  admin,
  deleteInquiry
);

module.exports = router;