const express = require("express");
const connectDB = require("./config/db");
const app = express();

const userRouter = require("./routes/api/users");

// Connect to Database
connectDB();


//  Init Middleware
app.use(express.json({ extended: false }));

// Define Routes

app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`connected to the server successfully... ${PORT}`);
});
