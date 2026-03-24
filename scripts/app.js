const productGrid = document.getElementById("productGrid");
const cartCountEl = document.querySelector(".cart-count");
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav-bar");

// HAMBURGER MENU
if (hamburger) {
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

// FETCH PRODUCTS
async function fetchProducts() {
  try {
    const cachedData = localStorage.getItem("products");
    const cacheTime = localStorage.getItem("products_time");

    if (cachedData && cacheTime && (Date.now() - cacheTime < 3600000)) {
      displayProducts(JSON.parse(cachedData));
      return;
    }

    productGrid.innerHTML = "<p class='loading'>Loading products...</p>";

    const response = await fetch("https://fakestoreapi.com/products");

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();

    localStorage.setItem("products", JSON.stringify(data));
    localStorage.setItem("products_time", Date.now());

    displayProducts(data);

  } catch (error) {
    console.error(error);

    productGrid.innerHTML = `
      <div class="error">
        <p>⚠ Failed to load products</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

// DISPLAY PRODUCTS
function displayProducts(products) {
  productGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const { id, title, price, image, description } = product;

    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${image}" loading="lazy" alt="${title}">
      <h3>${title.substring(0, 25)}...</h3>
      <p class="price">$${price}</p>
      <p class="desc">${description.substring(0, 60)}...</p>
      <button class="add-cart">Add to Cart</button>
    `;

    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add-cart")) {
        window.location.href = `product.html?id=${id}`;
      }
    });

    fragment.appendChild(card);
  });

  productGrid.appendChild(fragment);
}

// CART FUNCTIONS
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  if (cartCountEl) cartCountEl.textContent = cart.length;
}

// ADD TO CART (single listener)
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-cart")) {

    const card = e.target.closest(".product-card");

    const title = card.querySelector("h3").textContent;
    const price = parseFloat(
      card.querySelector(".price").textContent.replace("$", "")
    );
    const image = card.querySelector("img").src;

    const product = { title, price, image };

    const cart = getCart();
    cart.push(product);
    saveCart(cart);

    updateCartCount();

    showToast();
  }
});

// TOAST FUNCTION
function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// INIT
updateCartCount();
fetchProducts();