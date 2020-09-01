const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    //ITEM 1
    product: {
        type: mongoose.Schema.Types.ObjectId,
        // We want to associate the order schema with the Product schema
        ref: "Product",
        required: true,
    },
    // Add properties to quantity to make sure price is required and of default value 1.
    quantity: { type: Number, default: 1 },

    //if your backend takes two values and send a third the third value is not taken in as the backend only accepts the value you configured for.
});
// Export as a Model
module.exports = mongoose.model("Order", orderSchema);
