async function loadCurrentUser() {
  const res = await fetch("/api/me");
  if (!res.ok) return null;
  return res.json();
}

async function initCustomerPage() {
  try {
    const user = await loadCurrentUser();

    const roleFieldWrapper = document.getElementById("roleFieldWrapper");
    const accountFieldsWrapper = document.getElementById("accountFieldsWrapper");
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (!user) return;

    // Admin can choose the role. Everyone else creates member accounts only.
    if (user.role === "admin") {
      roleFieldWrapper.style.display = "block";
    } else {
      roleFieldWrapper.style.display = "none";
    }

    // Username/password are required for every customer account.
    accountFieldsWrapper.style.display = "block";
    username.required = true;
    password.required = true;
    username.disabled = false;
    password.disabled = false;
  } catch (err) {
    console.error("Failed to initialize customer page:", err);
  }
}

document.getElementById("customerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const meRes = await fetch("/api/me");
    if (!meRes.ok) {
      throw new Error("Not logged in");
    }

    const me = await meRes.json();

    const idRes = await fetch("/api/customer/getNextId");
    const { nextId } = await idRes.json();

    const selectedRole =
      me.role === "admin"
        ? document.getElementById("role").value
        : "member";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      throw new Error("Username and temporary password are required");
    }

    const customerData = {
      customerId: nextId,
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      classBalance: Number(document.getElementById("classBalance").value) || 0,
      senior: document.getElementById("senior").checked,
      role: selectedRole,
      username,
      password,
    };

    const res = await fetch("/api/customer/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to add customer");
    }

    let successMessage = `Customer ${customerData.customerId} added successfully!`;

    if (result.userCreated) {
      successMessage += `\nLogin created for ${result.user.username} (${result.user.role}).`;
    }

    alert(successMessage);
    document.getElementById("customerForm").reset();

    if (document.getElementById("role")) {
      document.getElementById("role").value = "member";
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
});

initCustomerPage();