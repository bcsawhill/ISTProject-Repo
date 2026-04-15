function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

async function loadMemberDashboard() {
  const meRes = await fetch("/api/me");
  if (!meRes.ok) {
    window.location.href = "/index.html";
    return;
  }

  const me = await meRes.json();
  if (me.role !== "member") {
    window.location.href = "/htmls/dashboard.html";
    return;
  }

  const [customerRes, salesRes] = await Promise.all([
    fetch(`/api/customer/${me.customerId}`),
    fetch(`/api/package/sales/customer/${me.customerId}`),
  ]);

  if (!customerRes.ok || !salesRes.ok) {
    alert("Could not load member dashboard.");
    return;
  }

  const customer = await customerRes.json();
  const sales = await salesRes.json();

  document.getElementById("classBalanceValue").textContent = String(customer.classBalance || 0);
  document.getElementById("packageExpiresValue").textContent = formatDate(customer.packageExpires);
  document.getElementById("unlimitedStatusValue").textContent = customer.unlimitedActive
    ? "Active"
    : "Inactive";
  document.getElementById("unlimitedExpiresValue").textContent = formatDate(customer.unlimitedExpires);

  const tbody = document.querySelector("#purchaseHistoryTable tbody");
  tbody.innerHTML = "";

  if (sales.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5">No package purchase history yet.</td>`;
    tbody.appendChild(row);
    return;
  }

  sales.forEach((sale) => {
    const typeText = sale.isUnlimited
      ? "Unlimited"
      : `${sale.classCount || 0} Classes`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sale.packageName || sale.packageId}</td>
      <td>${typeText}</td>
      <td>${formatDate(sale.date)}</td>
      <td>${formatDate(sale.expiresAt)}</td>
      <td>$${Number(sale.pricePaid || 0).toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
}

loadMemberDashboard();