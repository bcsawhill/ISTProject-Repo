const ClassRecord = require("../models/classRecordModel.cjs");
const Customer = require("../models/customerModel.cjs");
const {
  syncCustomerPackageStatus,
  isStillActive,
} = require("../utils/packageStatus.cjs");

function getRole(req) {
  return req.session?.user?.role || null;
}

function canSubmitCheckin(role) {
  return ["admin", "staff", "instructor", "member"].includes(role);
}

exports.getAll = async (req, res) => {
  const records = await ClassRecord.find({});
  res.json(records);
};

exports.getNextId = async (req, res) => {
  const last = await ClassRecord.find({}).sort({ recordId: -1 }).limit(1);
  let next = 1;

  if (last.length > 0) {
    const match = last[0].recordId.match(/\d+$/);
    if (match) next = parseInt(match[0], 10) + 1;
  }

  const recordId = `R${String(next).padStart(3, "0")}`;
  res.json({ recordId });
};

exports.add = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canSubmitCheckin(role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { recordId, classId, instructorId, date, attendees = [] } = req.body;
    const uniqueAttendees = [...new Set(attendees)];

    if (!recordId || !classId || !instructorId || !date || uniqueAttendees.length === 0) {
      return res.status(400).json({ message: "Missing class record fields" });
    }

    if (
      role === "member" &&
      (uniqueAttendees.length !== 1 || uniqueAttendees[0] !== req.session.user.customerId)
    ) {
      return res.status(403).json({ message: "Members can only check in themselves" });
    }

    const customers = await Customer.find({
      customerId: { $in: uniqueAttendees },
    });

    if (customers.length !== uniqueAttendees.length) {
      const found = new Set(customers.map((c) => c.customerId));
      const missing = uniqueAttendees.filter((id) => !found.has(id));
      return res.status(400).json({
        message: `Customer not found: ${missing.join(", ")}`,
      });
    }

    const recordDate = new Date(`${date}T12:00:00`);
    const byId = new Map(customers.map((c) => [c.customerId, c]));
    const invalidCustomers = [];

    for (const customerId of uniqueAttendees) {
      const customer = byId.get(customerId);

      syncCustomerPackageStatus(customer, recordDate);

      const hasUnlimited =
        customer.unlimitedActive && isStillActive(customer.unlimitedExpires, recordDate);

      const hasClassPackage =
        (customer.classBalance || 0) > 0 &&
        (!customer.packageExpires || isStillActive(customer.packageExpires, recordDate));

      if (hasUnlimited) {
        continue;
      }

      if (hasClassPackage) {
        customer.classBalance -= 1;
        continue;
      }

      invalidCustomers.push(customerId);
    }

    if (invalidCustomers.length > 0) {
      return res.status(400).json({
        message: `No valid package or class balance for: ${invalidCustomers.join(", ")}`,
      });
    }

    await Promise.all(customers.map((customer) => customer.save()));

    const newRecord = new ClassRecord({
      recordId,
      classId,
      instructorId,
      date,
      attendees: uniqueAttendees,
    });

    await newRecord.save();

    res.json({
      message: "Class record saved",
      record: newRecord,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to save record", error: err.message });
  }
};