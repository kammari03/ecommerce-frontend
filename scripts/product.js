const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const mainImage = document.getElementById("productImage");
const thumbnails = document.querySelectorAll(".thumb");
const imageEl = document.getElementById("productImage");
const titleEl = document.getElementById("productTitle");
const priceEl = document.getElementById("productPrice");
const descEl = document.getElementById("productDesc");

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

function displayProduct(product) {
  imageEl.src = product.image;
  imageEl.alt = product.title;

  titleEl.textContent = product.title;
  priceEl.textContent = `$${product.price}`;
  descEl.textContent = product.description;
}

thumbnails.forEach(thumb => {
  thumb.addEventListener("click", () => {
    mainImage.src = thumb.src;

    thumbnails.forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");
  });
});


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

if (productId) {
  fetchProduct();
} else {
  titleEl.textContent = "Invalid Product";
}

updateCartCount();