const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ELEMENTS
const imageEl = document.getElementById("productImage");
const titleEl = document.getElementById("productTitle");
const priceEl = document.getElementById("productPrice");
const descEl = document.getElementById("productDesc");

const thumbnails = document.querySelectorAll(".thumb");
const zoomContainer = document.querySelector(".zoom-container");

const quantityEl = document.getElementById("quantity");
const totalPriceEl = document.getElementById("totalPrice");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");

// STATE
let quantity = 1;   // ✅ fixed
const maxLimit = 10;
let basePrice = 0;

// ==========================
// FETCH PRODUCT
// ==========================
async function fetchProduct() {
  try {
    const cachedData = localStorage.getItem("products");

    if (cachedData) {
      const products = JSON.parse(cachedData);
      const product = products.find(p => p.id == productId);

      if (product) {
        displayProduct(product);
        return;
      }
    }

    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch");

    const product = await response.json();
    displayProduct(product);

  } catch (error) {
    console.error(error);
    titleEl.textContent = "Failed to load product";
  }
}

// ==========================
// DISPLAY PRODUCT
// ==========================
function displayProduct(product) {
  if (!product) {
    titleEl.textContent = "Product not found";
    return;
  }

  imageEl.src = product.image || "https://via.placeholder.com/300";
  imageEl.alt = product.title;

  titleEl.textContent = product.title;
  priceEl.textContent = `$${product.price}`;
  descEl.textContent = product.description;

  basePrice = product.price;
  updateTotal();
}

// ==========================
// THUMBNAILS
// ==========================
thumbnails.forEach(thumb => {
  thumb.addEventListener("click", () => {
    imageEl.src = thumb.src;

    thumbnails.forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");
  });
});

// ==========================
// VARIATIONS
// ==========================
function getSelectedOption(groupId) {
  const group = document.getElementById(groupId);
  const active = group.querySelector(".option.active");
  return active ? active.textContent.trim() : "";
}

// ENABLE OPTION CLICK
document.querySelectorAll(".options").forEach(group => {
  group.addEventListener("click", (e) => {
    if (!e.target.classList.contains("option")) return;
    if (e.target.classList.contains("disabled")) return;

    group.querySelectorAll(".option").forEach(btn => {
      btn.classList.remove("active");
    });

    e.target.classList.add("active");
    updateTotal();
  });
});

// ==========================
// PRICE LOGIC
// ==========================
const sizePriceMap = { S: 0, M: 5, L: 10 };
const colorPriceMap = { Black: 0, Blue: 3 };

function updateTotal() {
  const sizeExtra = sizePriceMap[getSelectedOption("sizeOptions")] || 0;
  const colorExtra = colorPriceMap[getSelectedOption("colorOptions")] || 0;

  const finalPrice = basePrice + sizeExtra + colorExtra;
  const total = finalPrice * quantity;

  totalPriceEl.textContent = `$${total.toFixed(2)}`;
  quantityEl.textContent = quantity;
}

// ==========================
// QUANTITY
// ==========================
if (increaseBtn) {
  increaseBtn.addEventListener("click", () => {
    if (quantity < maxLimit) {
      quantity++;
      updateTotal();
    }
  });
}

if (decreaseBtn) {
  decreaseBtn.addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;
      updateTotal();
    }
  });
}

// ==========================
// CART
// ==========================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

document.querySelector(".add-cart")?.addEventListener("click", () => {

  const product = {
    id: productId,
    title: titleEl.textContent,
    price: basePrice,
    quantity,
    image: imageEl.src,
    size: getSelectedOption("sizeOptions"),
    color: getSelectedOption("colorOptions")
  };

  // ✅ validation
  if (!product.size || !product.color) {
    alert("Please select size and color");
    return;
  }

  const cart = getCart();

  const existing = cart.find(item =>
    item.id == product.id &&
    item.size === product.size &&
    item.color === product.color
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push(product);
  }

  saveCart(cart);
  updateCartCount();
  showToast();
});

// ==========================
// CART COUNT
// ==========================
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartEl = document.querySelector(".cart-count");
  if (cartEl) cartEl.textContent = totalItems;
}

// ==========================
// TOAST
// ==========================
function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ==========================
// ZOOM
// ==========================
if (zoomContainer && imageEl) {
  zoomContainer.addEventListener("mousemove", (e) => {
    const rect = zoomContainer.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    imageEl.style.transformOrigin = `${x}% ${y}%`;
  });
}

// ==========================
// INIT
// ==========================
if (productId) {
  fetchProduct();
} else {
  titleEl.textContent = "Invalid Product";
}

updateCartCount();