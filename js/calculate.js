document.addEventListener('DOMContentLoaded', () => {
    initializeCalculator();
    updateCurrentDate();
});

function initializeCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', performCalculations);

    // 限制只能輸入數字
    document.getElementById('birthYear').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });
    document.getElementById('birthMonth').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });
    document.getElementById('birthDay').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });
}

function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateElement.textContent = now.toLocaleDateString('zh-TW', options);
}

function performCalculations() {
    const birthYear = document.getElementById('birthYear').value;
    const birthMonth = document.getElementById('birthMonth').value;
    const birthDay = document.getElementById('birthDay').value;

    if (!validateInputs(birthYear, birthMonth, birthDay)) {
        alert('請輸入有效的出生日期！\n年份：1900-2100\n月份：1-12\n日期：1-31');
        return;
    }

    calculateNumbers(birthYear, birthMonth, birthDay);
}

function validateInputs(year, month, day) {
    // 隱藏結果區域
    document.querySelector('.result-section').style.display = 'none';
    document.getElementById('yearHoroscope').style.display = 'none';

    if (!year || !month || !day) {
        alert('請填寫完整的出生日期');
        return false;
    }

    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        alert('請輸入有效的數字');
        return false;
    }

    if (year < 1900 || year > 2100) {
        alert('請輸入有效的年份 (1900-2100)');
        return false;
    }

    if (month < 1 || month > 12) {
        alert('請輸入有效的月份 (1-12)');
        return false;
    }

    if (day < 1 || day > 31) {
        alert('請輸入有效的日期 (1-31)');
        return false;
    }

    // 檢查特定月份的日期
    if (month === 2) {
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        if (day > (isLeapYear ? 29 : 28)) {
            alert('請輸入有效的日期');
            return false;
        }
    } else if ([4, 6, 9, 11].includes(month) && day > 30) {
        alert('請輸入有效的日期');
        return false;
    }

    return true;
}

async function calculateNumbers(birthYear, birthMonth, birthDay) {
    // 顯示結果區域
    document.querySelector('.result-section').style.display = 'block';

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    
    // 顯示計算步驟
    document.getElementById('currentYear').textContent = currentYear;
    document.getElementById('birthMD').textContent = `${birthMonth}月${birthDay}日`;

    // 計算流年數字
    let flowYearSum = currentYear + parseInt(birthMonth) + parseInt(birthDay);
    let flowYearNumber = reduceToSingleDigit(flowYearSum);

    // 判斷是否已過生日
    const hasBirthdayPassed = (currentMonth > birthMonth) || 
                             (currentMonth === birthMonth && currentDay >= birthDay);

    // 如果還沒過生日，使用前一年的流年數字
    if (!hasBirthdayPassed) {
        flowYearSum = (currentYear - 1) + parseInt(birthMonth) + parseInt(birthDay);
        flowYearNumber = reduceToSingleDigit(flowYearSum);
    }

    document.getElementById('yearNumber').textContent = flowYearNumber;
    document.getElementById('yearNote').textContent = 
        `從${currentYear}年${birthMonth}月${birthDay}日起至${currentYear + 1}年${birthMonth}月${birthDay}日止的流年數字為 ${flowYearNumber}`;

    // 計算流月數字
    let flowMonthSum = flowYearNumber + currentMonth;
    let flowMonthNumber = reduceToSingleDigit(flowMonthSum);

    // 判斷是否已過當月生日日期
    if (currentDay < birthDay) {
        flowMonthSum = flowYearNumber + (currentMonth - 1);
        flowMonthNumber = reduceToSingleDigit(flowMonthSum);
    }

    // 顯示計算結果
    document.getElementById('currentFlowYear').textContent = flowYearNumber;
    document.getElementById('currentMonth').textContent = currentMonth;
    document.getElementById('monthNumber').textContent = flowMonthNumber;

    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, birthDay);
    const monthNote = `從${currentMonth}月${birthDay}日起至${nextMonthDate.getMonth() + 1}月${birthDay}日止的流月數字為 ${flowMonthNumber}`;
    document.getElementById('monthNote').textContent = monthNote;

    // 顯示運勢內容
    await displayYearHoroscope(flowYearNumber);
}

function reduceToSingleDigit(number) {
    while (number > 9) {
        number = String(number).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return number;
}

async function displayYearHoroscope(yearNumber) {
    try {
        const response = await fetch('data/year_horoscope.json');
        const data = await response.json();
        const horoscope = data[yearNumber];

        if (horoscope) {
            document.getElementById('yearHoroscope').style.display = 'block';
            document.querySelector('#yearHoroscope .horoscope-title').textContent = horoscope.title;
            document.querySelector('#yearHoroscope .horoscope-description').textContent = horoscope.description;

            // 更新建議列表
            const suggestionList = document.querySelector('#yearHoroscope .suggestion-list');
            suggestionList.innerHTML = '';
            horoscope.suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                suggestionList.appendChild(li);
            });

            // 更新重點領域
            const focusArea = document.querySelector('#yearHoroscope .focus-tags');
            focusArea.innerHTML = '';
            horoscope.focus_areas.forEach(focus => {
                const tag = document.createElement('span');
                tag.className = 'focus-tag';
                tag.textContent = focus;
                focusArea.appendChild(tag);
            });
        }
    } catch (error) {
        console.error('Error loading horoscope data:', error);
    }
}

function viewFortune() {
    const yearNumber = document.getElementById('yearNumber').textContent;
    if (yearNumber) {
        window.location.href = `./fortune.html?number=${yearNumber}`;
    }
}
