// Global Cart Logic for The Pros Way Bookstore

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // If we are on the cart page, render it
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }

    // Delegation for Add to Cart buttons
    document.addEventListener('click', (e) => {
        if (e.target && (e.target.classList.contains('add-to-bag-btn') || e.target.closest('.add-to-bag-btn'))) {
            const btn = e.target.classList.contains('add-to-bag-btn') ? e.target : e.target.closest('.add-to-bag-btn');
            const card = btn.closest('.product-card');
            if (card) {
                const product = {
                    title: card.querySelector('.product-title').innerText,
                    author: card.querySelector('.product-author').innerText,
                    price: card.querySelector('.discounted-price').innerText.replace('₹ ', '').replace(',', ''),
                    originalPrice: card.querySelector('.original-price') ? card.querySelector('.original-price').innerText.replace('₹ ', '').replace(',', '') : '',
                    image: card.querySelector('.product-image img').src,
                    pdf: btn.getAttribute('data-pdf') || card.getAttribute('data-pdf') || 'Bookscape_Order_Receipt.pdf',
                    quantity: 1
                };
                addToCart(product);
            }
        }
    });
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.title === product.title);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    showToast("Added to Bag!");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + parseInt(item.quantity || 0), 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = count;
    }
}

function renderCartPage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartListSection = document.querySelector('.cart-list-section');
    if (!cartListSection) return;

    if (cart.length === 0) {
        cartListSection.innerHTML = '<div class="cart-header-title">My Bag (0 Items)</div><div style="padding: 60px; text-align: center; font-size: 18px;">Your cart is empty. <br><br><a href="../index.html" class="btn-primary" style="text-decoration:none; display: inline-block;">Go Shopping</a></div>';
        updateSummary(0, 0);
        return;
    }

    let html = `<div class="cart-header-title">My Bag (${cart.length} ${cart.length === 1 ? 'Item' : 'Items'})</div>`;
    let totalMRP = 0;
    let totalDiscounted = 0;

    cart.forEach((item, index) => {
        const itemPrice = parseInt(item.price);
        const itemOriginal = item.originalPrice ? parseInt(item.originalPrice) : itemPrice;
        
        totalMRP += itemOriginal * item.quantity;
        totalDiscounted += itemPrice * item.quantity;

        html += `
            <div class="cart-item" data-index="${index}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p class="author">${item.author}</p>
                    <div class="price-section">
                        <span class="current">₹ ${itemPrice.toLocaleString()}</span>
                        ${item.originalPrice ? `<span class="original">₹ ${itemOriginal.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="qty-control">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                        <input type="text" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    });

    cartListSection.innerHTML = html;
    updateSummary(totalMRP, totalDiscounted);
}

function changeQty(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = parseInt(cart[index].quantity) + change;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
}

function updateSummary(mrp, discounted) {
    const totalAmount = discounted;
    const discount = mrp - discounted;

    const summarySection = document.querySelector('.summary-section');
    if (!summarySection) return;

    summarySection.innerHTML = `
        <h2>Price Details</h2>
        <div class="summary-row">
            <span>Total MRP</span>
            <span>₹ ${mrp.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Discount on MRP</span>
            <span style="color: #388E3C;">- ₹ ${discount.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Shipping Charges</span>
            <span style="color: #388E3C;">FREE</span>
        </div>
        <div class="summary-total">
            <span>Total Amount</span>
            <span>₹ ${totalAmount.toLocaleString()}</span>
        </div>
        <button class="btn-primary checkout-btn" onclick="location.href='payment.html'">CHECKOUT</button>
    `;
}

function showToast(message) {
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #FBD12C;
        color: #000;
        padding: 14px 28px;
        border-radius: 30px;
        z-index: 9999;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideUp 0.3s ease-out;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

// Global function for "BUY NOW" buttons
function addToCartAndNotify(btn) {
    const card = btn.closest('.product-card');
    let product;
    
    if (card) {
        product = {
            title: card.querySelector('.product-title').innerText,
            author: card.querySelector('.product-author').innerText,
            price: card.querySelector('.discounted-price').innerText.replace('₹ ', '').replace(',', ''),
            originalPrice: card.querySelector('.original-price') ? card.querySelector('.original-price').innerText.replace('₹ ', '').replace(',', '') : '',
            image: card.querySelector('.product-image img').src,
            pdf: btn.getAttribute('data-pdf') || card.getAttribute('data-pdf') || 'Bookscape_Order_Receipt.pdf',
            quantity: 1
        };
    } else {
        // Handle Book Details page
        product = {
            title: document.getElementById('book-title')?.innerText || 'Unknown Title',
            author: document.getElementById('book-author')?.innerText || 'The Pros Way',
            price: document.getElementById('details-price')?.innerText.replace('₹ ', '').replace(',', '') || '0',
            originalPrice: document.getElementById('details-original-price')?.innerText.replace('₹ ', '').replace(',', '') || '',
            image: document.getElementById('book-img')?.src || '',
            pdf: btn.getAttribute('data-pdf') || 'Bookscape_Order_Receipt.pdf',
            quantity: 1
        };
    }
    
    if (product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = cart.findIndex(item => item.title === product.title);
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Redirect to login page instead of payment directly
        const isSubfolder = window.location.pathname.includes('/html/');
        const loginLink = isSubfolder ? 'login.html' : 'html/login.html';
        window.location.href = loginLink;
    }
}

// Global updateQty for cart page buttons
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.addToCartAndLogin = addToCartAndNotify;
