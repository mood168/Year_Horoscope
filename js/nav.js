document.addEventListener('DOMContentLoaded', function() {
    // 獲取當前頁面的路徑名
    const currentPath = window.location.pathname;
    
    // 找到所有導航鏈接
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 為當前頁面的鏈接添加 active 類
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });
});
