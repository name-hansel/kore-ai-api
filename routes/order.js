const express = require('express');
const router = express.Router();
const { isValidObjectId } = require("mongoose");

const Order = require('../models/Order');
const { orderValidation, editValidation } = require("../utils/dataValidation")

// @route   GET /api/checkCapacity/:date
// @desc    Return left milk for the day
// @access  Public

// @route   GET /api/:orderId
// @desc    Get order by id
// @access  Public
router.get("/order/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Check if order id is present and a valid mongodb id
    if (orderId === undefined || orderId.length === 0 || !isValidObjectId(orderId)) return res.status(400).json({ error: "Invalid order ID" });

    const orderData = await Order.findById(orderId);
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
router.get("/order", async (req, res) => {
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
router.post("/add", orderValidation, async (req, res) => {
  try {
    const { customerId, deliveryAddress, quantity, status } = req.body;

    const order = new Order({
      customerId, deliveryAddress, quantity, status
    });

    const savedOrder = await order.save();

    res.status(201).json({ data: savedOrder });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
})

// @route   PUT /api/updateStatus/:orderId
// @desc    Update order status
// @access  Public
router.put("/updateStatus/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Check if order id is present and a valid mongodb id
    if (orderId === undefined || orderId.length === 0 || !isValidObjectId(orderId)) return res.status(400).json({ error: "Invalid order ID" });

    const { status } = req.body;
    if (!status || status.length === 0 || !["placed", "packed", "dispatched", "delivered"].includes(status)) return res.status(400).json({ error: "Invalid order status" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    const updatedOrder = await order.save();
    res.status(200).json({ data: updatedOrder });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
})

// @route   PUT /api/:orderId
// @desc    Update order
// @access  Public
router.put("/:orderId", editValidation, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Check if order id is present and a valid mongodb id
    if (orderId === undefined || orderId.length === 0 || !isValidObjectId(orderId)) return res.status(400).json({ error: "Invalid order ID" });

    const { customerId, deliveryAddress, quantity, status } = req.body;

    const orderData = await Order.findByIdAndUpdate(orderId, {
      $set: {
        customerId, deliveryAddress, quantity, status
      }
    }, { new: true });
    if (!orderData) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ data: orderData });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
})

// @route   DELETE /api/:orderId
// @desc    Delete an order
// @access  Public
router.delete("/delete/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Check if order id is present and a valid mongodb id
    if (orderId === undefined || orderId.length === 0 || !isValidObjectId(orderId)) return res.status(400).json({ error: "Invalid order ID" });

    const orderData = await Order.findByIdAndDelete(orderId);
    if (!orderData) return res.status(404).json({ error: "Order not found" });

    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
})

router.use("*", (req, res) => res.status(404).send("404 Not Found"))

module.exports = router;