function getProducts(cb) {
    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => cb(data.products));
}

const cart = [];

function addToCart(product) {
    const existingProduct = cart.find(p => p.id === product.id);

    if (existingProduct) existingProduct.quantity++;
    else {
        product.quantity = 1;
        cart.push(product);
    }
}

function getProductPrice(product) {
    return product.discountPercentage ? product.price - (product.price * product.discountPercentage) / 100 : product.price;
}

function main(products) {
    const shopList = document.querySelector(".shop-section__list");
    const cartBtn = document.querySelector(".header__btn");
    const cartQuantity = document.querySelector("#cart-quantity");

    products.forEach(product => {
        const newPrice = getProductPrice(product);

        const cartBtnId = `add-${product.id}`;

        shopList.innerHTML += /*html*/`
            <li class="shop-section__list-item">
                <img class="shop-section__img" src="${product.thumbnail}" alt="${product.title}">
                <p class="shop-section__text">${product.title}</p>
                ${product.discountPercentage ? `
                    <p class="shop-section__price shop-section__price--discounted">${product.price}$</p>
                    <p class="shop-section__price">${newPrice.toFixed(2)}$</p>
                ` : `
                    <p class="shop-section__price">${product.price}$</p>
                `}
                <button id="${cartBtnId}" type="submit" class="shop-section__btn">Add to cart</button>
            </li>
        `;

        requestAnimationFrame(() => {
            const btn = document.getElementById(cartBtnId);

            btn.addEventListener("click", () => {
                addToCart(product);

                cartQuantity.innerHTML = cart.reduce((acc, p) => acc + p.quantity, 0);
            });
        });
    });

    cartBtn.addEventListener("click", showCart);
};

function showCart() {
    const cartWindow = window.open("", "Cart", "width=400,height=300");

    let cartContent = "<h2>Cart</h2>";
    cartContent += "<ul>";

    let total = 0;

    cart.forEach(product => {
        const discountedPrice = getProductPrice(product);

        const productTotal = product.quantity * discountedPrice;

        total += productTotal;

        cartContent += `<li>${product.title} - ${product.quantity} x ${(discountedPrice).toFixed(2)}$ = ${productTotal.toFixed(2)}$</li>`;
    });

    cartContent += "</ul>";

    cartContent += `<p>Total: ${total.toFixed(2)}$</p>`;

    cartWindow.document.write(cartContent);
}

getProducts(main);