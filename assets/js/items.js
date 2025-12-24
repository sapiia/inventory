let productTypes = ["Car", "Moto", "Skincare"];
let items = [
  { id: 1, name: "Toyota Camry", type: "Car", category: "Sedan", quantity: 2, price: 25000, model: "2023", image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBMMTE1IDk1SDEzMEwxNDUgODBIMTMwTDEwMCAxMTBMMzAgODBIMTUgTDMwIDk1SDQ1TDEwMCA4MFoiIGZpbGw9IiM3QzNBRUQiLz4KPHN2Zy8+" },
  { id: 2, name: "Honda CBR", type: "Moto", category: "Sport Bike", quantity: 1, price: 15000, model: "2022", image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBMMTE1IDk1SDEzMEwxNDUgODBIMTMwTDEwMCAxMTBMMzAgODBIMTUgTDMwIDk1SDQ1TDEwMCA4MFoiIGZpbGw9IiM3QzNBRUQiLz4KPHN2Zy8+" },
  { id: 3, name: "Cetaphil Cleanser", type: "Skincare", category: "Cleanser", quantity: 10, price: 15.99, model: "Daily Hydration", image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEgxNzBWMTEwSDEzMFYxNDBIMTUwVjE3MEgzMFYzMFoiIGZpbGw9IiM3QzNBRUQiLz4KPHRleHQgeD0iMTAwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiPkJPT0s8L3RleHQ+CjxzdmcvPg==" }
];
let nextId = 4;
let currentType = "All";
let currentView = "products"; // show product list with navbar by default

// Elements
const modal = document.getElementById("item-modal");
const itemsGrid = document.getElementById("items-grid");

const form = document.getElementById("item-form");
const editIdInput = document.getElementById("edit-id");
const nameInput = document.getElementById("name");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const modelInput = document.getElementById("model");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");

// Image preview
imageInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      imagePreview.src = event.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.style.display = "none";
  }
});

// Sidebar toggle
document.getElementById("items-btn").onclick = () => {
  document.getElementById("items-submenu").classList.toggle("hidden");
};

// Add type functionality
function addNewType() {
  const typeName = prompt("Enter new product type:");
  if (typeName && typeName.trim() && !productTypes.includes(typeName.trim())) {
    productTypes.push(typeName.trim());
    renderSidebar();
    updateTypeSelect();
    renderContent();
  }
}

function selectType(type) {
  currentType = type;
  currentView = "products";
  renderContent();
  updateHeader();
}

function goBackToTypes() {
  // Instead of showing the type cards, show the products list with All types
  currentView = "products";
  currentType = "All";
  renderContent();
  updateHeader();
}

// Render type navigation bar (tabs)
function renderTypeNav() {
  const nav = document.getElementById("type-nav");
  if (!nav) return;
  // Always include "All"
  let html = ``;
  const typesForNav = ["All", ...productTypes];
  typesForNav.forEach(t => {
    const active = (t === currentType) ? "bg-purple-600 text-white" : "bg-white text-gray-700";
    html += `<button onclick="selectType('${t}')" class="px-4 py-2 rounded-lg shadow-sm border ${active} hover:opacity-90 transition">${t}</button>`;
  });
  nav.innerHTML = html;
}

function updateTypeSelect() {
  const typeSelect = document.getElementById("type");
  typeSelect.innerHTML = '<option value="">Select Type</option>';
  productTypes.forEach(type => {
    typeSelect.innerHTML += `<option value="${type}">${type}</option>`;
  });
}

// Open modal
document.getElementById("add-item-btn").onclick = () => {
  clearForm();
  document.getElementById("modal-title").innerText = "Add New Product";
  modal.classList.remove("hidden");
};

// Close modal
document.getElementById("cancel-btn").onclick = () => {
  modal.classList.add("hidden");
  clearForm();
};

// Save item
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const type = typeInput.value.trim();
  const category = categoryInput.value.trim();
  const quantity = Number(quantityInput.value);
  const price = Number(priceInput.value);
  const model = modelInput.value.trim();
  const editId = editIdInput.value;

  if (!name || !type || !category || !model || isNaN(quantity) || isNaN(price) || quantity < 0 || price < 0) {
    alert("Please fill all required fields with valid values");
    return;
  }

  // Handle image
  let image = "";
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(event) {
      image = event.target.result;
      saveItem(name, type, category, quantity, price, model, editId, image);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    // Use existing image or default
    const existingItem = items.find(i => i.id == editId);
    image = existingItem ? existingItem.image : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBMMTE1IDk1SDEzMEwxNDUgODBIMTMwTDEwMCAxMTBMMzAgODBIMTUgTDMwIDk1SDQ1TDEwMCA4MFoiIGZpbGw9IiM3QzNBRUQiLz4KPHN2Zy8+";
    saveItem(name, type, category, quantity, price, model, editId, image);
  }
});

