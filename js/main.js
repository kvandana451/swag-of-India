/*CHANGE OF FLAG*/
function changeFlag() {
  const formSelect = document.querySelector(".form-select");
  const flagImg = document.querySelector("#flag-img");
  formSelect.addEventListener("change", (e) => {
    console.log(e.target.value);
    if (e.target.value === "India") {
      flagImg.setAttribute("src", "../images/India.png");
      document.getElementById("contact").innerHTML = "9838242424";
    } else if (e.target.value === "Canada") {
      flagImg.setAttribute("src", "../images/CANADA.png");

      flagImg.classList.add("flag");
      document.getElementById("contact").innerHTML = "9876543210";
    } else if (e.target.value === "US") {
      flagImg.setAttribute("src", "../images/US.png");
      flagImg.classList.add("flag");
      document.getElementById("contact").innerHTML = "1234567890";
    } else if (e.target.value === "UAE") {
      flagImg.setAttribute("src", "../images/UAE.png");
      flagImg.classList.add("flag");
      document.getElementById("contact").innerHTML = "9988776655";
    }
  });
}

// Scroll
const mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

/*PRODUCTS HOVER*/
function productsHover() {
  let wishImg = document.querySelectorAll(".wish-img");

  let previewImg = document.querySelectorAll(".preview-img");
  let cartImg = document.querySelectorAll(".cart-img");

  cartImg.forEach((img) => {
    img.onmouseover = () => {
      img.setAttribute("src", "../images/Group 2550.png");
    };
    img.onmouseout = () => {
      img.setAttribute("src", "../images/Group 2551.png");
    };
  });

  previewImg.forEach((img) => {
    img.onmouseover = () => {
      img.setAttribute("src", "../images/Group 2548.png");
    };
    img.onmouseout = () => {
      img.setAttribute("src", "../images/Group 2552.png");
    };
  });

  wishImg.forEach((img) => {
    img.onmouseover = () => {
      img.setAttribute("src", "../images/Group 2549.png");
    };
    img.onmouseout = () => {
      img.setAttribute("src", "../images/Group 2553.png");
    };
  });
}

/*UPDATE WISH AND CART TOTAL VALUE*/

function updateWishTotal() {
  let wishItems = JSON.parse(localStorage.getItem("wishItems"));
  let wishTotal = document.querySelector(".wish-value");
  let val = 0;
  if (wishItems && wishTotal) {
    wishItems.forEach((wishItem) => {
      val += wishItem.qty;
    });
    wishTotal.textContent = val;
  }
}

function updateCartValue() {
  value = 0;
  total = 0;
  const cartValue = document.querySelector(".cart-value");
  const cartTotal = document.querySelector(".cart-total");
  const originalPrice = document.querySelector(".original-price");
  const orderTotal = document.querySelector(".order-total");
  const discountedPrice = document.querySelector(".discounted-price");
  const cart_items = JSON.parse(localStorage.getItem("cart"));
  cart_items.forEach((item) => {
    value += item.qty;
    total += item.price * item.qty * 0.6;
  });

  cartValue.textContent = value;
  cartTotal.textContent = `Rs.${total}`;
  originalPrice.textContent = `Rs.${total / 0.6}`;
  discountedPrice.textContent = `Rs${total / 0.6 - total}`;
  orderTotal.textContent = `Rs.${total}`;
}

const Storage = {
  saveToLocal: function (data, name) {
    localStorage.setItem(`${name}`, JSON.stringify(data));
  },

  getLocalStorage: function (item) {
    return JSON.parse(localStorage.getItem(`${item}`));
  },
};

