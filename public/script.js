let cart = [];

const WHATSAPP_NUMBER = "50940217685";

function addToCart(name, price) {
  cart.push({
    name: name,
    price: price
  });

  updateCart();

  alert("✅ " + name + " ajoute nan panier!");
}

function updateCart() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartCount.textContent = cart.length;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Panier la vid.</p>";
    cartTotal.textContent = "$0";
    return;
  }

  let total = 0;

  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");

    div.innerHTML = `
      <p>
        📱 ${item.name} -
        <strong>$${item.price}</strong>
        <button onclick="removeFromCart(${index})">
          ❌
        </button>
      </p>
      <hr>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.textContent = "$" + total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function openCart() {
  document.getElementById("cart-modal").style.display = "block";
  updateCart();
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
}

function orderWhatsApp(name, price) {
  const message =
    "Bonjou, mwen vle kòmande telefòn sa a:%0A%0A" +
    "📱 Telefòn: " + name + "%0A" +
    "💰 Pri: $" + price;

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    message;

  window.open(url, "_blank");
}

function checkout() {
  if (cart.length === 0) {
    alert("🛒 Panier la vid.");
    return;
  }

  let message = "Bonjou, mwen vle fè yon kòmann:%0A%0A";
  let total = 0;

  cart.forEach((item, index) => {
    message +=
      (index + 1) +
      ". 📱 " +
      item.name +
      " - $" +
      item.price +
      "%0A";

    total += item.price;
  });

  message += "%0A💰 Total: $" + total;

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    message;

  window.open(url, "_blank");
}

updateCart();
async function loadProducts() {
  const productsList = document.getElementById("products-list");

  try {
    const response = await fetch("/api/products");
    const data = await response.json();

    if (!data.success) {
      throw new Error("Pwodwi yo pa disponib.");
    }

    productsList.innerHTML = "";

    if (data.products.length === 0) {
      productsList.innerHTML =
        "<p>📦 Pa gen telefòn disponib kounye a.</p>";
      return;
    }

    data.products.forEach((product) => {
      const card = document.createElement("div");

      card.className = "product-card";

      card.innerHTML = `
        <div class="product-image">
          📱
        </div>

        <h3>${product.name}</h3>

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
          onclick="addToCart('${product.name}', ${product.price})"
        >
          🛒 Mete nan panier
        </button>

        <button
          class="whatsapp-button"
          onclick="orderWhatsApp('${product.name}', ${product.price})"
        >
          💬 Kòmande sou WhatsApp
        </button>
      `;

      productsList.appendChild(card);
    });

  } catch (error) {
    console.error(error);

    productsList.innerHTML =
      "<p>❌ Nou pa kapab chaje telefòn yo.</p>";
  }
}

loadProducts();