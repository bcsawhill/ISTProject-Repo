const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const packageSaleSchema = new mongoose.Schema(
  {
    saleId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    packageId: { type: String, required: true },

    packageName: { type: String, required: true },
    classCount: { type: Number, default: 0 },
    isUnlimited: { type: Boolean, default: false },

    date: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
    pricePaid: { type: Number, required: true },
  },
  { collection: "packageSales" }
);

module.exports = mongoose.model("PackageSale", packageSaleSchema);