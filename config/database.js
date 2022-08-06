const mongoose = require("mongoose")

const connectToDatabase = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.o2jpvo2.mongodb.net/?retryWrites=true&w=majority`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectToDatabase