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
      let data = result.json()
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

// afficher les produits
class UI {

}

// local storage
class Storage {

}

document.addEventListener('DOMContentLoaded', ()=> {
  const ui = new UI();
  const products = new Products();

 products.getProducts().then( data => console.log(data))
  
})