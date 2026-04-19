async function loadCustomers() {
  const res = await fetch("/api/customer/search?q=");
  const customers = await res.json();

  const select = document.getElementById("customerSelect");
  select.innerHTML = "";

  customers.forEach((customer) => {
    const opt = document.createElement("option");
    opt.value = customer.customerId;
    opt.textContent = `${customer.firstName} ${customer.lastName} (${customer.customerId})`;
    select.appendChild(opt);
  });
}

async function loadPackages() {
  const res = await fetch("/api/package/all");
  const packages = await res.json();

  const select = document.getElementById("packageSelect");
  select.innerHTML = "";

  packages.forEach((pkg) => {
    const opt = document.createElement("option");
    opt.value = pkg.packageId;
    opt.textContent = `${pkg.packageName} - $${pkg.price}`;
    select.appendChild(opt);
  });
}

document.getElementById("completeSaleBtn").addEventListener("click", async () => {
  const customerId = document.getElementById("customerSelect").value;
  const packageId = document.getElementById("packageSelect").value;

  if (!customerId || !packageId) {
    alert("Please select both a customer and a package.");
    return;
  }

  const res = await fetch("/api/package/sale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, packageId }),
  });

  const result = await res.json();

  if (res.ok) {
    const expiresText = result.sale?.expiresAt
      ? new Date(result.sale.expiresAt).toLocaleDateString()
      : "N/A";

    alert(`${result.message}\nExpires on: ${expiresText}`);
  } else {
    alert(result.message || "Failed to record sale");
  }
});

loadCustomers();
loadPackages();