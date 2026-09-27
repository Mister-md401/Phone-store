let cart = [];
let allProducts = [];

const WHATSAPP_NUMBER = "50940217685";

/* =========================
   CHARGE PRODUITS
========================= */

async function loadProducts() {

  const productsList =
    document.getElementById("products-list");

  try {

    const response =
      await fetch("/api/products");

    const data =
      await response.json();

    if (!data.success) {
      throw new Error("Pwodwi yo pa disponib.");
    }

    allProducts = data.products;

    createBrandFilter();

    displayProducts(allProducts);

  } catch (error) {

    console.error(error);

    productsList.innerHTML =
      "<p>❌ Nou pa kapab chaje telefòn yo.</p>";
  }
}


/* =========================
   FILTRE MAK
========================= */

function createBrandFilter() {

  const filter =
    document.getElementById("brand-filter");

  const brands = [
    ...new Set(
      allProducts.map(
        product => product.brand
      )
    )
  ];

  brands.sort();

  brands.forEach(brand => {

    const option =
      document.createElement("option");

    option.value = brand;
    option.textContent = brand;

    filter.appendChild(option);

  });
}


/* =========================
   MONTRE PRODUITS
========================= */

function displayProducts(products) {

  const productsList =
    document.getElementById("products-list");

  productsList.innerHTML = "";

  if (products.length === 0) {

    productsList.innerHTML =
      "<p>🔎 Pa gen telefòn ki koresponn.</p>";

    return;
  }

  products.forEach(product => {

    const card =
      document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

      <div class="product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
          onerror="this.style.display='none'"
        >

      </div>

      <h3>
        ${product.name}
      </h3>

      <p class="description">
        ${product.brand} • ${product.storage}
      </p>

      <p class="description">
        📦 Stock: ${product.stock}
      </p>

      <p class="price">
        $${product.price}
      </p>

      <button
        onclick="addToCart(
          '${product.name}',
          ${product.price}
        )"
      >
        🛒 Mete nan panier
      </button>

      <button
        class="whatsapp-button"
        onclick="orderWhatsApp(
          '${product.name}',
          ${product.price}
        )"
      >
        💬 Kòmande sou WhatsApp
      </button>

    `;

    productsList.appendChild(card);

  });
}


/* =========================
   RECHÈCH + FILTRE
========================= */

function filterProducts() {

  const search =
    document
      .getElementById("search-input")
      .value
      .toLowerCase();

  const brand =
    document
      .getElementById("brand-filter")
      .value;

  const filtered =
    allProducts.filter(product => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search) ||

        product.brand
          .toLowerCase()
          .includes(search);

      const matchesBrand =
        brand === "all" ||
        product.brand === brand;

      return (
        matchesSearch &&
        matchesBrand
      );

    });

  displayProducts(filtered);
}


/* =========================
   PANIER
========================= */

function addToCart(name, price) {

  cart.push({
    name: name,
    price: price
  });

  updateCart();

  alert(
    "✅ " +
    name +
    " ajoute nan panier!"
  );
}


function updateCart() {

  const cartCount =
    document.getElementById("cart-count");

  const cartItems =
    document.getElementById("cart-items");

  const cartTotal =
    document.getElementById("cart-total");

  cartCount.textContent =
    cart.length;

  if (cart.length === 0) {

    cartItems.innerHTML =
      "<p>Panier la vid.</p>";

    cartTotal.textContent =
      "$0";

    return;
  }

  let total = 0;

  cartItems.innerHTML = "";

  cart.forEach((item, index) => {

    total += item.price;

    const div =
      document.createElement("div");

    div.innerHTML = `

      <p>
        📱 ${item.name}
        -
        <strong>
          $${item.price}
        </strong>

        <button
          onclick="removeFromCart(${index})"
        >
          ❌
        </button>

      </p>

      <hr>

    `;

    cartItems.appendChild(div);

  });

  cartTotal.textContent =
    "$" + total;
}


function removeFromCart(index) {

  cart.splice(index, 1);

  updateCart();
}


function openCart() {

  document.getElementById(
    "cart-modal"
  ).style.display = "block";

  updateCart();
}


function closeCart() {

  document.getElementById(
    "cart-modal"
  ).style.display = "none";
}


/* =========================
   WHATSAPP
========================= */

function orderWhatsApp(
  name,
  price
) {

  const message =
    "Bonjou, mwen vle kòmande:%0A%0A" +

    "📱 Telefòn: " +
    name +
    "%0A" +

    "💰 Pri: $" +
    price;

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    message;

  window.open(
    url,
    "_blank"
  );
}


function checkout() {

  if (cart.length === 0) {

    alert(
      "🛒 Panier la vid."
    );

    return;
  }

  let message =
    "Bonjou, mwen vle fè yon kòmann:%0A%0A";

  let total = 0;

  cart.forEach(
    (item, index) => {

      message +=
        (index + 1) +
        ". 📱 " +
        item.name +
        " - $" +
        item.price +
        "%0A";

      total += item.price;

    }
  );

  message +=
    "%0A💰 Total: $" +
    total;

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    message;

  window.open(
    url,
    "_blank"
  );
}


/* =========================
   SCROLL
========================= */

function scrollToProducts() {

  document
    .getElementById("products")
    .scrollIntoView({
      behavior: "smooth"
    });
}


/* =========================
   EVENT LISTENERS
========================= */

document
  .getElementById("search-input")
  .addEventListener(
    "input",
    filterProducts
  );


document
  .getElementById("brand-filter")
  .addEventListener(
    "change",
    filterProducts
);


/* =========================
   START
========================= */

updateCart();

loadProducts();