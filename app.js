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
              add to cart 
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>${product.price}€</h4>
        </article>
        <!-- single products -->
      `
    });

    productsDOM.insertAdjacentHTML('beforeend', result)
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
        this.showCart();
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

    // prix total du panier
    cartTotal.textContent = parseFloat(tempTotal.toFixed(2));
    // nombre total d'items dans le panier
    cartItems.textContent = itemsTotal;

  }

  addCartItem(item) {
    const article = document.createElement('article');
    article.classList.add('cart-item');
    article.innerHTML = `
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

    // insérer article dans l'élément .cart-content
    cartContent.insertAdjacentElement('beforeend', article)
  }

  showCart() {
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
  }

  hideCart() {
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
  }

  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populatedCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCart.addEventListener('click', this.hideCart);
  }

  populatedCart(cart) {
    cart.forEach( item => {
      this.addCartItem(item);
    })
  }

  cartLogic() {
    // vider le panier au click sur le bouton .cart-btn
    clearCart.addEventListener('click', () => {
      this.clearCart();
    });
  }

  clearCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach( id => this.removeItem(id));

    console.log(cartContent.children);

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0])
    }

    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter( item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>
    add to cart `;
  }

  getSingleButton(id) {
    return buttonDOM.find( btn => btn.dataset.id === id)
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

  static getCart() {
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  }

}

document.addEventListener('DOMContentLoaded', ()=> {
  const ui = new UI();
  const products = new Products();
  // setup app
  ui.setupApp();
  // obtenir tous les produits
  products.getProducts().then( products => {
    // afficher les produit dans l'élément .products-center
    ui.displayProducts( products)
    Storage.saveProducts(products);
  }).then(() =>{
    // fonctionnalité sur les boutons(event : click), verifier si le produit est dans le panier
    ui.getBagButtons();
    ui.cartLogic();
  });
 
})