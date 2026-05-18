
// Bookshelf Logic - Fixed & Optimized
document.addEventListener('DOMContentLoaded', () => {
    loadBookshelf();
    initializeBookmarkButtons();
});

function loadBookshelf() {
    const bookshelfGrid = document.getElementById('bookshelf-grid');
    const emptyState = document.getElementById('bookshelf-empty');
    
    if (!bookshelfGrid) return;
    
    const savedBooks = JSON.parse(localStorage.getItem('bookshelf')) || [];
    
    if (savedBooks.length === 0) {
        bookshelfGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    bookshelfGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    bookshelfGrid.innerHTML = '';
    
    // Standard grid for bookshelf
    bookshelfGrid.style.gridTemplateColumns = 'repeat(auto-fill, 166px)';
    bookshelfGrid.style.gap = '20px';
    bookshelfGrid.style.justifyContent = 'center';
    
    savedBooks.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.height = '380px'; // Standard height
        
        // Path prefix logic for bookshelf in html/ folder
        const pathPrefix = '../';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${book.img}" alt="${book.title}">
                <button class="remove-btn" onclick="removeFromBookshelf(${index})" title="Remove" style="position: absolute; top: 10px; right: 10px; background: #fff; border: none; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ff4444; z-index: 10; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
            <div class="product-details">
                <h3 class="product-title">${book.title}</h3>
                <p class="product-author">${book.author || 'The Pros Way'}</p>
                <div class="product-price">
                    <span class="discounted-price">${book.price}</span>
                    ${book.originalPrice ? `<span class="original-price">${book.originalPrice}</span>` : ''}
                </div>
                

                
                <button class="add-to-bag-btn" onclick="window.location.href='book-details.html'" style="width: 100%; padding: 10px 0; font-weight: 800; font-size: 11px;">
                    VIEW DETAILS
                </button>
            </div>
        `;
        bookshelfGrid.appendChild(card);
    });
}

function removeFromBookshelf(index) {
    let savedBooks = JSON.parse(localStorage.getItem('bookshelf')) || [];
    savedBooks.splice(index, 1);
    localStorage.setItem('bookshelf', JSON.stringify(savedBooks));
    loadBookshelf();
}

// Initialize buttons on every page load to show correct state
function initializeBookmarkButtons() {
    const savedBooks = JSON.parse(localStorage.getItem('bookshelf')) || [];
    const buttons = document.querySelectorAll('.bookshelf-btn');
    
    buttons.forEach(btn => {
        const card = btn.closest('.product-card');
        const title = card.querySelector('.product-title').innerText;
        const exists = savedBooks.find(b => b.title === title);
        
        if (exists) {
            btn.classList.add('active');
            btn.querySelector('i').className = 'fa fa-bookmark';
        }
    });
}

window.toggleBookshelf = function(element) {
    const card = element.closest('.product-card');
    const title = card.querySelector('.product-title').innerText;
    const author = card.querySelector('.product-author')?.innerText || 'The Pros Way';
    const price = card.querySelector('.discounted-price').innerText;
    const originalPrice = card.querySelector('.original-price')?.innerText || '';
    const img = card.querySelector('.product-image img').src;
    
    // Attempt to get PDF path from any of the action buttons or data attributes
    let pdf = '';
    const previewBtn = card.querySelector('.preview-btn');
    if (previewBtn) {
        // Extract PDF from onclick or just use the data if available
        // In render-books.js, it's window.open('${pathPrefix}${book.pdf}')
        const onclickText = previewBtn.getAttribute('onclick');
        const match = onclickText.match(/window\.open\('(.*?)'/);
        if (match) {
            pdf = match[1].replace('../', ''); // Strip prefix to store clean path
        }
    }
    
    let savedBooks = JSON.parse(localStorage.getItem('bookshelf')) || [];
    const existsIndex = savedBooks.findIndex(b => b.title === title);
    
    if (existsIndex > -1) {
        savedBooks.splice(existsIndex, 1);
        element.classList.remove('active');
        element.querySelector('i').className = 'fa fa-bookmark-o';
        showToast("Removed from Bookshelf");
    } else {
        savedBooks.push({ title, author, price, originalPrice, img, pdf });
        element.classList.add('active');
        element.querySelector('i').className = 'fa fa-bookmark';
        showToast("Added to Bookshelf!");
    }
    
    localStorage.setItem('bookshelf', JSON.stringify(savedBooks));
};

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #000; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 12px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-weight: 600;";
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}