function saveItem(name, type, category, quantity, price, model, editId, image) {
  if (editId) {
    // Edit
    const index = items.findIndex(i => i.id == editId);
    items[index] = { id: Number(editId), name, type, category, quantity, price, model, image };
  } else {
    // Add
    items.push({ id: nextId++, name, type, category, quantity, price, model, image });
  }

  renderContent();
  modal.classList.add("hidden");
  clearForm();
}

// Edit
function editItem(id) {
  const item = items.find(i => i.id === id);
  editIdInput.value = item.id;
  nameInput.value = item.name;
  typeInput.value = item.type;
  categoryInput.value = item.category;
  quantityInput.value = item.quantity;
  priceInput.value = item.price;
  modelInput.value = item.model;
  imagePreview.src = item.image;
  imagePreview.style.display = "block";
  document.getElementById("modal-title").innerText = "Edit Product";
  modal.classList.remove("hidden");
}

// Delete
function deleteItem(id) {
  if (!confirm("Delete this item?")) return;
  items = items.filter(i => i.id !== id);
  renderContent();
}

// Filter
function filterCategory(cat) {
  currentType = cat;
  renderContent();
}

// Render content based on view
function renderContent() {
  if (currentView === "types") {
    renderTypes();
  } else {
    renderTypeNav();
    renderProducts();
  }
}

// Render product types
function renderTypes() {
  itemsGrid.innerHTML = "";
  productTypes.forEach(type => {
    const typeItems = items.filter(item => item.type === type);
    itemsGrid.innerHTML += `
      <div class="type-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer" onclick="selectType('${type}')">
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-box text-purple-600 text-2xl"></i>
          </div>
          <h3 class="font-semibold text-xl mb-2">${type}</h3>
          <p class="text-gray-600">${typeItems.length} products</p>
        </div>
      </div>`;
  });

  // Add new type card
  itemsGrid.innerHTML += `
    <div class="type-card bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-purple-300" onclick="addNewType()">
      <div class="text-center">
        <div class="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-plus text-purple-600 text-2xl"></i>
        </div>
        <h3 class="font-semibold text-xl mb-2 text-purple-700">Add New Type</h3>
        <p class="text-gray-600">Create a new product category</p>
      </div>
    </div>`;
}

// Render products
function renderProducts() {
  itemsGrid.innerHTML = "";
  const filtered = currentType === "All" ? items : items.filter(i => i.type === currentType);

  if (filtered.length === 0) {
    itemsGrid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">
      <i class="fas fa-box-open text-4xl mb-4"></i>
      <p>No products found in this category</p>
      <button onclick="goBackToTypes()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        <i class="fas fa-arrow-left mr-2"></i>Back to Types
      </button>
    </div>`;
    return;
  }

  filtered.forEach(item => {
    itemsGrid.innerHTML += `
      <div class="item-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div class="h-48 bg-gray-100 relative overflow-hidden">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
          <div class="absolute top-3 right-3 flex space-x-2">
            <button onclick="editItem(${item.id}); event.stopPropagation()" class="p-2 bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-lg">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteItem(${item.id}); event.stopPropagation()" class="p-2 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors shadow-lg">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <h3 class="font-semibold text-xl mb-1">${item.name}</h3>
            <p class="text-sm text-gray-500">Model: ${item.model}</p>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Type:</span>
              <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">${item.type}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Category:</span>
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">${item.category}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Quantity:</span>
              <span class="font-semibold text-lg">${item.quantity}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Price:</span>
              <span class="font-semibold text-lg text-green-600">$${item.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>`;
  });
}

// Update header
function updateHeader() {
  const header = document.querySelector("h1");
  if (currentView === "types") {
    header.innerHTML = 'Items Management <span class="text-purple-600">• Product Types</span>';
  } else {
    header.innerHTML = `Items Management <span class="text-purple-600">• ${currentType} Products</span>
      <button onclick="goBackToTypes()" class="ml-4 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
        <i class="fas fa-arrow-left mr-1"></i>Back
      </button>`;
  }
}

// Clear form
function clearForm() {
  editIdInput.value = "";
  nameInput.value = "";
  typeInput.value = "";
  categoryInput.value = "";
  quantityInput.value = "";
  priceInput.value = "";
  modelInput.value = "";
  imageInput.value = "";
  imagePreview.style.display = "none";
}

// Render sidebar
function renderSidebar() {
  const submenu = document.getElementById("items-submenu");
  if (!submenu) return;
  // Keep the Items submenu empty (no types shown here)
  submenu.innerHTML = '';
}

// Initialize
renderSidebar();
updateTypeSelect();
renderContent();
updateHeader();
