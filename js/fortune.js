document.addEventListener('DOMContentLoaded', () => {
    initializeFortunePage();
    setupNavigation();
    setupMobileMenu();
    setupActionButtons();
});

async function initializeFortunePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const lifeNumber = urlParams.get('number') || localStorage.getItem('selectedLifeNumber');
    
    if (!lifeNumber) {
        window.location.href = 'index.html';
        return;
    }

    displayLifeNumber(lifeNumber);
    await loadFortuneContent(lifeNumber);
    loadSavedGoals();
}

function displayLifeNumber(number) {
    document.getElementById('selectedNumber').textContent = number;
}

async function loadFortuneContent(number) {
    try {
        const response = await fetch(`md_files/${number}.md`);
        if (!response.ok) throw new Error('無法載入運勢內容');
        
        const content = await response.text();
        console.log('Loaded content:', content); // 除錯用
        parseAndDisplayContent(content);
    } catch (error) {
        console.error('Error loading fortune content:', error);
        alert('無法載入運勢內容，請稍後再試');
    }
}

function parseAndDisplayContent(content) {
    try {
        // 解析事業方向
        const careerMatch = content.match(/### 適合今年的事業方向([\s\S]+?)(?=\n---\n|$)/);
        if (careerMatch) {
            displayCareerContent(careerMatch[1]);
        }

        // 解析年度目標
        const goalsMatch = content.match(/### 年度目標設定([\s\S]+?)(?=\n---\n|$)/);
        if (goalsMatch) {
            displayGoalsContent(goalsMatch[1]);
        }

        // 解析月度計劃
        const monthlyMatch = content.match(/### 12 個月的月度計劃([\s\S]+?)(?=\n---\n|$)/);
        if (monthlyMatch) {
            displayMonthlyContent(monthlyMatch[1]);
        }

        // 解析注意事項
        const notesMatch = content.match(/### 注意事項([\s\S]+?)(?=\n---\n|$)/);
        if (notesMatch) {
            displayNotesContent(notesMatch[1]);
        }
    } catch (error) {
        console.error('Error parsing content:', error);
    }
}

function displayCareerContent(content) {
    const container = document.getElementById('careerContent');
    try {
        const items = content.match(/\d+\.\s[^:：]+[：:]([\s\S]+?)(?=\d+\.|$)/g) || [];
        
        container.innerHTML = items.map(item => {
            const [title, details] = item.split(/[：:]/);
            const listItems = details.split('-')
                .filter(d => d.trim())
                .map(d => `<li>${d.trim()}</li>`)
                .join('');
                
            return `
                <div class="career-card animate__animated animate__fadeIn">
                    <h4>${title.replace(/^\d+\.\s/, '')}</h4>
                    <ul>${listItems}</ul>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error displaying career content:', error);
        container.innerHTML = '<div class="no-content">暫無事業方向內容</div>';
    }
}

function displayGoalsContent(content) {
    const container = document.getElementById('goalsContent');
    try {
        const items = content.match(/\d+\.\s[^:：]+[：:]([\s\S]+?)(?=\d+\.|$)/g) || [];
        
        container.innerHTML = items.map(item => {
            const [title, details] = item.split(/[：:]/);
            const listItems = details.split('-')
                .filter(d => d.trim())
                .map(d => `<li>${d.trim()}</li>`)
                .join('');
                
            return `
                <div class="goal-item">
                    <h4>${title.replace(/^\d+\.\s/, '')}</h4>
                    <ul>${listItems}</ul>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error displaying goals content:', error);
        container.innerHTML = '<div class="no-content">暫無年度目標內容</div>';
    }
}

function displayMonthlyContent(content) {
    const container = document.getElementById('monthlyContent');
    try {
        const quarters = content.match(/####[^#]+((?:\n-[^#]+)+)/g) || [];
        
        const monthlyContent = quarters.map(quarter => {
            const monthEntries = quarter.match(/- (\d+) 月[：:]([^\n]+)/g) || [];
            
            return monthEntries.map(entry => {
                const [_, month, description] = entry.match(/- (\d+) 月[：:](.+)/) || [];
                if (!month || !description) return '';
                
                return `
                    <div class="timeline-item">
                        <div class="timeline-content">
                            <h4>${month}月</h4>
                            <p>${description.trim()}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }).join('');

        if (!monthlyContent.trim()) {
            throw new Error('無月度計劃內容');
        }

        container.innerHTML = monthlyContent;
        
        // 新增動畫延遲
        const items = container.querySelectorAll('.timeline-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    } catch (error) {
        console.error('Error displaying monthly content:', error);
        container.innerHTML = '<div class="no-content">暫無月度計劃內容</div>';
    }
}

function displayNotesContent(content) {
    const container = document.getElementById('notesContent');
    try {
        const items = content.match(/- ([^:：]+)[：:]([^\n]+)/g) || [];
        
        container.innerHTML = items.map(item => {
            const [_, title, content] = item.match(/- ([^:：]+)[：:](.+)/) || [];
            return `
                <div class="note-card animate__animated animate__fadeIn">
                    <h4>${title.trim()}</h4>
                    <p>${content.trim()}</p>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error displaying notes content:', error);
        container.innerHTML = '<div class="no-content">暫無注意事項內容</div>';
    }
}

function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('.content-section');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            
            // 更新按鈕狀態
            buttons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // 更新內容區域
            sections.forEach(section => {
                section.classList.remove('active', 'animate__fadeIn');
                if (section.id === targetSection) {
                    section.classList.add('active', 'animate__fadeIn');
                }
            });
        });
    });
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

function loadSavedGoals() {
    const goalsInput = document.getElementById('personalGoals');
    const savedGoals = localStorage.getItem('personalYearlyGoals');
    if (savedGoals) {
        goalsInput.value = savedGoals;
    }

    document.getElementById('saveGoals').addEventListener('click', () => {
        localStorage.setItem('personalYearlyGoals', goalsInput.value);
        showToast('目標已儲存！');
    });
}

function setupActionButtons() {
    // 設定列印功能
    document.getElementById('printButton').addEventListener('click', () => {
        window.print();
    });
    
    // 設定分享功能
    document.getElementById('shareButton').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: '我的流年運勢',
                text: `檢視我的${new Date().getFullYear()}年流年運勢`,
                url: window.location.href
            }).catch(console.error);
        } else {
            // 如果不支援原生分享，則複製連結
            copyToClipboard(window.location.href);
            showToast('連結已複製到剪貼簿');
        }
    });
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast animate__animated animate__fadeIn';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('animate__fadeIn');
        toast.classList.add('animate__fadeOut');
        setTimeout(() => document.body.removeChild(toast), 500);
    }, 2000);
}

// 新增列印樣式
const style = document.createElement('style');
style.textContent = `
    @media print {
        .nav-bar, .fortune-navigation, .fortune-footer, .goals-input {
            display: none !important;
        }
        
        .content-section {
            display: block !important;
            break-inside: avoid;
        }
        
        .fortune-header {
            background: none !important;
            color: black !important;
        }
        
        .highlight-number {
            color: var(--primary-color) !important;
        }
    }
`;
document.head.appendChild(style);
