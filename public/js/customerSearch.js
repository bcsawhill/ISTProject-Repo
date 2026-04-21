const searchInput = document.getElementById("searchInput");
const resultsTable = document.querySelector("#resultsTable tbody");

let loggedInUser = null;

function formatPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} - ${digits.slice(6)}`;
  }

  return phone || "";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatEmailForDisplay(email) {
  const safeEmail = String(email || "").trim();
  const atIndex = safeEmail.indexOf("@");

  if (atIndex === -1) {
    return escapeHtml(safeEmail);
  }

  const firstPart = escapeHtml(safeEmail.slice(0, atIndex));
  const secondPart = escapeHtml(safeEmail.slice(atIndex));

  return `${firstPart}<br>${secondPart}`;
}

async function loadCurrentUser() {
  try {
    const res = await fetch("/api/me");
    if (res.ok) {
      loggedInUser = await res.json();
    }
  } catch (err) {
    console.error("Could not load current user:", err);
  }
}

async function loadRoleForCustomer(customerId) {
  const roleWrapper = document.getElementById("roleFieldWrapper");
  const roleSelect = document.getElementById("edit_role");

  roleWrapper.style.display = "none";
  roleSelect.value = "member";

  if (!loggedInUser || loggedInUser.role !== "admin") {
    return;
  }

  try {
    const res = await fetch(`/api/user-role/${customerId}`);

    if (!res.ok) {
      return;
    }

    const userData = await res.json();
    roleSelect.value = userData.role || "member";
    roleWrapper.style.display = "block";
  } catch (err) {
    console.error("Error loading role:", err);
  }
}

async function loadAccountStatusForCustomer(customerId) {
  try {
    const res = await fetch(`/api/account-status/${customerId}`);

    if (!res.ok) {
      return {
        hasLogin: false,
        isActive: null
      };
    }

    const data = await res.json();

    if (!data.hasLogin) {
      return {
        hasLogin: false,
        isActive: null
      };
    }

    return {
      hasLogin: true,
      isActive: data.isActive
    };
  } catch (err) {
    console.error("Error loading account status:", err);
    return {
      hasLogin: false,
      isActive: null
    };
  }
}

async function loadWaiverStatusForCustomer(customerId) {
  try {
    const res = await fetch(`/api/waiver-status/${customerId}`);

    if (!res.ok) {
      return { completed: false };
    }

    return await res.json();
  } catch (err) {
    console.error("Error loading waiver status:", err);
    return { completed: false };
  }
}

function getStatusBadge(accountStatus) {
  if (!accountStatus.hasLogin) {
    return `<span class="status-badge status-badge--none">No Login</span>`;
  }

  if (accountStatus.isActive) {
    return `<span class="status-badge status-badge--active">Active</span>`;
  }

  return `<span class="status-badge status-badge--inactive">Inactive</span>`;
}

function getWaiverBadge(waiverStatus) {
  if (waiverStatus.completed) {
    return `<span class="waiver-badge waiver-badge--complete">Completed</span>`;
  }

  return `<span class="waiver-badge waiver-badge--incomplete">Not Completed</span>`;
}

async function refreshSearchResults() {
  const query = searchInput.value.trim();
  const res = await fetch(`/api/customer/search?q=${encodeURIComponent(query)}`);
  const customers = await res.json();

  resultsTable.innerHTML = "";

  const rowData = await Promise.all(
    customers.map(async (customer) => {
      const [accountStatus, waiverStatus] = await Promise.all([
        loadAccountStatusForCustomer(customer.customerId),
        loadWaiverStatusForCustomer(customer.customerId)
      ]);

      return {
        customer,
        accountStatus,
        waiverStatus
      };
    })
  );

  rowData.forEach(({ customer: c, accountStatus, waiverStatus }) => {
    const row = document.createElement("tr");
    const actions = [];

    actions.push(`<button class="btn editBtn" data-id="${c.customerId}">Edit</button>`);

    if (loggedInUser && loggedInUser.role === "admin") {
      actions.push(`<button class="btn deleteBtn" data-id="${c.customerId}">Delete</button>`);

      if (accountStatus.hasLogin) {
        const toggleLabel = accountStatus.isActive ? "Deactivate" : "Reactivate";
        actions.push(
          `<button class="btn toggleAccountBtn" data-id="${c.customerId}" data-active="${accountStatus.isActive}">${toggleLabel}</button>`
        );
      }
    }

    row.innerHTML = `
      <td class="customer-id-cell">${escapeHtml(c.customerId)}</td>
      <td class="name-cell">
        <div>${escapeHtml(c.firstName)}</div>
        <div>${escapeHtml(c.lastName)}</div>
      </td>
      <td class="email-cell">${formatEmailForDisplay(c.email)}</td>
      <td class="phone-cell">${escapeHtml(formatPhone(c.phone))}</td>
      <td class="balance-cell">${escapeHtml(String(c.classBalance))}</td>
      <td>${getStatusBadge(accountStatus)}</td>
      <td>${getWaiverBadge(waiverStatus)}</td>
      <td>
        <div class="actions-cell">
          ${actions.join("")}
        </div>
      </td>
    `;

    resultsTable.appendChild(row);
  });

  attachEditButtons();
  attachDeleteButtons();
  attachToggleAccountButtons();
}

searchInput.addEventListener("input", async () => {
  await refreshSearchResults();
});

function attachEditButtons() {
  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const res = await fetch(`/api/customer/${id}`);
      const customer = await res.json();

      document.getElementById("edit_customerId").value = customer.customerId;
      document.getElementById("edit_firstName").value = customer.firstName;
      document.getElementById("edit_lastName").value = customer.lastName;
      document.getElementById("edit_email").value = customer.email;
      document.getElementById("edit_phone").value = customer.phone;
      document.getElementById("edit_address").value = customer.address;
      document.getElementById("edit_classBalance").value = customer.classBalance;
      document.getElementById("edit_senior").checked = customer.senior;

      await loadRoleForCustomer(customer.customerId);

      document.getElementById("editModal").classList.remove("hidden");
    });
  });
}

function attachDeleteButtons() {
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const confirmDelete = confirm(`Are you sure you want to delete customer ${id}?`);
      if (!confirmDelete) return;

      const res = await fetch(`/api/customer/delete/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Customer deleted");
        await refreshSearchResults();
      } else {
        alert("Failed to delete customer");
      }
    });
  });
}

