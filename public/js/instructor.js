document.getElementById("instructorForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const meRes = await fetch("/api/me");
    if (!meRes.ok) {
      throw new Error("Not logged in");
    }

    const me = await meRes.json();
    if (me.role !== "admin") {
      throw new Error("Only admins can create instructor login accounts");
    }

    const idRes = await fetch("/api/instructor/getNextId");
    const { nextId } = await idRes.json();

    const instructorData = {
      instructorId: nextId,
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      pref: document.querySelector("input[name='pref']:checked")?.value || "email",
      username: document.getElementById("username").value.trim(),
      password: document.getElementById("password").value
    };

    const res = await fetch("/api/instructor/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructorData)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to add instructor");
    }

    let successMessage = `Instructor ${instructorData.instructorId} added successfully!`;

    if (result.userCreated) {
      successMessage += `\nLogin created for ${result.user.username} (${result.user.role}).`;
    }

    alert(successMessage);
    document.getElementById("instructorForm").reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
});