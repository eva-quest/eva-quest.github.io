// Список картинок локаций
const locations = [
    'https://ms-lestnic.ru/wp-content/uploads/2020/04/podokonnik-shpon-dub-04.jpg',
    'https://www.stolplit.ru/upload/resize_cache/iblock/b3e/qryc4kil82kle0ajh6hz65fe1ch632z5/350_262_0/i0000368313-detail.jpeg',
    'https://www.stolplit.ru/upload/resize_cache/iblock/da0/oixnm7lct8zuphh3dy7dk9o09i6bxlni/306_262_0/leon_sb_3369_krovat_1600_beliy_i0000464897_4.jpg',
    'https://www.stokdivanov.ru/covers/models/divan-ultra-evro-page-38252711891.jpg'
];

const ITEM_WIDTH = 320;
const TAPE_LENGTH = 60; // Длина ленты
const MIN_SCROLL = 20;   // Минимальная прокрутка (чтобы было видно движение)

const tape = document.getElementById('tape');
const spinBtn = document.getElementById('spinBtn');

let tapeItems = [];
let lastWinIndex = -1; // <-- ХРАНИМ индекс последнего выигрыша

// Функция идеального перемешивания
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Генерация ленты
function initTape() {
    // 1. Создаем длинную ленту из случайных элементов
    for (let i = 0; i < TAPE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * locations.length);
        tapeItems.push(locations[randomIndex]);
    }

    // 2. Перемешиваем, чтобы не было куч одинаковых картинок подряд
    tapeItems = shuffleArray(tapeItems);

    // Отрисовка
    tapeItems.forEach(src => {
        const div = document.createElement('div');
        div.className = 'item';
        const fileName = src.substring(src.lastIndexOf('/') + 1);
        div.innerHTML = `<img src="${src}" alt="Локация: ${fileName}">`;
        tape.appendChild(div);
    });
}

initTape();

function spin() {
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;

    // --- СБРОС ---
    tape.style.transition = 'none';
    tape.style.left = '0px';
    void tape.offsetHeight; // Force reflow

    // --- ЗАПУСК ---
    tape.style.transition = `left 4s cubic-bezier(0.1, 0.8, 0.1, 1)`;

    const totalItems = tapeItems.length;
    
    // === ГЛАВНОЕ ИЗМЕНЕНИЕ ===
    // Мы ищем случайный индекс, но проверяем: он НЕ должен быть равен lastWinIndex
    let finalIndex;
    let attempts = 0;
    const maxAttempts = 100; // Защита от бесконечного цикла (если вдруг массив из 1 элемента)

    do {
        // Выбираем случайный индекс в допустимом диапазоне
        const startRange = MIN_SCROLL;
        const endRange = totalItems - 3;
        
        // Если диапазон слишком мал, берем весь массив
        const rangeStart = (startRange < endRange) ? startRange : 0;
        const rangeEnd = (startRange < endRange) ? endRange : totalItems - 1;

        finalIndex = Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
        attempts++;
    } while (finalIndex === lastWinIndex && attempts < maxAttempts);
    
    // Если вдруг не повезло 100 раз (теоретически невозможно при >1 картинке), берем любой другой
    if (finalIndex === lastWinIndex) {
        console.warn("Не удалось найти уникальный индекс, берем случайный");
        finalIndex = Math.floor(Math.random() * totalItems);
    }

    // Обновляем память: этот индекс теперь "последний выпавший"
    lastWinIndex = finalIndex;

    const stopPosition = -(finalIndex * ITEM_WIDTH);
    tape.style.left = `${stopPosition}px`;

    setTimeout(() => {
        spinBtn.disabled = false;
    }, 4000);
}
