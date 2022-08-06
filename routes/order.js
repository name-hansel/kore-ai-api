const express = require('express');
const router = express.Router();
const { isValidObjectId } = require("mongoose");

const Order = require('../models/Order');
const { orderValidation, editValidation, dateValidation } = require("../utils/dataValidation")

// @route   GET /api/checkCapacity/:date
// @desc    Return left milk for the day
// @access  Public
router.get("/checkCapacity/:date", dateValidation, async (req, res) => {
  try {
    // dateValidation sets req.formattedDate in "mm/dd/yyyy" format
    // We get date in the format "dd/mm/yyyy" in query parameters

    // We set a queryDate equal to the date for which we have to check the milk left
    // nextDate is the day after queryDate
    const queryDate = new Date(req.formattedDate), nextDate = new Date(req.formattedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Find orders which lie between queryDate and nextDate
    // Select only the ordered quantity
    const orderedMilkData = await Order.find({
      orderedAt: {
        $gte: queryDate,
        $lt: nextDate
      }
    }).select("quantity -_id");

    // We get an array of objects from the query above
    // Sum all of the quantities
    var orderedMilk = 0;
    orderedMilkData.forEach((data) => orderedMilk += data.quantity);

    // Subtract total ordered milk quantity from the max capacity
    // Max capacity is currently defined in environment variables but can also be saved in database
    const maxCapacity = process.env.MAX_CAPACITY;

    // Return the milk day for the queried date
    res.status(200).json({
      data: {
        milkLeft: maxCapacity - orderedMilk
      }
    })
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
})

// @route   GET /api/:orderId
// @desc    Get order by id
// @access  Public
router.get("/order/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Check if order id is present and a valid mongodb id
    if (orderId === undefined || orderId.length === 0 || !isValidObjectId(orderId)) return res.status(400).json({ error: "Invalid order ID" });

    const orderData = await Order.findById(orderId);
    // orderData is null => order having _id == orderId is not present in the database
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

    // Save the document and get the newly saved document to return
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

    // Status should belong to enum values
    const { status } = req.body;
    if (!status || status.length === 0 || !["placed", "packed", "dispatched", "delivered"].includes(status)) return res.status(400).json({ error: "Invalid order status" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Update order status value
    order.status = status;
    // Save order document and return newly updated document
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

    // Set the fields passed in the request body and return the updated document
    const orderData = await Order.findByIdAndUpdate(orderId, {
      $set: {
        customerId, deliveryAddress, quantity, status
      }
    }, { new: true });
    // If orderData is null, that means order with _id == orderId is not present in the database
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