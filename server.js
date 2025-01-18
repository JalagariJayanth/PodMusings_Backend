require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptios = require("./config/corsOptions")
const connectDB = require("./config/dbConnection")
const PORT = process.env.PORT;

const authRoutes = require("./routes/auth");
const podcastRoutes = require("./routes/podcast")
const { errorHandler } = require("./error");

app.use(express.json());
app.use(cors(corsOptios))

connectDB();


app.use("/auth",authRoutes)
app.use("/podcast",podcastRoutes)


app.use(errorHandler)
app.listen(PORT,() => {
    console.log(`Server running at ${PORT}`)
})