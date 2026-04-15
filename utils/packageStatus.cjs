function endOfDay(value) {
  const d = new Date(value);
  d.setHours(23, 59, 59, 999);
  return d;
}

function isStillActive(expiresAt, now = new Date()) {
  if (!expiresAt) return false;
  return now <= endOfDay(expiresAt);
}

function syncCustomerPackageStatus(customer, now = new Date()) {
  let changed = false;

  if (customer.packageExpires && !isStillActive(customer.packageExpires, now)) {
    if ((customer.classBalance || 0) !== 0) {
      customer.classBalance = 0;
      changed = true;
    }
    customer.packageExpires = null;
    changed = true;
  }

  if (customer.unlimitedExpires && !isStillActive(customer.unlimitedExpires, now)) {
    if (customer.unlimitedActive) {
      customer.unlimitedActive = false;
      changed = true;
    }
    customer.unlimitedExpires = null;
    changed = true;
  }

  return changed;
}

function getNextMonthSameDate(startDate = new Date()) {
  const original = new Date(startDate);
  const day = original.getDate();

  const result = new Date(original);
  result.setHours(0, 0, 0, 0);
  result.setDate(1);
  result.setMonth(result.getMonth() + 1);

  const lastDayOfTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(Math.min(day, lastDayOfTargetMonth));
  return result;
}

module.exports = {
  endOfDay,
  isStillActive,
  syncCustomerPackageStatus,
  getNextMonthSameDate,
};