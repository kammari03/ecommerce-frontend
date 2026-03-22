// ===============================
// SELECT ELEMENTS
// ===============================
const productGrid = document.getElementById("productGrid");
const cartCountEl = document.querySelector(".cart-count");
const hamburger = document.querySelector(".Hambg");
const nav = document.querySelector(".nav-bar");

let cartCount = 0;

// ===============================
// MOBILE NAV TOGGLE
// ===============================
hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// ===============================
// FETCH PRODUCTS (WITH CACHE)
// ===============================
async function fetchProducts() {
  try {
    const cachedData = localStorage.getItem("products");
    const cacheTime = localStorage.getItem("products_time");

    // Cache valid for 1 hour
    if (cachedData && cacheTime && (Date.now() - cacheTime < 3600000)) {
      console.log("Loaded from cache");
      displayProducts(JSON.parse(cachedData));
      return;
    }

    // Show loading
    productGrid.innerHTML = "<p class='loading'>Loading products...</p>";

    const response = await fetch("https://fakestoreapi.com/products");

    if (!response.ok) {
      throw new Error("API Error");
    }

    const data = await response.json();

    // Save to cache
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

// ===============================
// DISPLAY PRODUCTS
// ===============================
function displayProducts(products) {

  productGrid.innerHTML = "";

  const fragment = document.createDocumentFragment();

  products.forEach(product => {

    const { title, price, image, description } = product;

    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${image}" loading="lazy" alt="${title}">
      <h3>${title.substring(0, 25)}...</h3>
      <p class="price">$${price}</p>
      <p class="desc">${description.substring(0, 60)}...</p>
      <button class="add-cart">Add to Cart</button>
    `;

    fragment.appendChild(card);
  });

  productGrid.appendChild(fragment);
}

// ===============================
// ADD TO CART FUNCTIONALITY
// ===============================
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-cart")) {
    cartCount++;
    cartCountEl.textContent = cartCount;
  }
});

// ===============================
// INITIAL CALL
// ===============================
fetchProducts();