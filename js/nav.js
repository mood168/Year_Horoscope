document.addEventListener('DOMContentLoaded', function() {
    // 獲取當前頁面的路徑名
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // 找到所有導航鏈接
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 為當前頁面的鏈接添加 active 類
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
        
        // 特殊處理首頁的"返回首頁"鏈接
        if (currentPage === 'index.html' && link.textContent === '返回首頁') {
            link.classList.add('active');
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navLinksContainer.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

