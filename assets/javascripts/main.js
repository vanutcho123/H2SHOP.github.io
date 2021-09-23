// Cart Over-lay
const cartBtn = document.querySelector('.btn-item:last-child');
const closeCart = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsMaleDOM = document.querySelector('#male .row');
const cartOverlay = document.querySelector('.cart-overlay');
//


let cart = [];

//button
let buttonsDOM = [];
//
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.productsMale;
            products = products.map(item => {
                const id = item.id;
                const classify = item.classify;
                const name = item.name;
                const pricePresent = item.pricePresent;
                const priceSale = item.priceSale;
                const image = item.image;
                const persent = item.persent;
                return { id, classify, name, pricePresent, priceSale, image, persent }
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}
//displayproducts
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result +=
                `
                <div class ="col l-3 m-4 c-6" data-aos="fade-right">
                    <div class="content-product">
                        <a href="#">
                            <img src=${product.image} alt="" class="product-img">
                        </a>
                        <div class="product-classify">${product.classify}</div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">
                            <div class="price-present">${product.pricePresent} </span>$</span></div>
                            <div class="price-sale">${product.priceSale} </span>$</span></div>
                        </div>
                        <button class="product-bag-btn" data-id= ${product.id}>
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                        <div class="product-persent">${product.persent}</div>
                    </div>
                </div>
            `;
        });
        productsMaleDOM.innerHTML = result;
    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".product-bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.disabled = true;
            }
            button.addEventListener('click', (event) => {
                event.target.disabled = true;

                //get product from products
                let cartItem = {...Storage.getProduct(id), amount: 1 };


                //add  product to cart

                cart = [...cart, cartItem];
                //save product in local storage
                Storage.saveCart(cart);
                //set cart values
                this.setCartValues(cart);
                //display cart item

                this.addCartItem(cartItem);
                //show the cart

                // this.showCart();

            });
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.priceSale * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML +=
            `
            <img src=${item.image}>
            <div>
                <h4>${item.name}</h4>
                <h5>${item.priceSale} </span>$</span></h5>
                <i class="remove-item far fa-times-circle" data-id = ${item.id}></i>
            </div>

            <div>
                <i class="fas fa-chevron-up" data-id = ${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id = ${item.id}></i>
            </div>
        `;
        cartContent.appendChild(div);
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCart.addEventListener('click', this.hideCart);
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart")
    }
    cartLogic() {
        //clear cart button
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });

        //cart functionality
        cartContent.addEventListener("click", event => {
            if (event.target.classList.contains("remove-item")) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount += 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount -= 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));

        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0])
        }
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.innerHTML =
            `
            <i class="fas fa-shopping-bag"></i> 
         `;
    }

    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
//class local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id)
    }
    static saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // setup APP
    ui.setupAPP();

    //get all products

    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });
});