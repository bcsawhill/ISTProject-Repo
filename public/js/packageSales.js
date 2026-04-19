function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

async function loadSales() {
  const res = await fetch("/api/package/sales");
  const sales = await res.json();

  const tbody = document.querySelector("#salesTable tbody");
  tbody.innerHTML = "";

  sales.forEach((sale) => {
    const typeText = sale.isUnlimited
      ? "Unlimited"
      : `${sale.classCount || 0} Classes`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sale.saleId}</td>
      <td>${sale.customerId}</td>
      <td>${sale.packageName || sale.packageId}</td>
      <td>${typeText}</td>
      <td>${formatDate(sale.date)}</td>
      <td>${formatDate(sale.expiresAt)}</td>
      <td>$${Number(sale.pricePaid || 0).toFixed(2)}</td>
    `;

    tbody.appendChild(row);
  });
}

loadSales();