/*FETCH PRODUCTS AND DISPLAY IT TO THE DOM*/
const Product = {
  wish: [],
  cart: [],
  productsDOM: document.querySelector(".products-display"),
  getProducts: async function () {
    try {
      let response = await fetch("./js/products.json");
      let data = await response.json();
      Storage.saveToLocal(data, "products");
    } catch (err) {
      console.log(err);
    }
  },

  displayProducts: function () {
    const products = Storage.getLocalStorage("products");
    let totalRating = "";
    results = "";
    products.forEach((product) => {
      results += `
      <div class="col-xl-4 col-lg-4 col-12 col-md-6">
        <div class="card mx-auto">
          <img
            src="${product.image}"
            class="card-img-top"
            alt="product-${product.id}"
          />
          <div class="card-body text-center">
            <h5 class="card-title fs-5">${product.title}</h5>
            <p class="card-text fw-bold mb-0">
              Rs.480<span>Rs.1200</span><span>(60% off)</span>
            </p>`;
      for (let i = 0; i < 5; i++) {
        if (i < product.rating) {
          totalRating += `<i class="fas fa-star"></i>`;
        } else {
          totalRating += `<i class="far fa-star"></i>`;
        }
      }
      results += `<div class="stars">${totalRating}<span>${product.rating}/5</span></div>`;
      totalRating = "";
      results += `</div>
          <div class="overlay">
            <button  class="wish-btn" data-id="${product.id}"
              ><img
                src="/images/Group 2553.png"
                alt="fav"
                class="wish-img"
            /></button>
            <a href="product_view.html"
              ><img
                src="/images/Group 2552.png"
                alt="fav"
                class="preview-img"
            /></a>
            <button  class="cart-btn" data-id="${product.id}"
              ><img
                src="/images/Group 2551.png"
                alt="fav"
                class="cart-img"
            /></button>
          </div>
        </div>
      </div>
      `;
      this.productsDOM.innerHTML = results;
      productsHover();
    });
  },

  findProduct: function (products, id) {
    let singleProduct = products.find((item) => item.id === id);
    return singleProduct;
  },

  /*ADD ITEMS TO THE CART*/
  addCart: function () {
    let productItems = Storage.getLocalStorage("products");
    if (productItems) {
      const cartBtn = document.querySelectorAll(".cart-btn");
      cartBtn.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          let id = parseInt(button.dataset.id);
          e.target.parentElement.disabled = true;
          let product = this.findProduct(productItems, id);

          let products = { ...product, qty: 1 };
          this.cart = [...this.cart, products];
          Storage.saveToLocal(this.cart, "cart");
          updateCartValue();
        });
      });
    } else {
      Storage.saveToLocal(this.cart, "cart");
    }
    updateCartValue();
  },
  /*ADD ITEMS TO WISHLIST*/
  addWish: function () {
    const wishItems = Storage.getLocalStorage("products");
    if (wishItems) {
      const wishBtn = document.querySelectorAll(".wish-btn");
      wishBtn.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          let id = parseInt(button.dataset.id);
          console.log(id);
          let product = this.findProduct(wishItems, id);
          let wishItem = { ...product, qty: 1 };
          this.wish = [...this.wish, wishItem];
          Storage.saveToLocal(this.wish, "wishItems");
          updateWishTotal();
          button.disabled = true;
        });
      });
    } else {
      Storage.saveToLocal(this.wish, "wishItems");
    }
    updateWishTotal();
  },

  init: function () {
    this.getProducts();
    this.displayProducts();
    this.addWish();
    this.addCart();
  },
};

