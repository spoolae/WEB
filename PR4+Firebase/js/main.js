"use strict";
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js";

const modalAuth = document.querySelector(".modal_auth");
const loginBut = document.querySelector(".login_but");
const loginForm = document.querySelector("#login_form");
const logInInput = document.querySelector("#user_name");
const passwordInput = document.querySelector("#password");
const logOutBut = document.querySelector(".logout_but");
const userName = document.querySelector(".user_name");
const closeBut = document.querySelector(".modal_close");
const closeButCart = document.querySelector(".modal_close_cart");
const errorMessage = document.querySelector(".error");
const rCards = document.querySelector(".r_cards");
const foodSection = document.querySelector(".food");
const swiper = document.querySelector(".swiper");
const logo = document.querySelector(".logo_pic");
const foodCards = document.querySelector(".food_cards");
const foodHeading = document.querySelector(".food_heading");
const restSearch = document.querySelector(".rest_search");
const cartBut = document.querySelector(".cart_but");
const modalCart = document.querySelector(".modal_cart");
const cancelButCart = document.querySelector(".cancel_but");
const modalProducts = document.querySelector(".modal_products");
const modalTotal = document.querySelector(".modal_total");
const orderBut = document.querySelector(".order_but");
let login = localStorage.getItem("login");

const cart = [];

const getData = async function (url) {
  const response = await fetch(url);
  if (!response) {
    throw new Error(`Error at url: ${url} status 404,
    ${response.status}!`);
  }
  return await response.json();
};




  
function toggleModalAuth() {
  modalAuth.classList.toggle("is_open");
  if (modalAuth.classList.contains("is_open")) {
    document.body.style.cssText = `
      position: relative;
      overflow: hidden;
      height:100vh;
      `;
  } else {
    document.body.style.cssText = ``;
  }
}

function toggleModalCart() {
  modalCart.classList.toggle("is_open");
  if (modalCart.classList.contains("is_open")) {
    closeButCart.addEventListener("click", toggleModalCart);
   
    document.body.style.cssText = `
      position: relative;
      overflow: hidden;
      height:100vh;
      `;
  } else {
    document.body.style.cssText = ``;
    closeButCart.removeEventListener("click", toggleModalCart);
    

  }
}

function authorized() {
  console.log("Authorized");

  function logOut() {
    login = null;
    localStorage.removeItem("login");
    loginBut.style.display = "";
    cartBut.style.display = "";
    logOutBut.style.display = "";
    userName.style.display = "";
    logOutBut.removeEventListener("click", logOut);
    checkAuth();
  }
  loginBut.style.display = "none";
  logOutBut.style.display = "flex";
  cartBut.style.display = "flex";
  userName.style.display = "block";
  userName.textContent = login;
  logOutBut.addEventListener("click", logOut);
  rCards.removeEventListener("click", toggleModalAuth);
  rCards.addEventListener("click", OpenProducts);
}

