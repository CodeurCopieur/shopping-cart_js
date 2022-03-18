// variables

const cartBtn = document.querySelector('.cart-btn'); // bouton cart open
const closeCart = document.querySelector('.close-cart'); // bouton cart close
const clearCart = document.querySelector('.clear-cart'); // bouton clear cart open
const cartOverlay = document.querySelector('.cart-overlay'); //  add class transparentBcg (panier)
const cartDOM = document.querySelector('.cart'); // child (panier) add class showCart
const cartItems = document.querySelector('.cart-items'); // cart item (panier)
const cartTotal = document.querySelector('.cart-total'); // total price item (panier)
const cartContent = document.querySelector('.cart-content'); // container cart item (panier)
const productsDOM = document.querySelector('.products-center'); // container product

// panier
let cart = [];
// buttons
let buttonDOM = [];

// obtenir les produits
class Products {
  async getProducts() {
    try {

      let result = await fetch('./products.json')
      let data = await result.json()

      let products = data.items;
      products = products.map( item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return {title, price, id, image}
      })

      return products

    } catch (error) {
      console.log(error);
    }
  }
}

// afficher les produits
class UI {
  displayProducts(products) {
    let result = '';
    products.forEach( product => {
      result += `
        <!-- single products -->
        <article class="product">
          <div class="img-container">
            <img src=${product.image}
            alt="Product" 
            class="product-img">
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>${product.price}€</h4>
        </article>
        <!-- single products -->
      `
    });

    productsDOM.innerHTML = result;
  }

  getBagButtons() { 
    const buttons = [...document.querySelectorAll('.bag-btn')];

    buttonDOM = buttons;
    
    buttons.forEach( btn => {
      let id = btn.dataset.id;
      let inCart = cart.find( item => item.id === id);

      if(inCart) {
        btn.textContent = "Dans le panier";
        btn.disabled = true;
      } 

      btn.addEventListener('click', event => {
          
        const { target } = event;
        target.innerText = "Dans le panier";
        target.disabled = true;

        // obtenir un produit à partir de produits
        let cartItem = {...Storage.getProduct(id), amount: 1};

        // ajouter le produit au panier
        cart = [...cart, cartItem];
        // enregistrer le panier dans le stockage local
        Storage.saveCart(cart);
        // définir les valeurs du panier
        this.setCartValues(cart);
        // afficher l'article du panier
        this.addCartItem(cartItem)
        // montrer le panier

      });
    })
  }
  
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map( item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    })

    cartTotal.textContent = parseFloat(tempTotal.toFixed(2));
    cartItems.textContent = itemsTotal;

    console.log(cartTotal, cartItems);
  }

  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-items');
    div.innerHTML = `
      <img src=${item.image} alt="product">
      <div>
        <h4>${item.title}</h4>
        <h5>${item.price}€</h5>
        <span class="remove-item" data-id=${item.id}>
          <i class="fa-solid fa-trash"></i>
        </span>
      </div>

      <div>
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
      </div>
    `;

    cartContent.appendChild(div);
  }
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find( product => product.id === id );
  }

  static saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart))
  }

}

document.addEventListener('DOMContentLoaded', ()=> {
  const ui = new UI();
  const products = new Products();
  // obtenir tous les produits
 products.getProducts().then( products => {
  ui.displayProducts( products)
  Storage.saveProducts(products);
 }).then(() =>{
   ui.getBagButtons()
 });
 
})