const Customer = require("../models/customerModel.cjs");
const { syncCustomerPackageStatus } = require("../utils/packageStatus.cjs");

function getRole(req) {
  return req.session?.user?.role || null;
}

function isLoggedIn(req) {
  return !!req.session?.user;
}

function canManageCustomers(role) {
  return ["admin", "staff", "instructor"].includes(role);
}

async function syncAndSave(customer) {
  if (customer && syncCustomerPackageStatus(customer)) {
    await customer.save();
  }
  return customer;
}

exports.add = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canManageCustomers(role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const {
      customerId,
      firstName,
      lastName,
      email,
      phone,
      address,
      classBalance,
      senior,
    } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCustomer = new Customer({
      customerId,
      firstName,
      lastName,
      email,
      phone,
      address,
      classBalance,
      senior,
    });

    await newCustomer.save();
    res.status(201).json({
      message: "Customer added successfully",
      customer: newCustomer,
    });
  } catch (err) {
    console.error("Error adding customer:", err.message);
    res.status(500).json({ message: "Failed to add customer", error: err.message });
  }
};

exports.getNextId = async (req, res) => {
  try {
    const lastCustomer = await Customer.find({}).sort({ customerId: -1 }).limit(1);

    let maxNumber = 1;
    if (lastCustomer.length > 0) {
      const lastId = lastCustomer[0].customerId;
      const match = lastId.match(/\d+$/);
      if (match) {
        maxNumber = parseInt(match[0], 10) + 1;
      }
    }

    const nextId = `Y${String(maxNumber).padStart(3, "0")}`;
    res.json({ nextId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.search = async (req, res) => {
  try {
    if (!isLoggedIn(req)) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const role = getRole(req);

    if (role === "member") {
      const me = await Customer.findOne({ customerId: req.session.user.customerId });
      await syncAndSave(me);
      return res.json(me ? [me] : []);
    }

    const q = req.query.q || "";
    const regex = new RegExp(q, "i");

    const results = await Customer.find({
      $or: [
        { customerId: regex },
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
      ],
    });

    await Promise.all(results.map(syncAndSave));
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to search customers", error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    if (!isLoggedIn(req)) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const role = getRole(req);
    const requestedId = req.params.customerId;

    if (role === "member" && requestedId !== req.session.user.customerId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const customer = await Customer.findOne({ customerId: requestedId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await syncAndSave(customer);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Failed to load customer", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canManageCustomers(role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await Customer.findOneAndUpdate(
      { customerId: req.params.customerId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await syncAndSave(updated);
    res.json({ message: "Updated", customer: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update customer", error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const deleted = await Customer.findOneAndDelete({
      customerId: req.params.customerId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted", customer: deleted });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete customer", error: err.message });
  }
};