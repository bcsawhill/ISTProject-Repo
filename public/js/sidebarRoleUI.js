function setupSidebarDropdowns() {
  document.querySelectorAll(".nav-dropdown-btn").forEach((btn) => {
    if (btn.dataset.bound === "true") return;

    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("open");
    });
  });
}

function applyRoleLinks(user) {
  const role = user.role;

  const allowedLinksByRole = {
    admin: null,
    staff: new Set([
      "dashboard.html",
      "package-sale.html",
      "package-sales.html",
      "class-checkin.html",
      "class-records.html",
      "customers.html",
      "customers-search.html",
      "waiver.html",
      "../index.html"
    ]),
    instructor: new Set([
      "dashboard.html",
      "package-sale.html",
      "class-checkin.html",
      "customers.html",
      "customers-search.html",
      "waiver.html",
      "../index.html"
    ]),
    member: new Set([
      "member-dashboard.html",
      "class-checkin.html",
      "waiver.html",
      "../index.html"
    ])
  };

  const allowed = allowedLinksByRole[role];

  if (role === "member") {
    const currentPage = window.location.pathname.split("/").pop();
    const allowedMemberPages = new Set([
      "member-dashboard.html",
      "class-checkin.html",
      "waiver.html"
    ]);

    if (!allowedMemberPages.has(currentPage)) {
      window.location.href = "/htmls/member-dashboard.html";
      return;
    }
  }

  if (!allowed) return;

  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    const links = [...dropdown.querySelectorAll(".nav-dropdown-menu a")];
    let visibleCount = 0;

    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const basename = href.split("/").pop();
      const show = allowed.has(href) || allowed.has(basename);

      link.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });

    dropdown.style.display = visibleCount > 0 ? "" : "none";
  });

  document.querySelectorAll(".nav > a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const basename = href.split("/").pop();
    const text = link.textContent.trim().toLowerCase();

    if (text === "log out") {
      link.style.display = "";
      return;
    }

    const show = allowed.has(href) || allowed.has(basename);
    link.style.display = show ? "" : "none";
  });
}

async function initSidebarRoleUI() {
  setupSidebarDropdowns();

  try {
    const res = await fetch("/api/me");

    if (!res.ok) {
      window.location.href = "/index.html";
      return;
    }

    const user = await res.json();
    applyRoleLinks(user);
  } catch (err) {
    console.error("Sidebar role UI error:", err);
  }
}

initSidebarRoleUI();
