let items = [
  { id: 1, name: "Toyota", category: "Car", quantity: 3, price: 15000 },
  { id: 2, name: "JavaScript Book", category: "Book", quantity: 10, price: 20 },
  { id: 3, name: "iPhone", category: "Mobile", quantity: 5, price: 1000 }
];

let nextId = 4;
let currentCategory = "All";

// Sidebar submenu
document.getElementById("items-btn").addEventListener("click", () => {
  document.getElementById("items-submenu").classList.toggle("hidden");
});

// Modal controls
document.addEventListener("DOMContentLoaded", () => {

  let items = [
    { id: 1, name: "Toyota", category: "Car", quantity: 3, price: 15000 },
    { id: 2, name: "JavaScript Book", category: "Book", quantity: 10, price: 20 },
    { id: 3, name: "iPhone", category: "Mobile", quantity: 5, price: 1000 }
  ];

  let nextId = 4;
  let currentCategory = "All";

  const modal = document.getElementById("item-modal");

  document.getElementById("add-item-btn").addEventListener("click", () => {
    document.getElementById("modal-title").textContent = "Add New Item";
    document.getElementById("item-form").reset();
    document.getElementById("edit-id").value = "";
    modal.classList.remove("hidden");
  });

  document.getElementById("modal-cancel").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Sidebar submenu
  document.getElementById("items-btn").addEventListener("click", () => {
    document.getElementById("items-submenu").classList.toggle("hidden");
  });

  // ... keep rest of functions here ...

  renderItemsTable();

});


// Save item
document.getElementById("item-form").addEventListener("submit", e => {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;
  const name = document.getElementById("item-name").value;
  const category = document.getElementById("item-category").value;
  const quantity = +document.getElementById("item-quantity").value;
  const price = +document.getElementById("item-price").value;

  if (id) {
    const index = items.findIndex(i => i.id == id);
    items[index] = { id: +id, name, category, quantity, price };
  } else {
    items.push({ id: nextId++, name, category, quantity, price });
  }

  modal.classList.add("hidden");
  renderItemsTable();
});

// Edit
function editItem(id) {
  const item = items.find(i => i.id === id);
  document.getElementById("modal-title").textContent = "Edit Item";
  document.getElementById("edit-id").value = item.id;
  document.getElementById("item-name").value = item.name;
  document.getElementById("item-category").value = item.category;
  document.getElementById("item-quantity").value = item.quantity;
  document.getElementById("item-price").value = item.price;
  modal.classList.remove("hidden");
}

// Delete
function deleteItem(id) {
  if (!confirm("Delete this item?")) return;
  items = items.filter(i => i.id !== id);
  renderItemsTable();
}

// Filter by category
function filterCategory(cat) {
  currentCategory = cat;
  renderItemsTable();
}

// Render table
function renderItemsTable() {
  const tbody = document.getElementById("items-table-body");
  tbody.innerHTML = "";

  const filtered = currentCategory === "All"
    ? items
    : items.filter(i => i.category === currentCategory);

  filtered.forEach(item => {
    const tr = document.createElement("tr");
    tr.className = "border-b hover:bg-purple-50";
    tr.innerHTML = `
      <td class="px-6 py-4">${item.id}</td>
      <td class="px-6 py-4">${item.name}</td>
      <td class="px-6 py-4">${item.category}</td>
      <td class="px-6 py-4">${item.quantity}</td>
      <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
      <td class="px-6 py-4">
        <button onclick="editItem(${item.id})" class="text-blue-600 mr-4">Edit</button>
        <button onclick="deleteItem(${item.id})" class="text-red-600">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
    });
}

// Initial render
renderItemsTable();


