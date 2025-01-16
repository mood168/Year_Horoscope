document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('data/year_horoscope.json');
        const horoscopes = await response.json();
        generateNumberGrid(horoscopes);
    } catch (error) {
        console.error('Error loading horoscope data:', error);
    }
});

function generateNumberGrid(horoscopes) {
    const grid = document.querySelector('.life-numbers-grid');
    
    // 生成1-9的數字卡片
    for (let i = 1; i <= 9; i++) {
        const horoscope = horoscopes[i];
        const card = createNumberCard(i, horoscope);
        grid.appendChild(card);
    }
}

function createNumberCard(number, horoscope) {
    const card = document.createElement('div');
    card.className = 'number-card';
    card.onclick = () => window.location.href = `fortune.html?number=${number}`;

    const numberDiv = document.createElement('div');
    numberDiv.className = 'number';
    numberDiv.textContent = number;

    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.textContent = horoscope.title;

    // 創建簡短描述（取前30個字）
    const briefDiv = document.createElement('div');
    briefDiv.className = 'brief';
    briefDiv.textContent = horoscope.description.substring(0, 30) + '...';

    card.appendChild(numberDiv);
    card.appendChild(titleDiv);
    card.appendChild(briefDiv);

    return card;
}
