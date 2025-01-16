document.addEventListener('DOMContentLoaded', () => {
    initializeFortunePage();
});

function initializeFortunePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const lifeNumber = urlParams.get('number') || localStorage.getItem('selectedLifeNumber');
    
    if (!lifeNumber) {
        window.location.href = 'index.html';
        return;
    }

    displayLifeNumber(lifeNumber);
    loadYearlyFortune(lifeNumber);
    loadSavedGoals();
    setupMonthlyPlanGeneration(lifeNumber);
}

function displayLifeNumber(number) {
    document.getElementById('selectedNumber').textContent = number;
}

async function loadYearlyFortune(number) {
    const fortuneElement = document.getElementById('yearlyFortune');
    try {
        // 模擬 API 調用，實際使用時替換為真實的 API 端點
        const mockFortunes = {
            1: "領導者運勢：今年您將展現出色的領導才能，是實現目標的理想時機。",
            2: "和諧者運勢：人際關係將成為您的優勢，合作機會處處。",
            3: "創造者運勢：創意思維活躍，適合開展新項目。",
            4: "建設者運勢：腳踏實地的努力將帶來豐碩成果。",
            5: "冒險者運勢：充滿變化與機遇的一年，保持靈活應對。",
            6: "關懷者運勢：家庭與事業平衡發展，溫暖能量充沛。",
            7: "智者運勢：深度學習與靈性提升的重要時期。",
            8: "權威者運勢：財運與事業發展的黃金時期。",
            9: "智慧者運勢：人生哲理的頓悟期，利於總結與規劃。"
        };
        fortuneElement.textContent = mockFortunes[number] || "暫無運勢資料";
    } catch (error) {
        console.error('Error loading yearly fortune:', error);
        fortuneElement.textContent = "無法載入運勢資料";
    }
}

function loadSavedGoals() {
    const goalsInput = document.getElementById('goalsInput');
    const savedGoals = localStorage.getItem('yearlyGoals');
    if (savedGoals) {
        goalsInput.value = savedGoals;
    }

    document.getElementById('saveGoals').addEventListener('click', () => {
        localStorage.setItem('yearlyGoals', goalsInput.value);
        alert('目標已儲存！');
    });
}

function setupMonthlyPlanGeneration(lifeNumber) {
    const generateButton = document.getElementById('generateMonthlyPlan');
    const container = document.getElementById('monthlyPlanContainer');

    generateButton.addEventListener('click', async () => {
        try {
            const monthlyPlans = await generateMonthlyPlans(lifeNumber);
            displayMonthlyPlans(monthlyPlans);
        } catch (error) {
            console.error('Error generating monthly plans:', error);
            alert('生成月度計劃時發生錯誤');
        }
    });
}

async function generateMonthlyPlans(lifeNumber) {
    // 模擬 API 調用，實際使用時替換為真實的 API 端點
    const mockPlans = {};
    const months = Array.from({length: 12}, (_, i) => i + 1);
    
    months.forEach(month => {
        mockPlans[month] = {
            focus: `第${month}月重點：${getMonthlyFocus(month, lifeNumber)}`,
            todos: generateMonthlyTodos(month, lifeNumber)
        };
    });

    return mockPlans;
}

function getMonthlyFocus(month, lifeNumber) {
    const focuses = [
        "事業發展",
        "人際關係",
        "健康養生",
        "財務規劃",
        "學習成長",
        "家庭和諧",
        "心靈提升",
        "創意展現"
    ];
    return focuses[Math.floor(Math.random() * focuses.length)];
}

function generateMonthlyTodos(month, lifeNumber) {
    const todoTemplates = [
        "制定月度計劃",
        "進行健康檢查",
        "更新技能培訓",
        "整理財務報表",
        "安排家庭聚會",
        "進行冥想練習",
        "參加社交活動",
        "閱讀一本好書"
    ];
    
    return todoTemplates
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map(todo => ({
            text: todo,
            completed: false
        }));
}

function displayMonthlyPlans(plans) {
    const container = document.getElementById('monthlyPlanContainer');
    container.innerHTML = '';

    Object.entries(plans).forEach(([month, plan]) => {
        const accordion = createMonthlyAccordion(month, plan);
        container.appendChild(accordion);
    });

    // 保存到 localStorage
    localStorage.setItem('monthlyPlans', JSON.stringify(plans));
}

function createMonthlyAccordion(month, plan) {
    const accordion = document.createElement('div');
    accordion.className = 'monthly-accordion';

    const header = document.createElement('div');
    header.className = 'month-header';
    header.textContent = `${month}月`;
    header.onclick = () => toggleAccordion(content);

    const content = document.createElement('div');
    content.className = 'month-content';

    const focus = document.createElement('p');
    focus.textContent = plan.focus;
    content.appendChild(focus);

    const todoList = document.createElement('ul');
    todoList.className = 'todo-list';
    
    plan.todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onchange = () => updateTodoStatus(month, index);
        
        const span = document.createElement('span');
        span.textContent = todo.text;
        
        li.appendChild(checkbox);
        li.appendChild(span);
        todoList.appendChild(li);
    });

    content.appendChild(todoList);
    accordion.appendChild(header);
    accordion.appendChild(content);

    return accordion;
}

function toggleAccordion(content) {
    content.classList.toggle('active');
}

function updateTodoStatus(month, index) {
    const plans = JSON.parse(localStorage.getItem('monthlyPlans') || '{}');
    if (plans[month] && plans[month].todos[index]) {
        plans[month].todos[index].completed = !plans[month].todos[index].completed;
        localStorage.setItem('monthlyPlans', JSON.stringify(plans));
    }
}
