// Sample In-Memory Catalog Data
const products = [
  { id: 1, name: "Noise-Cancelling Headphones", category: "Audio", price: 4499, icon: "fa-headphones" },
  { id: 2, name: "Bluetooth Soundbar 40W", category: "Audio", price: 2999, icon: "fa-volume-high" },
  { id: 3, name: "Smart Fitness Watch", category: "Smart Devices", price: 3499, icon: "fa-clock" },
  { id: 4, name: "Smart Home Security Camera", category: "Smart Devices", price: 2199, icon: "fa-video" },
  { id: 5, name: "Mechanical Gaming Keyboard", category: "Accessories", price: 1899, icon: "fa-keyboard" },
  { id: 6, name: "Ergonomic Optical Mouse", category: "Accessories", price: 799, icon: "fa-computer-mouse" },
  { id: 7, name: "Type-C Multi-port Hub 6-in-1", category: "Accessories", price: 1299, icon: "fa-network-wired" },
  { id: 8, name: "True Wireless Stereo Earbuds", category: "Audio", price: 1599, icon: "fa-ear-listen" }
];

let cart = [];
let currentCategory = "all";
let currentSearch = "";

// Select DOM Elements
const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartCount = document.getElementById("cartCount");
const subtotalAmount = document.getElementById("subtotalAmount");
const taxAmount = document.getElementById("taxAmount");
const finalTotal = document.getElementById("finalTotal");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const catButtons = document.querySelectorAll(".cat-btn");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModal = document.getElementById("closeModal");
const checkoutForm = document.getElementById("checkoutForm");
const modalPayable = document.getElementById("modalPayable");

// Format Indian Currency
const formatINR = (amt) => "₹" + amt.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Render Products
function renderProducts() {
  const filtered = products.filter(p => {
    const matchCat = currentCategory === "all" || p.category === currentCategory;
    const matchQuery = p.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p class="empty-msg" style="grid-column: 1/-1;">No products found matching your search.</p>`;
    return;
  }

  productGrid.innerHTML = filtered.map(item => `
    <div class="product-card">
      <div class="card-img-placeholder">
        <i class="fa-solid ${item.icon}"></i>
      </div>
      <div class="card-body">
        <span class="card-cat">${item.category}</span>
        <h4 class="card-title">${item.name}</h4>
        <div class="card-price">${formatINR(item.price)}</div>
        <button class="add-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

// Add Item to Cart
window.addToCart = function(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    const prod = products.find(p => p.id === productId);
    cart.push({ ...prod, qty: 1 });
  }
  updateCart();
  openCartDrawer();
};

// Update Cart and Dynamic Math Calculation
function updateCart() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalCount;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-msg">Your cart is currently empty.</p>`;
    subtotalAmount.textContent = formatINR(0);
    taxAmount.textContent = formatINR(0);
    finalTotal.textContent = formatINR(0);
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <div style="font-weight:600; font-size:0.95rem;">${item.name}</div>
        <div style="color:var(--text-muted); font-size:0.85rem;">${formatINR(item.price)} each</div>
        <div class="qty-controls">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <div style="font-weight:700;">
        ${formatINR(item.price * item.qty)}
      </div>
    </div>
  `).join("");

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  subtotalAmount.textContent = formatINR(subtotal);
  taxAmount.textContent = formatINR(gst);
  finalTotal.textContent = formatINR(grandTotal);
}

window.changeQty = function(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCart();
};

// Cart Drawer Open/Close
function openCartDrawer() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
}

cartToggle.addEventListener("click", openCartDrawer);
closeCart.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);

// Filter by Category
catButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    catButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.getAttribute("data-category");
    renderProducts();
  });
});

// Search Filter
searchBtn.addEventListener("click", () => {
  currentSearch = searchInput.value;
  renderProducts();
});

searchInput.addEventListener("keyup", (e) => {
  currentSearch = e.target.value;
  renderProducts();
});

// Checkout Modal Logic
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please add items to your cart before proceeding.");
    return;
  }
  closeCartDrawer();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  modalPayable.textContent = formatINR(subtotal * 1.18);
  checkoutModal.classList.add("active");
});

closeModal.addEventListener("click", () => {
  checkoutModal.classList.remove("active");
});

// Form Validation
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  // Name check
  if (fullName.length < 3) {
    document.getElementById("nameError").textContent = "Name must be at least 3 characters long.";
    isValid = false;
  } else {
    document.getElementById("nameError").textContent = "";
  }

  // Email check regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("emailError").textContent = "Please enter a valid email address.";
    isValid = false;
  } else {
    document.getElementById("emailError").textContent = "";
  }

  // Phone check (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    document.getElementById("phoneError").textContent = "Enter a valid 10-digit Indian mobile number.";
    isValid = false;
  } else {
    document.getElementById("phoneError").textContent = "";
  }

  // Address check
  if (address.length < 10) {
    document.getElementById("addressError").textContent = "Address must be at least 10 characters long.";
    isValid = false;
  } else {
    document.getElementById("addressError").textContent = "";
  }

  if (isValid) {
    alert(`Thank you, ${fullName}! Your order has been placed successfully.`);
    cart = [];
    updateCart();
    checkoutForm.reset();
    checkoutModal.classList.remove("active");
  }
});

// Initial Render
renderProducts();
