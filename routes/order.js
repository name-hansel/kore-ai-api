const express = require('express');
const router = express.Router();
const { isValidObjectId } = require("mongoose");

const Order = require('../models/Order');

// @route   GET /api/:orderID
// @desc    Get order by id
// @access  Public
router.get("/:orderID", async (req, res) => {
  try {
    const orderID = req.params.orderID;

    // Check if order id is present and a valid mongodb id
    if (!orderID || orderID.length === 0 || !isValidObjectId(orderID)) return res.status(400).json({ error: "Invalid order ID" });

    const orderData = await Order.findById(orderID);
    if (!orderData) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({
      data: orderData
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
})

// @route   GET /api
// @desc    Get all orders
// @access  Public
router.get("/", async (req, res) => {
  try {
    const orderData = await Order.find();
    res.status(200).json({
      data: orderData
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
})

// @route   POST /api/add
// @desc    Add an order
// @access  Public
router.post("/add", (req, res) => {
  try {
    // TODO validation
    const { customerId, deliveryAddress, quantity, status } = req.body;
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
})

module.exports = router;