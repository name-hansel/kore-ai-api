const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Can be reference to existing collection in db
  customerId: {
    type: String,
    required: true
  }, deliveryAddress: {
    address: {
      type: String,
      required: true
    }, city: {
      type: String,
      required: true
    }, state: {
      type: String,
      required: true,
      // Can contain more states
      enum: ["Maharashtra", "Andhra Pradesh", "Karnataka"]
    }, pincode: {
      type: String,
      required: true,
    }
  }, quantity: {
    // in milliliters
    type: Number,
    required: true
  }, status: {
    type: String,
    required: true,
    enum: ["placed", "packed", "dispatched", "delivered"],
    default: "placed"
  }, orderedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);