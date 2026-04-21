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

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function getNextRecordIdValue() {
  const last = await ClassRecord.find({}).sort({ recordId: -1 }).limit(1);
  let next = 1;

  if (last.length > 0) {
    const match = last[0].recordId.match(/\d+$/);
    if (match) next = parseInt(match[0], 10) + 1;
  }

  return `R${String(next).padStart(3, "0")}`;
}

async function buildAttendeeDetails(attendeeIds = []) {
  if (!attendeeIds.length) return [];

  const customers = await Customer.find(
    { customerId: { $in: attendeeIds } },
    "customerId firstName lastName"
  ).lean();

  const byId = new Map(customers.map((c) => [c.customerId, c]));

  return attendeeIds.map((id) => {
    const customer = byId.get(id);
    return customer || {
      customerId: id,
      firstName: id,
      lastName: ""
    };
  });
}

exports.getAll = async (req, res) => {
  try {
    const records = await ClassRecord.find({}).sort({ date: -1, classTime: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to load class records", error: err.message });
  }
};

exports.getNextId = async (req, res) => {
  try {
    const recordId = await getNextRecordIdValue();
    res.json({ recordId });
  } catch (err) {
    res.status(500).json({ message: "Failed to get next record id", error: err.message });
  }
};

exports.getTodayByClass = async (req, res) => {
  try {
    const date = getTodayString();

    const record = await ClassRecord.findOne({
      classId: req.params.classId,
      date
    }).lean();

    if (!record) {
      return res.json(null);
    }

    const attendeeDetails = await buildAttendeeDetails(record.attendees || []);

    res.json({
      ...record,
      attendeeDetails
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load today's class record", error: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const role = getRole(req);
    if (!canSubmitCheckin(role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const {
      classId,
      className = "",
      classTime = "",
      instructorId,
      attendees = []
    } = req.body;

    const uniqueRequestedAttendees = [...new Set(attendees)];

    if (!classId || !instructorId || uniqueRequestedAttendees.length === 0) {
      return res.status(400).json({ message: "Missing class record fields" });
    }

    if (
      role === "member" &&
      (uniqueRequestedAttendees.length !== 1 ||
        uniqueRequestedAttendees[0] !== req.session.user.customerId)
    ) {
      return res.status(403).json({ message: "Members can only check in themselves" });
    }

    const date = getTodayString();

    let existingRecord = await ClassRecord.findOne({ classId, date });

    const existingAttendeeIds = new Set(existingRecord?.attendees || []);
    const newAttendeeIds = uniqueRequestedAttendees.filter(
      (id) => !existingAttendeeIds.has(id)
    );

    if (existingRecord && newAttendeeIds.length === 0) {
      const attendeeDetails = await buildAttendeeDetails(existingRecord.attendees || []);
      return res.json({
        message: "All selected customers are already checked in for this class today.",
        record: {
          ...existingRecord.toObject(),
          attendeeDetails
        }
      });
    }

    const customers = await Customer.find({
      customerId: { $in: newAttendeeIds },
    });

    if (customers.length !== newAttendeeIds.length) {
      const found = new Set(customers.map((c) => c.customerId));
      const missing = newAttendeeIds.filter((id) => !found.has(id));
      return res.status(400).json({
        message: `Customer not found: ${missing.join(", ")}`,
      });
    }

    const recordDate = new Date(`${date}T12:00:00`);
    const byId = new Map(customers.map((c) => [c.customerId, c]));
    const noPackageAttendees = [];

    for (const customerId of newAttendeeIds) {
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

      // Still allow check-in, just flag them
      noPackageAttendees.push(customerId);
    }

    await Promise.all(customers.map((customer) => customer.save()));

    let record;
    let message;

    if (existingRecord) {
      existingRecord.instructorId = instructorId;
      existingRecord.className = className || existingRecord.className;
      existingRecord.classTime = classTime || existingRecord.classTime;
      existingRecord.attendees.push(...newAttendeeIds);
      existingRecord.noPackageAttendees = [
        ...new Set([...(existingRecord.noPackageAttendees || []), ...noPackageAttendees])
      ];

      record = await existingRecord.save();
      message = "Check-ins added to the existing class session for today.";
    } else {
      const recordId = await getNextRecordIdValue();

      record = await new ClassRecord({
        recordId,
        classId,
        className,
        classTime,
        instructorId,
        date,
        attendees: uniqueRequestedAttendees,
        noPackageAttendees
      }).save();

      message = "New class session created and check-ins saved.";
    }

    if (noPackageAttendees.length > 0) {
      message += ` Warning: No valid package or class balance for: ${noPackageAttendees.join(", ")}.`;
    }

    const attendeeDetails = await buildAttendeeDetails(record.attendees || []);

    res.json({
      message,
      record: {
        ...record.toObject(),
        attendeeDetails
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to save record", error: err.message });
  }
};