function attachToggleAccountButtons() {
  document.querySelectorAll(".toggleAccountBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const customerId = btn.dataset.id;
      const currentlyActive = btn.dataset.active === "true";
      const nextState = !currentlyActive;
      const actionLabel = nextState ? "reactivate" : "deactivate";

      const confirmed = confirm(`Are you sure you want to ${actionLabel} this account?`);
      if (!confirmed) return;

      try {
        const res = await fetch(`/api/account-status/${customerId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: nextState })
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(result.message || result.error || "Failed to update account status");
        }

        alert(result.message || "Account status updated");
        await refreshSearchResults();
      } catch (err) {
        alert(err.message || "Failed to update account status");
      }
    });
  });
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
});

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updated = {
    customerId: document.getElementById("edit_customerId").value,
    firstName: document.getElementById("edit_firstName").value.trim(),
    lastName: document.getElementById("edit_lastName").value.trim(),
    email: document.getElementById("edit_email").value.trim(),
    phone: document.getElementById("edit_phone").value.trim(),
    address: document.getElementById("edit_address").value.trim(),
    classBalance: Number(document.getElementById("edit_classBalance").value),
    senior: document.getElementById("edit_senior").checked
  };

  const res = await fetch(`/api/customer/update/${updated.customerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  });

  if (!res.ok) {
    alert("Update failed");
    return;
  }

  if (loggedInUser && loggedInUser.role === "admin") {
    const selectedRole = document.getElementById("edit_role").value;

    const roleRes = await fetch(`/api/user-role/${updated.customerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selectedRole })
    });

    if (!roleRes.ok) {
      const roleError = await roleRes.json().catch(() => ({}));
      alert(roleError.error || "Failed to update role");
      return;
    }
  }

  alert("Customer updated");
  document.getElementById("editModal").classList.add("hidden");
  await refreshSearchResults();
});

(async function init() {
  await loadCurrentUser();
  await refreshSearchResults();
})();