/******************** CART PAGE *****************  */
const Cart = {
  cartDisplay: document.querySelector(".cart-display"),

  cartItems: Storage.getLocalStorage("cart"),

  findProduct: function (products, id) {
    let singleProduct = products.find((item) => item.id === id);
    return singleProduct;
  },

  displayCart: function () {
    if (this.cartItems && this.cartItems.length === 0) {
      this.cartDisplay.innerHTML = "Add Items To The Cart";
      this.cartDisplay.classList.add("text-center");
      this.cartDisplay.classList.add("fs-4");
    } else {
      res = "";
      this.cartItems.forEach((item) => {
        res += `
      <div class="cart-container mb-4">
        <div class="cart-product-container">
          <div class="cart-product-img">
            <img src="${item.image}" alt="product-1" />
          </div>
          <div class="cart-product-details py-4 px-4">
            <p class="fw-bold fs-5">${item.title}</p>
            <p class="text-secondary fw-normal my-0">Color: Multicolor</p>
            <p class="text-secondary fw-normal">
              Seller: Indus Valley & co.
            </p>
            <div class="select-container">
              <select id="size-select">
                <option value="">Size:Onesize</option>
                <option value="">S</option>
                <option value="">M</option>
                <option value="">L</option>
                <option value="">XL</option>
                <option value="">XXL</option>
              </select>
              <select id="qty-select" class="mt-2" data-id="${
                item.id
              }" onchange="Cart.updateQuantity()">
                <option >Qty: 1</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <div
            class="cart-product-price d-flex flex-column justify-content-start mx-5 py-4"
          >
            <p class="my-0">
              Rs.<span class="fw-bold">${item.price * item.qty * 0.6}</span
              ><span class="text-decoration-line-through">Rs.${
                item.price * item.qty
              }</span
              ><span class="fw-bold product-discount mx-1"
                >(60% off)</span
              >
            </p>
            <p class="text-secondary">Delivery in 4 - 6 days</p>
          </div>
        </div>
        <div class="cart-bottom-btn d-flex flex-row">
          <a href="" class="fw-bold text-dark mx-3 py-2 remove-cart" data-id=${
            item.id
          }>REMOVE</a>
          <span class="px-3 py-2">|</span>
          <a href="" class="fw-bold text-dark mx-3 py-2" onclick="Cart.cartToWish(${
            item.id
          })">ADD TO WISHLIST</a
          >
        </div>
      </div>
      `;
      });
      this.cartDisplay.innerHTML = res;
      updateWishTotal();
      updateCartValue();
    }
  },

  /*UPDATE CART QUANTITY*/
  updateQuantity: function () {
    const selectQty = document.querySelectorAll("#qty-select");
    let cartItems = Storage.getLocalStorage("cart");

    selectQty.forEach((select) => {
      select.addEventListener("change", (e) => {
        e.preventDefault();
        let id = parseInt(select.dataset.id);
        console.log(id);
        cartItems.map((item) => {
          if (item.id === id) {
            item.qty = parseInt(e.target.value);

            Storage.saveToLocal(cartItems, "cart");
            this.displayCart();

            updateCartValue();
          }
        });
      });
    });
  },

  /*ADD ITEMS FROM CARTPAGE TO WISHLIST PAGE*/

  cartToWish: function (id) {
    let cart = Storage.getLocalStorage("cart");
    let wish = Storage.getLocalStorage("wishItems");

    let singleProduct = this.findProduct(cart, id);
    singleProduct = { ...singleProduct, qty: 1 };

    if (!wish) {
      let wish = [];

      Storage.saveToLocal(wish, "wishItems");
    }
    if (wish && wish !== null) {
      wish = [...wish, singleProduct];

      Storage.saveToLocal(wish, "wishItems");
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
          cart.splice(i, 1);

          Storage.saveToLocal(cart, "cart");
          updateWishTotal();
        }
      }
      this.displayCart();
      updateWishTotal();
    }
  },

  removeCartProduct: function () {
    const removeBtns = document.querySelectorAll(".remove-cart");

    removeBtns.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const id = button.dataset.id;
        const element = e.target.parentElement.parentElement;
        element.classList.add("fade-effect");
        for (let i = 0; i < this.cartItems.length; i++) {
          if (this.cartItems[i].id == id) {
            this.cartItems.splice(i, 1);
            Storage.saveToLocal(this.cartItems, "cart");
            updateCartValue();
          }
          setTimeout(function () {
            element.style.display = "none";
            this.displayCart();
          }, 2000);
        }
      });
    });
  },

  init: function () {
    this.displayCart();
    updateWishTotal();
    this.removeCartProduct();
  },
};

