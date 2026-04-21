// -----------------------------------------------------
// LOAD ALL CLASS RECORDS
// -----------------------------------------------------
let classMap = {};
let instructorMap = {};
let customerMap = {};

async function safeJson(res, fallback = []) {
  if (!res.ok) return fallback;
  return res.json();
}

async function loadClassRecords() {
  try {
    const [recordsRes, classesRes, instructorsRes, customersRes] = await Promise.all([
      fetch("/api/classRecord/all"),
      fetch("/api/class/all"),
      fetch("/api/instructor/search?q="),
      fetch("/api/customer/search?q=")
    ]);

    const records = await safeJson(recordsRes, []);
    const classes = await safeJson(classesRes, []);
    const instructors = await safeJson(instructorsRes, []);
    const customers = await safeJson(customersRes, []);

    classMap = {};
    instructorMap = {};
    customerMap = {};

    classes.forEach(c => {
      classMap[c.classId] = c;
    });

    instructors.forEach(i => {
      instructorMap[i.instructorId] = i;
    });

    customers.forEach(c => {
      customerMap[c.customerId] = c;
    });

    renderRecords(records);
  } catch (err) {
    console.error("Failed to load class records:", err);
    const table = document.getElementById("recordsTable");
    table.innerHTML = `
      <tr>
        <td colspan="5">Failed to load class records.</td>
      </tr>
    `;
  }
}


// -----------------------------------------------------
// RENDER TABLE WITH EXPANDABLE ROWS
// -----------------------------------------------------
function renderRecords(records) {
  const table = document.getElementById("recordsTable");
  table.innerHTML = "";

  if (!records || records.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5">No class records found.</td>
      </tr>
    `;
    return;
  }

  records.forEach(record => {
    const cls = classMap[record.classId] || null;
    const inst = instructorMap[record.instructorId] || null;

    const classLabel = cls
      ? `${cls.dayOfWeek} ${cls.time} – ${cls.className}`
      : `${record.classTime || ""} ${record.className || record.classId}`.trim();

    const instructorLabel = inst
      ? `${inst.firstName} ${inst.lastName}`
      : (record.instructorId || "Unknown Instructor");

    const attendeeCount = Array.isArray(record.attendees) ? record.attendees.length : 0;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${record.date || ""}</td>
      <td>${classLabel}</td>
      <td>${instructorLabel}</td>
      <td>${attendeeCount}</td>
      <td><button class="btn btn--small" data-id="${record.recordId}">View</button></td>
    `;

    table.appendChild(row);

    const expandRow = document.createElement("tr");
    expandRow.classList.add("hidden");

    const attendeeList = (record.attendees || [])
      .map(id => {
        const c = customerMap[id];

        if (!c) {
          return `<li>${id}</li>`;
        }

        return `<li>${c.firstName} ${c.lastName} (${c.customerId})</li>`;
      })
      .join("");

    expandRow.innerHTML = `
      <td colspan="5">
        <strong>Attendees:</strong>
        <ul>${attendeeList || "<li>No attendees found</li>"}</ul>
      </td>
    `;

    table.appendChild(expandRow);

    row.querySelector("button").addEventListener("click", () => {
      expandRow.classList.toggle("hidden");
    });
  });
}


// -----------------------------------------------------
// INIT
// -----------------------------------------------------
loadClassRecords();