/**
 * render-books.js
 * Handles dynamic rendering of books from the centralized books.js data
 */

function renderBooks() {
    const containers = document.querySelectorAll('.books-dynamic-container');
    if (containers.length === 0) return;

    // Check if we are inside the 'html' folder or at root
    const isInsideHtml = window.location.pathname.includes('/html/');
    const pathPrefix = isInsideHtml ? '../' : '';
    const detailsPath = isInsideHtml ? 'book-details.html' : 'html/book-details.html';

    containers.forEach(container => {
        const category = container.getAttribute('data-category');
        const limit = parseInt(container.getAttribute('data-limit')) || 0;
        
        let filteredBooks = books;
        if (category === 'bestsellers') {
            filteredBooks = books.filter(b => b.bestseller);
        } else if (category && category !== 'all') {
            filteredBooks = books.filter(b => b.category === category);
        }

        // Apply limit if specified (useful for index.html sections)
        if (limit > 0) {
            filteredBooks = filteredBooks.slice(0, limit);
        }

        container.innerHTML = ''; // Clear existing content

        filteredBooks.forEach(book => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.style.cursor = 'pointer';
            productCard.onclick = () => {
                location.href = `${detailsPath}?id=${book.id}`;
            };

            // Handle image path
            let imageSrc = book.image;
            if (!imageSrc.startsWith('http')) {
                imageSrc = pathPrefix + imageSrc;
            }

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${imageSrc}" alt="${book.title}">
                    ${book.rank ? `<div class="rank-badge">#${book.rank}</div>` : ''}
                    ${book.category === 'soon' ? `<div class="coming-soon-badge">Soon</div>` : ''}
                    <button class="bookshelf-btn" title="Add to Bookshelf" onclick="event.stopPropagation(); toggleBookshelf(this);">
                        <i class="fa fa-bookmark-o"></i>
                    </button>
                </div>
                <div class="product-details">
                    <h3 class="product-title">${book.title}</h3>
                    <p class="product-author">${book.author}</p>
                    <div class="product-price">
                        <span class="discounted-price">₹ ${book.discountedPrice}</span>
                        <span class="original-price">₹ ${book.originalPrice}</span>
                    </div>

                    ${book.category === 'soon' ? `
                        <button class="add-to-bag-btn coming-soon-btn" onclick="event.stopPropagation(); alert('We will notify you when this is available!');">
                            NOTIFY ME
                        </button>
                    ` : `
                        <button class="add-to-bag-btn" 
                                data-pdf="${book.pdf.split('/').pop()}" 
                                onclick="event.stopPropagation(); addToCartAndNotify(this);">
                            BUY NOW
                        </button>
                    `}
                </div>
            `;
            container.appendChild(productCard);
        });
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', renderBooks);