/*DISPLAYING PRODUCTS INTO WISHLIST PAGE*/
const Wish = {
  wishItems: Storage.getLocalStorage("wishItems"),

  findProduct: function (products, id) {
    let singleProduct = products.find((item) => item.id === id);
    return singleProduct;
  },

  displayWish: function () {
    const displayWish = document.querySelector(".wish-product-display");

    let res = "";
    this.wishItems.forEach((item) => {
      res += `<div class="product-image">
      <img src="${item.image}" alt="product3" class="mb-4" />
      <div class="product-info mx-3">
        <p class="product-title fw-bold">${item.title}</p>
        <div class="stars">
          <span>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i> <span>(2850)</span>
          </span>
        </div>

        <p class="product-rate mt-2">
          Rs.${item.price}
          <span>Rs2748.0</span><span>(60% off)</span>
        </p>
        <div class="mt-2">
          <select id="">
            <option>Select Pack Of</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div class="d-flex flex-row mt-3">
          <button class="fw-bold py-2 cartbtn" onclick=(Wish.wishToCart(${item.id}))>ADD TO CART</button>

          <span class="px-3 py-2">|</span>
          <a href="" class="fw-bold text-dark mx-3 py-2 remove-wish" data-id="${item.id}"
            >REMOVE FROM WISHLIST</a
          >
        </div>
      </div>
    </div>
    `;
    });
    displayWish.innerHTML = res;
    updateWishTotal();
  },
  /*ADD PRODUCTS FROM WISH TO CART*/
  wishToCart: function (id) {
    const wishItems = Storage.getLocalStorage("wishItems");

    let cart = Storage.getLocalStorage("cart");
    let singleProduct = this.findProduct(wishItems, id);
    singleProduct = { ...singleProduct, qty: 1 };
    console.log(singleProduct);
    if (!cart) {
      let cart = [];
      Storage.saveToLocal(cart, "cart");
    }
    if (cart && cart !== null) {
      cart = [...cart, singleProduct];
      console.log(cart);
      Storage.saveToLocal(cart, "cart");
      for (let i = 0; i < this.wishItems.length; i++) {
        if (this.wishItems[i].id == id) {
          this.wishItems.splice(i, 1);
          Storage.saveToLocal(this.wishItems, "wishItems");
        }
      }
      this.displayWish();
      updateCartValue();
    }
  },
  /*REMOVE WISH PRODUCT*/

  removeWishProduct: function () {
    const removeWish = document.querySelectorAll(".remove-wish");

    removeWish.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const id = button.dataset.id;
        const element = e.target.parentElement.parentElement.parentElement;
        element.classList.add("fade-effect");
        for (let i = 0; i < this.wishItems.length; i++) {
          if (this.wishItems[i].id == id) {
            this.wishItems.splice(i, 1);
            Storage.saveToLocal(this.wishItems, "wishItems");
            updateWishTotal();
          }
          setTimeout(function () {
            element.style.display = "none";
            this.displayWish();
          }, 2000);
        }
      });
    });
  },
  init: function () {
    this.displayWish();
    this.removeWishProduct();
    updateCartValue();
  },
};

