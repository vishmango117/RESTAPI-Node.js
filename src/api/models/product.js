const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    // Add properties to price to make sure price is required.
    price: { type: Number, required: true },
    productImage: { type: String, required: true },

    //if your backend takes two values and send a third the third value is not taken in as the backend only accepts the value you configured for.
});
// Export as a Model
module.exports = mongoose.model("Product", productSchema);
