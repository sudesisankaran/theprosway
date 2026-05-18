document.addEventListener('DOMContentLoaded', () => {
    // Select all "Read Sample" buttons/links
    const readSampleButtons = document.querySelectorAll('.pdf-btn, .read-sample-btn');
    
    readSampleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = btn.getAttribute('data-title') || 'Sample Preview';
            openPDFPreview(title);
        });
    });
});

function openPDFPreview(titleText) {
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'pdf-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
    `;

    // Security: Block context menu
    modal.oncontextmenu = (e) => e.preventDefault();

    // Close button
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        color: #FFD700;
        font-size: 40px;
        cursor: pointer;
        z-index: 10001;
        transition: transform 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.transform = 'scale(1.2)';
    closeBtn.onmouseout = () => closeBtn.style.transform = 'scale(1)';
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    };
    modal.appendChild(closeBtn);

    // Header with title
    const header = document.createElement('div');
    header.style.cssText = `
        width: 100%;
        padding: 20px;
        text-align: center;
        color: #FFD700;
        font-size: 24px;
        font-weight: bold;
        border-bottom: 1px solid #333;
    `;
    header.innerText = titleText;
    modal.appendChild(header);

    // Scrollable container
    const container = document.createElement('div');
    container.style.cssText = `
        width: 90%;
        max-width: 900px;
        height: calc(100vh - 80px);
        overflow: hidden; /* Disable manual scrolling */
        padding: 40px 20px;
    `;
    
    modal.appendChild(container);

    // Add "pages" (content)
    const pageCount = 3;
    const dummyText = `
        This is a protected sample preview of our premium content. 
        TheProsWay provides curated, high-quality learning resources designed to help you master new skills efficiently.
        
        Key Concepts Covered:
        1. Fundamental Principles of Domain Mastery.
        2. Practical Application and Real-world Case Studies.
        3. Strategic Planning for Long-term Success.
        
        Our full guides include detailed walkthroughs, interactive exercises, and expert insights 
        that are not available in this short-form preview.
        
        Security Note: Downloading, copying, or screenshotting this content is strictly prohibited 
        to protect the intellectual property of our authors.
    `;

    for (let i = 1; i <= pageCount; i++) {
        const page = document.createElement('div');
        page.style.cssText = `
            background: #ffffff;
            margin: 0 auto 40px;
            padding: 60px;
            width: 100%;
            min-height: 1000px;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            color: #333;
            line-height: 1.8;
            font-size: 18px;
            border-radius: 4px;
        `;
        
        // Watermark/Background Image
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(0,0,0,0.05);
            white-space: nowrap;
            pointer-events: none;
            z-index: 0;
        `;
        watermark.innerText = 'THEPROSWAY SAMPLE';
        page.appendChild(watermark);

        // Content
        const pageTitle = document.createElement('h3');
        pageTitle.innerText = `CHAPTER ${i}: FOUNDATIONS`;
        pageTitle.style.cssText = `
            border-bottom: 2px solid #FFD700;
            padding-bottom: 10px;
            margin-bottom: 30px;
            color: #000;
            position: relative;
            z-index: 1;
        `;
        page.appendChild(pageTitle);

        const pageContent = document.createElement('div');
        pageContent.style.cssText = 'position: relative; z-index: 1; text-align: justify;';
        pageContent.innerText = dummyText.repeat(3);
        page.appendChild(pageContent);
        
        // Image at the end of page 1
        if (i === 1) {
            const img = document.createElement('img');
            img.src = '../img/coding.jpg';
            img.style.cssText = 'width: 100%; margin-top: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);';
            page.appendChild(img);
        }

        container.appendChild(page);
    }

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Auto-scroll logic
    let scrollSpeed = 1.0; // Slightly slower for better readability
    
    function autoScroll() {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
            // Reached the end, stop scrolling
            return;
        } else {
            container.scrollTop += scrollSpeed;
            requestAnimationFrame(autoScroll);
        }
    }
    
    // Start auto-scroll after a short delay
    setTimeout(() => {
        requestAnimationFrame(autoScroll);
    }, 1000);

    // Security & Anti-Manual Scroll: Block all interaction events
    const preventManualScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    container.addEventListener('wheel', preventManualScroll, {passive: false});
    container.addEventListener('touchmove', preventManualScroll, {passive: false});
    container.addEventListener('mousedown', (e) => { if(e.button === 1) e.preventDefault(); }); // Block middle click
    
    // Block keys that cause scrolling
    const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'];
    window.addEventListener('keydown', (e) => {
        if (scrollKeys.includes(e.key) || e.code === 'Space') {
            e.preventDefault();
            return false;
        }
        // Existing security shortcuts
        if (e.ctrlKey && (e.key === 'c' || e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'i' || e.key === 'j')) {
            e.preventDefault();
            return false;
        }
        if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
            modal.style.display = 'none';
            setTimeout(() => modal.style.display = 'flex', 100);
            e.preventDefault();
        }
    }, true);
}
