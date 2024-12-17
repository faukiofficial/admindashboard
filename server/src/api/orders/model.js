const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);