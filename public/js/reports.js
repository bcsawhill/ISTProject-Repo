function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDateInputValue(date) {
  return date.toISOString().split("T")[0];
}

function parseReportDate(dateValue) {
  if (!dateValue) return null;

  const stringValue = String(dateValue);

  // For class records stored like YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
    return new Date(`${stringValue}T12:00:00`);
  }

  // For Mongo Date values / ISO strings
  const parsed = new Date(stringValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function isDateInRange(dateValue, start, end) {
  const value = parseReportDate(dateValue);
  if (!value) return false;
  return value >= start && value <= end;
}

function getTypeText(sale) {
  return sale.isUnlimited ? "Unlimited" : `${sale.classCount || 0} Classes`;
}

async function ensureAdmin() {
  const res = await fetch("/api/me");
  if (!res.ok) {
    window.location.href = "/index.html";
    return null;
  }

  const user = await res.json();
  if (user.role !== "admin") {
    window.location.href = "/htmls/dashboard.html";
    return null;
  }

  return user;
}

function setDefaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);

  document.getElementById("startDate").value = formatDateInputValue(start);
  document.getElementById("endDate").value = formatDateInputValue(end);
}

function renderRevenueTable(rows) {
  const tbody = document.querySelector("#revenueTable tbody");
  tbody.innerHTML = "";

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No sales found for this date range.</td></tr>`;
    return;
  }

  rows.forEach((sale) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sale.saleId}</td>
      <td>${new Date(sale.date).toLocaleDateString()}</td>
      <td>${sale.customerId}</td>
      <td>${sale.packageName || sale.packageId} (${getTypeText(sale)})</td>
      <td>${formatCurrency(sale.pricePaid)}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderAttendanceTable(rows) {
  const tbody = document.querySelector("#attendanceTable tbody");
  tbody.innerHTML = "";

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No attendance records found for this date range.</td></tr>`;
    return;
  }

  rows.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.date}</td>
      <td>${(record.classTime || "").trim()} ${(record.className || record.classId || "").trim()}</td>
      <td>${record.instructorId}</td>
      <td>${(record.attendees || []).length}</td>
      <td>${(record.noPackageAttendees || []).length}</td>
    `;
    tbody.appendChild(row);
  });
}

async function loadReports() {
  const startValue = document.getElementById("startDate").value;
  const endValue = document.getElementById("endDate").value;

  if (!startValue || !endValue) {
    alert("Please select both a start date and an end date.");
    return;
  }

  const start = new Date(`${startValue}T00:00:00`);
  const end = new Date(`${endValue}T23:59:59`);

  const [salesRes, recordsRes, customersRes] = await Promise.all([
    fetch("/api/package/sales"),
    fetch("/api/classRecord/all"),
    fetch("/api/customer/search?q=")
  ]);

  if (!salesRes.ok || !recordsRes.ok || !customersRes.ok) {
    alert("Failed to load report data.");
    return;
  }

  const sales = await salesRes.json();
  const records = await recordsRes.json();
  const customers = await customersRes.json();

  const filteredSales = sales.filter((sale) => isDateInRange(sale.date, start, end));
  const filteredRecords = records.filter((record) => isDateInRange(record.date, start, end));

  const revenueTotal = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.pricePaid || 0),
    0
  );

  const attendanceTotal = filteredRecords.reduce(
    (sum, record) => sum + (record.attendees || []).length,
    0
  );

  const unusedBalanceTotal = customers.reduce(
    (sum, customer) => sum + Number(customer.classBalance || 0),
    0
  );

  const attendanceSoldTotal = sales.reduce((sum, sale) => {
    if (sale.isUnlimited) return sum;
    return sum + Number(sale.classCount || 0);
  }, 0);

  document.getElementById("revenueTotal").textContent = formatCurrency(revenueTotal);
  document.getElementById("attendanceTotal").textContent = String(attendanceTotal);
  document.getElementById("unusedBalanceTotal").textContent = String(unusedBalanceTotal);
  document.getElementById("attendanceSoldTotal").textContent = String(attendanceSoldTotal);

  renderRevenueTable(filteredSales);
  renderAttendanceTable(filteredRecords);
}

(async function initReportsPage() {
  const user = await ensureAdmin();
  if (!user) return;

  setDefaultDateRange();
  document.getElementById("runReportsBtn").addEventListener("click", loadReports);
  await loadReports();
})();