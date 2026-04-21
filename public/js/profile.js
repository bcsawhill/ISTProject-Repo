function setMessage(id, message, isError = true) {
  const box = document.getElementById(id);
  box.textContent = message;
  box.style.display = "block";
  box.style.color = isError ? "#8a1f1f" : "#1f6f3b";
}

function clearMessage(id) {
  const box = document.getElementById(id);
  box.textContent = "";
  box.style.display = "none";
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.value = value || "";
  }
}

async function loadProfile() {
  try {
    const res = await fetch("/api/profile");

    if (!res.ok) {
      window.location.href = "/index.html";
      return;
    }

    const data = await res.json();
    const user = data.user || {};
    const customer = data.customer || null;

    setValue("profileUsername", user.username || "");
    setValue("profileRole", user.role || "");
    setValue("profileCustomerId", user.customerId || "");

    if (customer) {
      setValue("profileFirstName", customer.firstName || "");
      setValue("profileLastName", customer.lastName || "");
      setValue("profileEmail", customer.email || "");
      setValue("profilePhone", customer.phone || "");
      setValue("profileAddress", customer.address || "");
      document.getElementById("profileNotice").textContent = "";
    } else {
      setValue("profileFirstName", "");
      setValue("profileLastName", "");
      setValue("profileEmail", "");
      setValue("profilePhone", "");
      setValue("profileAddress", "");
      document.getElementById("profileNotice").textContent =
        "No editable customer profile was found for this account.";
    }
  } catch (err) {
    window.location.href = "/index.html";
  }
}

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage("profileMessage");

  const payload = {
    firstName: document.getElementById("profileFirstName").value.trim(),
    lastName: document.getElementById("profileLastName").value.trim(),
    email: document.getElementById("profileEmail").value.trim(),
    phone: document.getElementById("profilePhone").value.trim(),
    address: document.getElementById("profileAddress").value.trim()
  };

  if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) {
    setMessage("profileMessage", "First name, last name, email, and phone are required.");
    return;
  }

  try {
    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update profile.");
    }

    setMessage("profileMessage", result.message || "Profile updated successfully.", false);
    await loadProfile();
  } catch (err) {
    setMessage("profileMessage", err.message || "Failed to update profile.");
  }
});

document.getElementById("changePasswordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage("passwordMessage");

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    setMessage("passwordMessage", "Please fill in all password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setMessage("passwordMessage", "New passwords do not match.");
    return;
  }

  if (newPassword.length < 8) {
    setMessage("passwordMessage", "New password must be at least 8 characters.");
    return;
  }

  try {
    const res = await fetch("/api/profile/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword
      })
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update password.");
    }

    document.getElementById("changePasswordForm").reset();
    setMessage("passwordMessage", result.message || "Password updated successfully.", false);
  } catch (err) {
    setMessage("passwordMessage", err.message || "Failed to update password.");
  }
});

loadProfile();