const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");


dotenv.config();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma",
    ],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

connectDB();

app.get("/test", (req, res) => {
    res.status(200).json({
        message: "Hello World"
    })
})

app.use("/api/users", require("./api/users/router"));
app.use("/api/categories", require("./api/categories/router"));
app.use("/api/products", require("./api/products/router"));
app.use("/api/orders", require("./api/orders/router"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})