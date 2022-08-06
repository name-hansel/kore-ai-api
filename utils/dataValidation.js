const { isValidObjectId } = require("mongoose");

// Can use express-validator package instead

const orderValidation = (req, res, next) => {
  const { customerId, deliveryAddress, quantity, status } = req.body;
  const errors = [];

  if (!customerId || customerId.length === 0) errors.push("Invalid customer ID");

  if (!deliveryAddress) errors.push("Delivery address required");

  // If deliveryAddress is present in the req.body, check its components
  if (deliveryAddress && (!deliveryAddress.address || deliveryAddress.address.length === 0)) errors.push("Address required");

  if (deliveryAddress && (!deliveryAddress.city || deliveryAddress.city.length === 0)) errors.push("City required");

  // TODO check if state belongs to enum
  if (deliveryAddress && (!deliveryAddress.state || deliveryAddress.state.length === 0)) errors.push("State required");

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

const dateValidation = (req, res, next) => {
  // Format of date is dd-mm-yyyy
  const { date } = req.params;

  // If date is not passed
  if (!date || date.length === 0) return res.status(400).json({ error: "Date is required" });

  // Minimum length of date should be 8 and max should be 10
  // It should match the pattern of dd-mm-yyyy (single digit days and months also work)
  if (date.length < 8 || date.length > 10 || !date.match(/[0-9]{1,2}[-]{1}[0-9]{1,2}[-]{1}[0-9]{4}/)) return res.status(400).json({ error: "Invalid date" });

  // The date format is valid
  // We split the date into day, month and year components
  // Convert to the format of mm/dd/yyyy
  const dateArray = date.split("-");
  const day = dateArray[0];
  const month = dateArray[1];
  const year = dateArray[2];
  const formattedDate = `${month}/${day}/${year}`;

  // Check if formatted date is valid
  if (isNaN(Date.parse(formattedDate))) return res.status(400).json({ error: "Invalid date" });

  // The formatted date is valid, set it in the request object and return to the main function
  req.formattedDate = formattedDate;
  next();
}

module.exports = { orderValidation, editValidation, dateValidation }