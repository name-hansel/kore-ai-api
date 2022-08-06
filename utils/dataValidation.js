const { isValidObjectId } = require("mongoose");

// Can use express-validator package instead

const orderValidation = (req, res, next) => {
  const { customerId, deliveryAddress, quantity, status } = req.body;
  const errors = [];

  if (!customerId || customerId.length === 0) errors.push("Invalid customer ID");
  // if (!customerId || customerId.length === 0 || !isValidObjectId(customerId)) errors.push("Invalid customer ID");

  if (!deliveryAddress) errors.push("Delivery address required");

  if (deliveryAddress && (!deliveryAddress.address || deliveryAddress.address.length === 0)) errors.push("Address required");

  if (deliveryAddress && (!deliveryAddress.city || deliveryAddress.city.length === 0)) errors.push("City required");

  if (deliveryAddress && (!deliveryAddress.state || deliveryAddress.state.length === 0)) errors.push("State required");

  // Check that state belongs to enum

  if (deliveryAddress && (deliveryAddress.pincode === undefined || !Number.isInteger(Number(deliveryAddress.pincode)) || Number(deliveryAddress.pincode) < 0)) errors.push("Invalid pincode");

  if (quantity === undefined || quantity < 0) errors.push("Invalid quantity");

  // If status is given in request body, validate it
  // Or default value of "placed" is used in DB
  if (status && (status.length === 0 || !["placed", "packed", "dispatched", "delivered"].includes(status))) errors.push("Invalid status");

  if (errors.length > 0) return res.status(400).json({ errors });
  else next();
}

const editValidation = (req, res, next) => {
  const { deliveryAddress, quantity, status } = req.body;
  const errors = [];

  if (!deliveryAddress) errors.push("Delivery address required");

  if (deliveryAddress && (!deliveryAddress.address || deliveryAddress.address.length === 0)) errors.push("Address required");

  if (deliveryAddress && (!deliveryAddress.city || deliveryAddress.city.length === 0)) errors.push("City required");

  if (deliveryAddress && (!deliveryAddress.state || deliveryAddress.state.length === 0)) errors.push("State required");

  // Check that state belongs to enum

  if (deliveryAddress && (deliveryAddress.pincode === undefined || !Number.isInteger(Number(deliveryAddress.pincode)) || Number(deliveryAddress.pincode) < 0)) errors.push("Invalid pincode");

  if (quantity === undefined || quantity < 0) errors.push("Invalid quantity");

  // If status is given in request body, validate it
  // Or default value of "placed" is used in DB
  if (status && (status.length === 0 || !["placed", "packed", "dispatched", "delivered"].includes(status))) errors.push("Invalid status");

  if (errors.length > 0) return res.status(400).json({ errors });
  else next();
}

module.exports = { orderValidation, editValidation }