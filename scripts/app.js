const productGrid = document.getElementById("productGrid");
const cartCountEl = document.querySelector(".cart-count");
const hamburger = document.querySelector(".Hambg");
const nav = document.querySelector(".nav-bar");

let cartCount = 0;


hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
});

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


function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.length;

  const cartEl = document.querySelector(".cart-count");
  if (cartEl) cartEl.textContent = count;
}


document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-cart")) {
    cartCount++;
    cartCountEl.textContent = cartCount;
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-cart")) {

    const card = e.target.closest(".product-card");

    const title = card.querySelector("h3").textContent;
    const price = card.querySelector(".price").textContent;
    const image = card.querySelector("img").src;

    const product = { title, price, image };

    const cart = getCart();
    cart.push(product);
    saveCart(cart);

    updateCartCount();
  }
});

updateCartCount();
fetchProducts();