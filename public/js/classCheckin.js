let selectedClass = null;
let selectedInstructor = null;
let currentRecord = null;
let attendees = [];
let currentUser = null;

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function parseTimeLabelToMinutes(label) {
  const match = String(label).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return Number.POSITIVE_INFINITY;

  let hour = parseInt(match[1], 10);
  const minutes = parseInt(match[2] || "0", 10);
  const period = match[3].toUpperCase();

  if (period === "AM" && hour === 12) hour = 0;
  if (period === "PM" && hour !== 12) hour += 12;

  return hour * 60 + minutes;
}

function getTodayName() {
  return DAYS[new Date().getDay()];
}

function getTodayDisplay() {
  return new Date().toLocaleDateString();
}

function findAvailableClass(classes) {
  const now = new Date();
  const today = getTodayName();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const earliestAllowedStart = nowMinutes - 180;
  const latestAllowedStart = nowMinutes + 60;

  const todaysClasses = classes
    .filter((cls) => cls.dayOfWeek === today)
    .map((cls) => ({
      ...cls,
      startMinutes: parseTimeLabelToMinutes(cls.time),
    }))
    .filter(
      (cls) =>
        Number.isFinite(cls.startMinutes) &&
        cls.startMinutes >= earliestAllowedStart &&
        cls.startMinutes <= latestAllowedStart
    )
    .sort((a, b) => Math.abs(a.startMinutes - nowMinutes) - Math.abs(b.startMinutes - nowMinutes));

  return todaysClasses[0] || null;
}

function getTodaysClasses(classes) {
  const today = getTodayName();

  return classes
    .filter((cls) => cls.dayOfWeek === today)
    .slice()
    .sort((a, b) => parseTimeLabelToMinutes(a.time) - parseTimeLabelToMinutes(b.time));
}

async function loadCurrentUser() {
  try {
    const res = await fetch("/api/me");
    if (!res.ok) {
      window.location.href = "/index.html";
      return;
    }
    currentUser = await res.json();
  } catch (err) {
    window.location.href = "/index.html";
  }
}

async function fetchAllClasses() {
  const res = await fetch("/api/class/all");
  return res.json();
}

async function fetchInstructorById(instructorId) {
  try {
    const res = await fetch(`/api/instructor/${instructorId}`);
    if (!res.ok) {
      return { instructorId };
    }
    return await res.json();
  } catch (err) {
    return { instructorId };
  }
}

async function fetchTodayRecordByClass(classId) {
  const res = await fetch(`/api/classRecord/today/${classId}`);
  if (!res.ok) {
    throw new Error("Could not load today's class record.");
  }
  return res.json();
}

async function loadClassesForDropdown(classes) {
  const select = document.getElementById("select_class");
  select.innerHTML = "";

  const todaysClasses = getTodaysClasses(classes);

  if (todaysClasses.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No classes scheduled for today";
    select.appendChild(opt);
    return;
  }

  todaysClasses.forEach((cls) => {
    const opt = document.createElement("option");
    opt.value = cls.classId;
    opt.textContent = `${cls.className}`;
    select.appendChild(opt);
  });
}

function renderCheckinHeader() {
  document.getElementById("checkinTitle").textContent =
    `${selectedClass.className} — ${getTodayDisplay()}`;

  document.getElementById("checkinInstructor").textContent =
    `Instructor: ${
      selectedInstructor?.firstName
        ? `${selectedInstructor.firstName} ${selectedInstructor.lastName}`
        : selectedClass.instructorId
    }`;
}

function clearSearchBox() {
  const input = document.getElementById("customerSearch");
  const results = document.getElementById("customerResults");

  input.value = "";
  results.innerHTML = "";
  results.classList.add("hidden");
}

async function loadExistingSession() {
  currentRecord = await fetchTodayRecordByClass(selectedClass.classId);

  if (currentRecord?.attendeeDetails?.length) {
    attendees = currentRecord.attendeeDetails.map((customer) => ({
      customerId: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
    }));
  } else {
    attendees = [];
  }

  renderAttendees();
}

async function setupMemberSelfCheckin() {
  const searchInput = document.getElementById("customerSearch");
  const resultsBox = document.getElementById("customerResults");

  if (!currentUser || currentUser.role !== "member") {
    searchInput.value = "";
    searchInput.readOnly = false;
    searchInput.disabled = false;
    searchInput.placeholder = "Type to search...";
    resultsBox.classList.add("hidden");
    return;
  }

  searchInput.value = currentUser.customerId || "";
  searchInput.readOnly = true;
  searchInput.disabled = true;
  searchInput.placeholder = "You are checking in to the current available class";
  resultsBox.classList.add("hidden");
  resultsBox.innerHTML = "";

  try {
    const res = await fetch(`/api/customer/${currentUser.customerId}`);
    if (!res.ok) {
      alert("Could not load your customer profile.");
      return;
    }

    const me = await res.json();
    addAttendee(me);
  } catch (err) {
    alert("Could not load your customer profile.");
  }
}

function openCheckinScreen() {
  renderCheckinHeader();
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("checkinScreen").classList.remove("hidden");
  document.getElementById("selectModal").classList.add("hidden");
}