function notAuthorized() {
  console.log("Not Authorized");

  function logIn(event) {
    event.preventDefault();
    if (logInInput.value && passwordInput.value) {
      errorMessage.textContent = "*";
      logInInput.classList.remove("red_border");
      passwordInput.classList.remove("red_border");
      login = logInInput.value;
      localStorage.setItem("login", login);
      modalAuth.classList.remove("is_open");
      document.body.style.cssText = ``;
      loginBut.removeEventListener("click", toggleModalAuth);
      closeBut.removeEventListener("click", toggleModalAuth);
      loginForm.removeEventListener("submit", logIn);
      loginForm.reset();
      checkAuth();
    } else if (logInInput.value === "") {
      passwordInput.classList.remove("red_border");
      errorMessage.textContent = "Введите логин";
      logInInput.classList.add("red_border");
    } else if (passwordInput.value === "") {
      logInInput.classList.remove("red_border");
      errorMessage.textContent = "Введите пароль";
      passwordInput.classList.add("red_border");
    }
  }
  loginBut.addEventListener("click", toggleModalAuth);
  closeBut.addEventListener("click", toggleModalAuth);
  loginForm.addEventListener("submit", logIn);
  modalAuth.addEventListener("click", (event) => {
    if (event.target.classList.contains("is_open")) {
      toggleModalAuth();
    }
  });

  rCards.removeEventListener("click", OpenProducts);
  rCards.addEventListener("click", toggleModalAuth);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function CreateRestaurantCard({
  image,
  kitchen,
  name,
  price,
  products,
  stars,
  time_of_delivery: timeOfDelivery,
}) {
  const card = `
          <div class="r_card" data-products='${JSON.stringify(products)}'
          data-rest-name="${name}"
          data-rest-stars="${stars}"
          data-rest-price="${price}"
          data-rest-kitchen="${kitchen}">
            <img src="${image}" alt="pizza" />
            <div class="card_caption">
              <div class="child_cap top_cap">
                <p class="card_name">${name}</p>
                <p class="card_time">${timeOfDelivery} мин</p>
              </div>
              <div class="child_cap bottom_cap">
                <p class="card_rating">${stars}</p>
                <p class="pr_cat card_price">От ${price} ₴</p>
                <p class="pr_cat card_category">${kitchen}</p>
              </div>
            </div>
          </div>
  `;
  rCards.insertAdjacentHTML("afterbegin", card);
}

function CreateProductCard({ id, name, description, price, image }) {
  const card = `
   <div class="food_card wow fadeInUp" data-wow-delay="0.2s">
            <img
              src="${image}"
              alt="food"
              class="food_card_img"
            />
            <div class="food_card_caption">
              <p class="food_card_name">${name}</p>
              <p class="food_card_text">
                ${description}
              </p>
              <button class="food_card_button add_to_cart" id ="${id}">В корзину</button>
              <span class="food_card_price">${price} ₴</span>
            </div>
    </div>
  `;
  foodCards.insertAdjacentHTML("afterbegin", card);
}

function CreateProductHeading({ name, stars, price, kitchen }) {
  const heading = `

          <div class="food_heading_title">
            <h1 class="food_title">${name}</h1>
            <span class="food_rating">${stars}</span>
          </div>
          <div class="food_heading_wrap">
            <p class="food_heading_text food_price">От ${price} ₴</p>
            <p class="food_heading_text food_category">${kitchen}</p>
          </div>

  `;
  foodHeading.insertAdjacentHTML("afterbegin", heading);
}

function OpenProducts(event) {
  const restaurant = event.target.closest(".r_card");
  if (restaurant) {
    swiper.classList.add("hide");
    rCards.classList.add("hide");
    foodSection.classList.remove("hide");
    foodCards.textContent = "";
    foodHeading.textContent = "";
    const restInfo = {
      name: restaurant.dataset.restName,
      stars: restaurant.dataset.restStars,
      price: restaurant.dataset.restPrice,
      kitchen: restaurant.dataset.restKitchen,
    };
    const products = JSON.parse(restaurant.dataset.products);
    products.forEach(product=>CreateProductCard(product));
    

      

    CreateProductHeading(restInfo);
    logo.addEventListener("click", () => {
      swiper.classList.remove("hide");
      rCards.classList.remove("hide");
      foodSection.classList.add("hide");
    });
  }
}

function addToCart(e) {
  const buttonAddToCart = e.target.closest(".add_to_cart");
  if (buttonAddToCart) {
    const card = buttonAddToCart.closest(".food_card");
    const title = card.querySelector(".food_card_name").textContent;
    const cost = card.querySelector(".food_card_price").textContent;
    const id = buttonAddToCart.id;
    const food = cart.find((x) => x.id === id);
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        title,
        cost,
        id,
        count: 1,
      });
    }
    localStorage.setItem("cart",JSON.stringify(cart));
  }
}

