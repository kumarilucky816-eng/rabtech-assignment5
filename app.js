let allProducts = [];
let currentCategory = "all";
let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
} catch (e) {
  cart = [];
}

const productsEl = document.getElementById("products");
const tabsEl = document.getElementById("tabs");
const errorEl = document.getElementById("error");
const searchEl = document.getElementById("search");
const sortEl = document.getElementById("sort");
const cartCountEl = document.getElementById("cartCount");

function showSkeleton() {
  productsEl.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    productsEl.innerHTML += '<div class="skeleton"></div>';
  }
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
}

function hideError() {
  errorEl.classList.add("hidden");
}

function renderTabs(categories) {
  tabsEl.innerHTML = "";
  const list = ["all"].concat(categories);
  list.forEach(function (cat) {
    const btn = document.createElement("button");
    btn.className = "tab" + (cat === currentCategory ? " active" : "");
    btn.textContent = cat;
    btn.onclick = function () {
      currentCategory = cat;
      renderTabs(categories);
      renderProducts();
    };
    tabsEl.appendChild(btn);
  });
}

function getFilteredProducts() {
  let list = allProducts.slice();

  if (currentCategory !== "all") {
    list = list.filter(function (p) {
      return p.category === currentCategory;
    });
  }

  const text = searchEl.value.toLowerCase();
  if (text) {
    list = list.filter(function (p) {
      return p.title.toLowerCase().includes(text);
    });
  }

  if (sortEl.value === "low") {
    list.sort(function (a, b) { return a.price - b.price; });
  } else if (sortEl.value === "high") {
    list.sort(function (a, b) { return b.price - a.price; });
  }

  return list;
}

function renderProducts() {
  const list = getFilteredProducts();
  productsEl.innerHTML = "";

  if (list.length === 0) {
    productsEl.innerHTML = "<p>No products found</p>";
    return;
  }

  list.forEach(function (p) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      '<img src="' + p.image + '" alt="">' +
      "<h3>" + p.title + "</h3>" +
      "<p>$" + p.price + "</p>" +
      '<button onclick="addToCart(' + p.id + ')">Add to Cart</button>';
    productsEl.appendChild(card);
  });
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCountEl.textContent = cart.length;
}

function addToCart(id) {
  const product = allProducts.find(function (p) { return p.id === id; });
  cart.push(product);
  saveCart();
}

async function init() {
  showSkeleton();
  hideError();
  try {
    const results = await Promise.all([fetchProducts(), fetchCategories()]);
    allProducts = results[0];
    renderTabs(results[1]);
    renderProducts();
  } catch (err) {
    productsEl.innerHTML = "";
    showError("Kuch gadbad ho gayi: " + err.message);
  }
}

searchEl.addEventListener("input", renderProducts);
sortEl.addEventListener("change", renderProducts);

cartCountEl.textContent = cart.length;
init();