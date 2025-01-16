document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    updateCurrentDate();
    createLifeNumberButtons();
    updateMonthProgress();
    loadDailyQuote();
}

function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateElement.textContent = now.toLocaleDateString('zh-TW', options);
}

function createLifeNumberButtons() {
    const grid = document.querySelector('.life-numbers-grid');
    
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.className = 'number-button';
        button.textContent = i;
        button.addEventListener('click', () => {
            localStorage.setItem('selectedLifeNumber', i);
            window.location.href = `fortune.html?number=${i}`;
        });
        grid.appendChild(button);
    }
}

function updateMonthProgress() {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const progress = (currentDay / daysInMonth) * 100;
    
    const progressBar = document.getElementById('monthProgress');
    const progressPercentage = document.getElementById('progressPercentage');
    
    progressBar.style.width = `${progress}%`;
    progressPercentage.textContent = `${Math.round(progress)}%`;
}

async function loadDailyQuote() {
    const quoteElement = document.getElementById('daily-quote');
    try {
        // 模擬 API 調用，實際使用時替換為真實的 API 端點
        const mockQuotes = [
            "今天是實現夢想的好日子！",
            "相信自己，你就是最棒的！",
            "保持正向思考，好運自然來！",
            "新的一天，新的開始！"
        ];
        const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
        quoteElement.textContent = randomQuote;
    } catch (error) {
        console.error('Error loading daily quote:', error);
        quoteElement.textContent = "今天也要保持微笑！";
    }
}