function renderCart(){
  const localCart = JSON.parse(localStorage.getItem("cart"));
  modalProducts.textContent ='';
  modalTotal.textContent ='';
  localCart.forEach(function(item){
    const product = `
         <div class="modal_product">
            <p class="modal_product_name">${item.title}</p>
            <p class="modal_product_price">${item.cost}</p>
            <div class="modal_product_quntity_wrap">
              <button class="modal_but counter_but reduce_quantity"  data-id = "${item.id}">-</button>
              <div class="modal_product_quantity">${item.count}</div>
              <button class="modal_but counter_but increase_quantity" data-id = "${item.id}">+</button>
            </div>
          </div>`;
    modalProducts.insertAdjacentHTML("afterbegin", product);
  })
  const totalPrice =localCart.reduce(function(result,item){
    return result+(parseFloat(item.cost))*item.count;
  },0)
  modalTotal.textContent = `${totalPrice}₴`;
  
 
}

function changeCount(event){
  const target = event.target;
   const localCart = JSON.parse(localStorage.getItem("cart"));
  if (target.classList.contains("counter_but")){
    const food = localCart.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains("reduce_quantity")) if(food.count > 0 ) food.count--;
    if (food.count === 0){
      localCart.splice(localCart.indexOf(food), 1);
    }
    if (target.classList.contains("increase_quantity")) food.count++;
    localStorage.setItem("cart", JSON.stringify(localCart));
    renderCart();
  }

}



function init() {
  new Swiper(".swiper", {
    sliderPerView: 1,
    loop: true,
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
    },
  });

  new WOW().init();
  checkAuth();

  getData(
    "https://delivery-food-f17c4-default-rtdb.europe-west1.firebasedatabase.app/partners.json"
  ).then((data) => {
    // console.log(data[0].products);
    // for(let i = 0;i<data.length;i++){
    //   CreateRestaurantCard(data[i]);
    // }
    data.forEach(CreateRestaurantCard);

  });

  restSearch.addEventListener("keypress", function (event) {
    if (event.charCode === 13) {
      const value = event.target.value.trim();
      if (!value) {
        event.target.style.backgroundColor = "red";
        event.target.value = "";
        setTimeout(function () {
          event.target.style.backgroundColor = "";
        }, 1000);
        return;
      }
      getData(
        "https://delivery-food-f17c4-default-rtdb.europe-west1.firebasedatabase.app/partners.json"
      )
        .then(function (data) {
          return data.map(function (partner) {
            return partner.products;
          });
        })
        .then(function (linksProduct) {
          foodCards.textContent = "";
          linksProduct.forEach(function (link) {
              const resultSearch = link.filter(function (item) {
                const name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              });
              swiper.classList.add("hide");
              rCards.classList.add("hide");
              foodSection.classList.remove("hide");
              foodHeading.textContent = "";
              resultSearch.forEach(CreateProductCard);
              logo.addEventListener("click", () => {
                swiper.classList.remove("hide");
                rCards.classList.remove("hide");
                foodSection.classList.add("hide");
                event.target.value = "";
              });
          });
        });
    }
  });
  
  cartBut.addEventListener("click", () => {
     
      if(localStorage.getItem("cart")){
         renderCart();
         toggleModalCart();
      }else{
        alert("Корзина пуста")
      }
      
    });
    
  cancelButCart.addEventListener("click", ()=>{
    cart.length = 0;
    localStorage.removeItem("cart");
    toggleModalCart();

  });
  orderBut.addEventListener("click", ()=>{
    const products = JSON.parse(localStorage.getItem("cart"));
    const user = localStorage.getItem("login");
    const order = { user, products };
    cart.length = 0;
    localStorage.removeItem("cart");
    toggleModalCart();
   
    try{
      axios.post(
        "https://delivery-food-f17c4-default-rtdb.europe-west1.firebasedatabase.app/orders.json",
        JSON.stringify(order)
      );
      alert("Ваш заказ успешно принят");
    }catch{
      alert("Ошибка")
    }
    
  });
 
  modalCart.addEventListener("click", changeCount);
  foodSection.addEventListener("click", addToCart);
}

init();