const Edit_profile = {
  getUserInfo: function () {
    let user = [];
    const male = document.querySelector(".male");
    const female = document.querySelector(".female");

    let maleVal = "";
    let femaleVal = "";

    male.addEventListener("click", (e) => {
      console.log(e.target);
      female.innerHTML = "Female";
      male.innerHTML = `<i class="fas fa-check"></i>Male`;
      maleVal = "male";
    });

    female.addEventListener("click", () => {
      male.innerHTML = "Male";
      female.innerHTML = `<i class="fas fa-check"></i>Female`;
      femaleVal = "female";
    });
    const saveBtn = document.getElementById("save-btn");

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const mobileNum = document.getElementById("mobileNo").value || 1234567890;
      const fullName =
        document.getElementById("fullName").value || "Mark Mathews";
      const email =
        document.getElementById("email").value || "markmathew@gmail.com";
      const male = document.getElementsByClassName("male")[0].innerHTML;
      const female = document.getElementsByClassName("female")[0].innerHTML;
      const gender = male[0] === "<" ? "male" : "female";
      const date = document.getElementById("date").value || "-not added-";
      const user_location =
        document.getElementById("location").value || "-not added-";
      const altNum = document.getElementById("altNum").value || "987654321";
      const nickName = document.getElementById("nickName").value || "Mark";

      user = [
        ...user,
        mobileNum,
        fullName,
        email,
        gender,
        date,
        user_location,
        altNum,
        nickName,
      ];
      Storage.saveToLocal(user, "user");
      location.href = "/html/my_profile.html";
    });
  },

  populateForm: function () {
    const user = Storage.getLocalStorage("user");
    if (user) {
      document.getElementById("mobileNo").value = user[0];
      document.getElementById("fullName").value = user[1];
      document.getElementById("email").value = user[2];
      document.getElementById("date").value = user[4];
      document.getElementById("location").value = user[5];
      document.getElementById("altNum").value = user[6];
      document.getElementById("nickName").value = user[7];
    } else {
      document.getElementById("mobileNo").value = 1234567890;
      document.getElementById("fullName").value = "Mark Mathews";
      document.getElementById("email").value = "markmathew@gmail.com";
      document.getElementById("date").value = "-not added-";
      document.getElementById("location").value = "-not added-";
      document.getElementById("altNum").value = 987654321;
      document.getElementById("nickName").value = "Mark";
    }
  },

  init: function () {
    this.getUserInfo();
    this.populateForm();
  },
};

const Profile = {
  populateProfile: function () {
    const gender = document.querySelector(".gender");
    const mobileNumber = document.querySelector(".mobile-num");
    const fullName = document.querySelector(".full-name");
    const email = document.querySelector(".email");
    const dob = document.querySelector(".dob");
    const location_user = document.querySelector(".location_user");
    const altNumber = document.querySelector(".altNumber");
    const nickName = document.querySelector(".nickName");

    const userInfo = Storage.getLocalStorage("user");
    if (userInfo) {
      mobileNumber.innerHTML = userInfo[0];
      fullName.innerHTML = userInfo[1];
      email.innerHTML = userInfo[2];
      gender.innerHTML = userInfo[3];
      dob.innerHTML = userInfo[4];
      location_user.innerHTML = userInfo[5];
      altNumber.innerHTML = userInfo[6];
      nickName.innerHTML = userInfo[7];
    }
  },
  init: function () {
    this.populateProfile();
  },
};

switch (document.location.pathname) {
  case "/index.html":
    changeFlag();
    productsHover();
    Product.init();

  case "/categories.html":
    changeFlag();
    productsHover();
    Product.addWish();
    updateWishTotal();
    Product.addCart();
    updateCartValue();

  case "/cart.html":
    changeFlag();
    Cart.init();

  case "/wish.html":
    changeFlag();
    Wish.init();

  case "/edit_profile.html":
    changeFlag();
    Edit_profile.init();

  case "/my_profile.html":
    changeFlag();
    Profile.init();

  case "/my_orders.html":
    updateWishTotal();
    updateCartValue();
    changeFlag();

  case "/track_order_details.html":
    updateWishTotal();
    updateCartValue();
    changeFlag();

  case "/track_order.html":
    updateWishTotal();
    updateCartValue();
    changeFlag();

  case "/return_order.html":
    updateWishTotal();
    updateCartValue();
    changeFlag();

  default:
    updateCartValue();
    updateWishTotal();
}
