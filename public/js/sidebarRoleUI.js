function setupSidebarDropdowns() {
  document.querySelectorAll(".nav-dropdown-btn").forEach((btn) => {
    if (btn.dataset.bound === "true") return;

    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("open");
    });
  });
}

function getNavRoot() {
  return document.querySelector(".nav");
}

function hrefMatches(linkHref, target) {
  if (!linkHref) return false;
  return (
    linkHref === target ||
    linkHref.endsWith(`/${target}`) ||
    linkHref.endsWith(target)
  );
}

function getTopLevelDirectLink(targetHref) {
  const nav = getNavRoot();
  if (!nav) return null;

  return [...nav.children].find((el) => {
    if (el.tagName !== "A") return false;
    const href = el.getAttribute("href") || "";
    return hrefMatches(href, targetHref);
  }) || null;
}

function ensureTopLevelLinkBlock(id, href, text) {
  const nav = getNavRoot();
  if (!nav) return null;

  const existingWrapper = document.getElementById(id);
  if (existingWrapper) return existingWrapper;

  const existingDirect = getTopLevelDirectLink(href);
  if (existingDirect) return existingDirect;

  const wrapper = document.createElement("div");
  wrapper.id = id;

  const link = document.createElement("a");
  link.href = href;
  link.textContent = text;

  wrapper.appendChild(link);

  const logoutLink =
    getTopLevelDirectLink("../index.html") ||
    getTopLevelDirectLink("./index.html") ||
    getTopLevelDirectLink("index.html");

  if (logoutLink) {
    nav.insertBefore(wrapper, logoutLink);
  } else {
    nav.appendChild(wrapper);
  }

  return wrapper;
}

function getDropdownBlock(id, label) {
  const byId = document.getElementById(id);
  if (byId) return byId;

  const btn = [...document.querySelectorAll(".nav-dropdown-btn")].find((button) =>
    button.textContent.trim().toLowerCase().startsWith(label.toLowerCase())
  );

  return btn ? btn.closest(".nav-dropdown") : null;
}

function syncWrappedDropdownVisibility() {
  ["nav-instructors", "nav-packages", "nav-classes", "nav-customers"].forEach((id) => {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;
    if (wrapper.classList.contains("nav-dropdown")) return;

    const innerDropdown = wrapper.querySelector(".nav-dropdown");
    if (!innerDropdown) return;

    wrapper.style.display = innerDropdown.style.display === "none" ? "none" : "";
  });
}

function isActuallyVisible(el) {
  if (!el) return false;
  if (el.style.display === "none") return false;

  if (el.classList.contains("nav-dropdown")) return true;

  const innerDropdown = el.querySelector(".nav-dropdown");
  if (innerDropdown && innerDropdown.style.display === "none") return false;

  return true;
}

function setBlockVisibility(id, href, show) {
  const wrapper = document.getElementById(id);
  if (wrapper) {
    wrapper.style.display = show ? "" : "none";
    return;
  }

  const direct = getTopLevelDirectLink(href);
  if (direct) {
    direct.style.display = show ? "" : "none";
  }
}

function reorderSidebar(role) {
  const nav = getNavRoot();
  if (!nav) return;

  const blocks = {
    instructors: getDropdownBlock("nav-instructors", "Instructors"),
    packages: getDropdownBlock("nav-packages", "Packages"),
    classes: getDropdownBlock("nav-classes", "Classes"),
    customers: getDropdownBlock("nav-customers", "Customers"),
    reports: document.getElementById("nav-reports-link") || getTopLevelDirectLink("reports.html"),
    profile: document.getElementById("nav-profile-link") || getTopLevelDirectLink("profile.html"),
    waiver: document.getElementById("nav-waiver-link") || getTopLevelDirectLink("waiver.html"),
    logout:
      getTopLevelDirectLink("../index.html") ||
      getTopLevelDirectLink("./index.html") ||
      getTopLevelDirectLink("index.html"),
  };

  const orderByRole = {
    admin: ["instructors", "packages", "classes", "customers", "reports", "profile", "waiver", "logout"],
    staff: ["packages", "classes", "customers", "profile", "waiver", "logout"],
    instructor: ["packages", "classes", "customers", "profile", "waiver", "logout"],
    member: ["classes", "profile", "waiver", "logout"],
  };

  const order = orderByRole[role] || orderByRole.member;

  order.forEach((key) => {
    const el = blocks[key];
    if (el && isActuallyVisible(el)) {
      nav.appendChild(el);
    }
  });
}

function applyRoleLinks(user) {
  const role = user.role;
  const currentPage = window.location.pathname.split("/").pop();

  ensureTopLevelLinkBlock("nav-reports-link", "reports.html", "Reports");
  ensureTopLevelLinkBlock("nav-profile-link", "profile.html", "Profile");
  ensureTopLevelLinkBlock("nav-waiver-link", "waiver.html", "Waiver");

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
      "profile.html",
      "waiver.html",
      "../index.html",
      "./index.html",
      "index.html"
    ]),
    instructor: new Set([
      "dashboard.html",
      "package-sale.html",
      "class-checkin.html",
      "customers.html",
      "customers-search.html",
      "profile.html",
      "waiver.html",
      "../index.html",
      "./index.html",
      "index.html"
    ]),
    member: new Set([
      "member-dashboard.html",
      "class-checkin.html",
      "profile.html",
      "waiver.html",
      "../index.html",
      "./index.html",
      "index.html"
    ])
  };

  if (role !== "admin" && currentPage === "reports.html") {
    if (role === "member") {
      window.location.href = "/htmls/member-dashboard.html";
    } else {
      window.location.href = "/htmls/dashboard.html";
    }
    return;
  }

  const allowed = allowedLinksByRole[role];

  if (role === "member") {
    const allowedMemberPages = new Set([
      "member-dashboard.html",
      "class-checkin.html",
      "profile.html",
      "waiver.html"
    ]);

    if (!allowedMemberPages.has(currentPage)) {
      window.location.href = "/htmls/member-dashboard.html";
      return;
    }
  }

  if (allowed) {
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

    setBlockVisibility("nav-reports-link", "reports.html", allowed.has("reports.html"));
    setBlockVisibility("nav-profile-link", "profile.html", allowed.has("profile.html"));
    setBlockVisibility("nav-waiver-link", "waiver.html", allowed.has("waiver.html"));
  }

  syncWrappedDropdownVisibility();
  reorderSidebar(role);
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