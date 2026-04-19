let selectedClass = null;
let selectedInstructor = null;
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

function findAvailableClass(classes) {
  const now = new Date();
  const today = DAYS[now.getDay()];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const earliestCheckin = nowMinutes - 30;
  const latestCheckin = nowMinutes + 90;

  const todaysClasses = classes
    .filter((cls) => cls.dayOfWeek === today)
    .map((cls) => ({
      ...cls,
      startMinutes: parseTimeLabelToMinutes(cls.time),
    }))
    .filter(
      (cls) =>
        Number.isFinite(cls.startMinutes) &&
        cls.startMinutes >= earliestCheckin &&
        cls.startMinutes <= latestCheckin
    )
    .sort((a, b) => Math.abs(a.startMinutes - nowMinutes) - Math.abs(b.startMinutes - nowMinutes));

  return todaysClasses[0] || null;
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

async function loadClassesForDropdown(classes) {
  const select = document.getElementById("select_class");
  select.innerHTML = "";

  classes
    .slice()
    .sort((a, b) => {
      const dayDiff = DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek);
      if (dayDiff !== 0) return dayDiff;
      return parseTimeLabelToMinutes(a.time) - parseTimeLabelToMinutes(b.time);
    })
    .forEach((cls) => {
      const opt = document.createElement("option");
      opt.value = cls.classId;
      opt.textContent = `${cls.dayOfWeek} ${cls.time} – ${cls.className}`;
      select.appendChild(opt);
    });
}

function renderCheckinHeader() {
  document.getElementById("checkinTitle").textContent =
    `${selectedClass.dayOfWeek} ${selectedClass.time} – ${selectedClass.className}`;

  document.getElementById("checkinInstructor").textContent =
    `Instructor: ${
      selectedInstructor?.firstName
        ? `${selectedInstructor.firstName} ${selectedInstructor.lastName}`
        : selectedClass.instructorId
    }`;
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
  attendees = [];

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
        box.classList.add("hidden");
        document.getElementById("customerSearch").value = "";
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
    li.textContent = `${customer.firstName} ${customer.lastName} (${customer.customerId})`;

    if (!currentUser || currentUser.role !== "member") {
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "btn btn--danger btn--small";
      removeBtn.style.marginLeft = "1rem";

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

  if (
    currentUser &&
    currentUser.role === "member" &&
    (attendees.length !== 1 || attendees[0].customerId !== currentUser.customerId)
  ) {
    alert("Members can only check in themselves.");
    return;
  }

  const idRes = await fetch("/api/classRecord/getNextId");
  const { recordId } = await idRes.json();
  const today = new Date().toISOString().split("T")[0];

  const record = {
    recordId,
    classId: selectedClass.classId,
    instructorId: selectedInstructor.instructorId || selectedClass.instructorId,
    date: today,
    attendees: attendees.map((a) => a.customerId),
  };

  const res = await fetch("/api/classRecord/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });

  const result = await res.json().catch(() => ({}));

  if (res.ok) {
    alert("Class record submitted and class balance updated.");
    resetCheckinScreen();
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