function resetCheckinScreen() {
  attendees = [];
  selectedClass = null;
  selectedInstructor = null;
  currentRecord = null;

  const input = document.getElementById("customerSearch");
  input.value = "";
  input.readOnly = false;
  input.disabled = false;
  input.placeholder = "Type to search...";

  document.getElementById("attendeeList").innerHTML = "";
  document.getElementById("checkinScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}

document.getElementById("startCheckinBtn").addEventListener("click", async () => {
  attendees = [];
  selectedClass = null;
  selectedInstructor = null;
  currentRecord = null;

  const classes = await fetchAllClasses();

  if (currentUser?.role === "member") {
    const availableClass = findAvailableClass(classes);

    if (!availableClass) {
      alert("No class is currently available for customer self check-in.");
      return;
    }

    selectedClass = availableClass;
    selectedInstructor = await fetchInstructorById(selectedClass.instructorId);

    openCheckinScreen();
    await loadExistingSession();
    await setupMemberSelfCheckin();
    return;
  }

  await loadClassesForDropdown(classes);
  document.getElementById("selectModal").classList.remove("hidden");
});

document.getElementById("continueBtn").addEventListener("click", async () => {
  const classId = document.getElementById("select_class").value;

  if (!classId) {
    alert("Please select a class.");
    return;
  }

  const res = await fetch(`/api/class/${classId}`);
  selectedClass = await res.json();
  selectedInstructor = await fetchInstructorById(selectedClass.instructorId);

  openCheckinScreen();
  await loadExistingSession();
  await setupMemberSelfCheckin();
});

async function searchCustomers(query) {
  const box = document.getElementById("customerResults");

  if (currentUser && currentUser.role === "member") {
    box.classList.add("hidden");
    return;
  }

  if (!query || query.trim() === "") {
    box.classList.add("hidden");
    return;
  }

  const res = await fetch(`/api/customer/search?q=${encodeURIComponent(query)}`);
  const results = await res.json();

  box.innerHTML = "";

  if (results.length === 0) {
    box.innerHTML = "<div>No results</div>";
  } else {
    results.forEach((customer) => {
      const div = document.createElement("div");
      div.textContent = `${customer.firstName} ${customer.lastName} (${customer.customerId})`;

      div.addEventListener("click", () => {
        addAttendee(customer);
        clearSearchBox();
      });

      box.appendChild(div);
    });
  }

  box.classList.remove("hidden");
}

document.getElementById("customerSearch").addEventListener("input", (e) => {
  searchCustomers(e.target.value);
});

document.addEventListener("click", (e) => {
  const box = document.getElementById("customerResults");
  const input = document.getElementById("customerSearch");

  if (!box.contains(e.target) && e.target !== input) {
    box.classList.add("hidden");
  }
});

function addAttendee(customer) {
  if (currentUser && currentUser.role === "member" && customer.customerId !== currentUser.customerId) {
    alert("Members can only check in themselves.");
    return;
  }

  if (attendees.some((a) => a.customerId === customer.customerId)) {
    return;
  }

  attendees.push(customer);
  renderAttendees();
}

function renderAttendees() {
  const list = document.getElementById("attendeeList");
  list.innerHTML = "";

  attendees.forEach((customer) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.style.gap = "10px";
    li.style.marginBottom = "8px";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${customer.firstName} ${customer.lastName} (${customer.customerId})`;
    nameSpan.style.flex = "1";

    li.appendChild(nameSpan);

    if (!currentUser || currentUser.role !== "member") {
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "btn btn--danger btn--small";

      removeBtn.style.padding = "6px 10px";
      removeBtn.style.fontSize = "0.85rem";
      removeBtn.style.lineHeight = "1";
      removeBtn.style.minWidth = "70px";
      removeBtn.style.marginLeft = "8px";

      removeBtn.addEventListener("click", () => {
        attendees = attendees.filter((a) => a.customerId !== customer.customerId);
        renderAttendees();
      });

      li.appendChild(removeBtn);
    }

    list.appendChild(li);
  });
}

document.getElementById("submitRecordBtn").addEventListener("click", async () => {
  if (!selectedClass || !selectedInstructor) {
    alert("Missing class or instructor.");
    return;
  }

  if (attendees.length === 0) {
    alert("No attendees selected.");
    return;
  }

  let attendeeIdsToSubmit;

  if (currentUser && currentUser.role === "member") {
    const selfInList = attendees.some((a) => a.customerId === currentUser.customerId);

    if (!selfInList) {
      alert("Members can only check in themselves.");
      return;
    }

    attendeeIdsToSubmit = [currentUser.customerId];
  } else {
    attendeeIdsToSubmit = attendees.map((a) => a.customerId);
  }

  const record = {
    classId: selectedClass.classId,
    className: selectedClass.className,
    classTime: selectedClass.time,
    instructorId: selectedInstructor.instructorId || selectedClass.instructorId,
    attendees: attendeeIdsToSubmit,
  };

  const res = await fetch("/api/classRecord/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });

  const result = await res.json().catch(() => ({}));

  if (res.ok) {
    currentRecord = result.record || null;

    if (currentRecord?.attendeeDetails) {
      attendees = currentRecord.attendeeDetails.map((customer) => ({
        customerId: customer.customerId,
        firstName: customer.firstName,
        lastName: customer.lastName,
      }));
      renderAttendees();
    }

    clearSearchBox();
    alert(result.message || "Class check-in saved.");
  } else {
    alert(result.message || "Failed to submit record.");
  }
});

document.getElementById("cancelCheckinBtn").addEventListener("click", () => {
  resetCheckinScreen();
});

document.getElementById("closeSelectModal").addEventListener("click", () => {
  document.getElementById("selectModal").classList.add("hidden");
});

loadCurrentUser();