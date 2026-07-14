require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require('./routes/groupRoutes')
const { groupExpenseRouter, expenseRouter } = require('./routes/expenseRoutes');
const friendRoutes = require('./routes/friendRoutes');

connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bill Splitter API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/groups/:id/expenses", groupExpenseRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/friends", friendRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});