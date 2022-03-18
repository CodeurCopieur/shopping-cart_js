// variables

const cartBtn = document.querySelector('.cart-btn'); // bouton cart open
const closeCart = document.querySelector('.close-cart'); // bouton cart close
const clearCart = document.querySelector('.clear-cart'); // bouton clear cart open
const cartOverlay = document.querySelector('.cart-overlay'); //  add class transparentBcg (panier)
const cartDOM = document.querySelector('.cart'); // child (panier) add class showCart
const cartItem = document.querySelector('.cart-item'); // cart item (panier)
const cartTotal = document.querySelector('.cart-total'); // total price item (panier)
const cartContent = document.querySelector('.cart-content'); // container cart item (panier)
const productsDOM = document.querySelector('.products-center'); // container product

// panier
let cart = [];

// obtenir les produits
class Products {
  async getProducts() {
    try {

      let result = await fetch('./products.json')
      let data = await result.json()
      //return data;
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
    console.log(products, ':)');
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
}

// local storage
class Storage {

}

document.addEventListener('DOMContentLoaded', ()=> {
  const ui = new UI();
  const products = new Products();
  // obtenir tous les produits
 products.getProducts().then( products => ui.displayProducts( products))
  
})