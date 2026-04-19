const Package = require("../models/packageModel.cjs");
const PackageSale = require("../models/packageSaleModel.cjs");
const Customer = require("../models/customerModel.cjs");
const {
  syncCustomerPackageStatus,
  getNextMonthSameDate,
} = require("../utils/packageStatus.cjs");

function getRole(req) {
  return req.session?.user?.role || null;
}

function canSellPackages(role) {
  return ["admin", "staff", "instructor"].includes(role);
}

function canManagePackageCatalog(role) {
  return role === "admin";
}

function canViewAllSales(role) {
  return ["admin", "staff"].includes(role);
}

exports.getAllPackages = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canSellPackages(role) && role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const packages = await Package.find({});
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load packages", error: err.message });
  }
};

exports.addPackage = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canManagePackageCatalog(role)) {
      return res.status(403).json({ message: "Admins only" });
    }

    const { packageId, packageName, description, price, classCount, isUnlimited } = req.body;

    const pkg = new Package({
      packageId,
      packageName,
      description,
      price,
      classCount,
      isUnlimited,
    });

    await pkg.save();
    res.status(201).json({ message: "Package added", pkg });
  } catch (err) {
    res.status(500).json({ message: "Failed to add package", error: err.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canManagePackageCatalog(role)) {
      return res.status(403).json({ message: "Admins only" });
    }

    const { packageName, description, price, classCount, isUnlimited } = req.body;

    const updated = await Package.findOneAndUpdate(
      { packageId: req.params.packageId },
      { packageName, description, price, classCount, isUnlimited },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ message: "Package updated", pkg: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update package", error: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canManagePackageCatalog(role)) {
      return res.status(403).json({ message: "Admins only" });
    }

    const deleted = await Package.findOneAndDelete({ packageId: req.params.packageId });

    if (!deleted) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ message: "Package deleted", pkg: deleted });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete package", error: err.message });
  }
};

exports.recordSale = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canSellPackages(role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { customerId, packageId } = req.body;

    const pkg = await Package.findOne({ packageId });
    const customer = await Customer.findOne({ customerId });

    if (!pkg || !customer) {
      return res.status(400).json({ message: "Invalid customer or package" });
    }

    const soldAt = new Date();
    const expiresAt = getNextMonthSameDate(soldAt);

    syncCustomerPackageStatus(customer, soldAt);

    if (pkg.isUnlimited) {
      customer.unlimitedActive = true;
      customer.unlimitedExpires = expiresAt;
    } else {
      customer.classBalance = (customer.classBalance || 0) + pkg.classCount;
      customer.packageExpires = expiresAt;
    }

    await customer.save();

    const count = await PackageSale.countDocuments();
    const saleId = `T${String(count + 1).padStart(3, "0")}`;

    const sale = new PackageSale({
      saleId,
      customerId,
      packageId,
      packageName: pkg.packageName,
      classCount: pkg.classCount,
      isUnlimited: pkg.isUnlimited,
      date: soldAt,
      expiresAt,
      pricePaid: pkg.price,
    });

    await sale.save();

    res.json({
      message: "Package sale recorded successfully",
      sale,
    });
  } catch (err) {
    res.status(500).json({ message: "Error recording sale", error: err.message });
  }
};

exports.getSales = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canViewAllSales(role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const sales = await PackageSale.find({}).sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: "Failed to load sales", error: err.message });
  }
};

exports.getSalesByCustomer = async (req, res) => {
  try {
    const role = getRole(req);

    if (!role) {
      return res.status(401).json({ message: "Not logged in" });
    }

    if (role === "member" && req.params.customerId !== req.session.user.customerId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const sales = await PackageSale.find({
      customerId: req.params.customerId,
    }).sort({ date: -1 });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: "Failed to load purchase history", error: err.message });
  }
};