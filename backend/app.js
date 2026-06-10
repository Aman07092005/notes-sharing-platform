require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const shareRoutes = require("./routes/shareRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use( cors({
    origin: "http://localhost:5173",
    credentials: true,
})
);


const dbURL = process.env.ATLASDB_URL;
main()
.then(() => {
    console.log("connection successful");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});