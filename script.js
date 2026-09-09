const locations = [
      "./IMG_2025.jpeg",
  "./IMG_2026.jpeg",
  "./IMG_2027.jpeg",
  "./IMG_2028.jpeg",
  "./IMG_2029.jpeg", "IMG_2030.jpeg"
   // 'https://ms-lestnic.ru/wp-content/uploads/2020/04/podokonnik-shpon-dub-04.jpg',
//    'https://www.stolplit.ru/upload/resize_cache/iblock/b3e/qryc4kil82kle0ajh6hz65fe1ch632z5/350_262_0/i0000368313-detail.jpeg',
//    'https://www.stolplit.ru/upload/resize_cache/iblock/da0/oixnm7lct8zuphh3dy7dk9o09i6bxlni/306_262_0/leon_sb_3369_krovat_1600_beliy_i0000464897_4.jpg',
  //  'https://www.stokdivanov.ru/covers/models/divan-ultra-evro-page-38252711891.jpg'
];

const ITEM_WIDTH = 320;
const TAPE_LENGTH = 80; // Чуть увеличил, чтобы было больше пространства для маневра
const MIN_SCROLL = 25;  // Чуть увеличил прокрутку, чтобы движение было заметнее

const tape = document.getElementById('tape');
const spinBtn = document.getElementById('spinBtn');

let tapeItems = [];
let lastWinSrc = null; // <-- ТЕПЕРЬ храним не индекс, а САМУ ССЫЛКУ (картинку)

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function initTape() {
    // Генерируем ленту
    for (let i = 0; i < TAPE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * locations.length);
        tapeItems.push(locations[randomIndex]);
    }
    
    // Перемешиваем, чтобы одинаковые не стояли кучами (это важно для красоты)
    tapeItems = shuffleArray(tapeItems);

    // Отрисовка
    tapeItems.forEach(src => {
        const div = document.createElement('div');
        div.className = 'item';
        // Берем имя файла для alt
        const fileName = src.substring(src.lastIndexOf('/') + 1);
        div.innerHTML = `<img src="${src}" alt="Локация: ${fileName}">`;
        tape.appendChild(div);
    });
}

initTape();

function spin() {
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;

    // Сброс
    tape.style.transition = 'none';
    tape.style.left = '0px';
    void tape.offsetHeight; 

    // Запуск анимации
    tape.style.transition = `left 4s cubic-bezier(0.1, 0.8, 0.1, 1)`;

    const totalItems = tapeItems.length;
    let finalIndex;
    let attempts = 0;
    const maxAttempts = 1000; // Увеличил попытки, чтобы точно найти вариант

    do {
        // Диапазон прокрутки
        const startRange = MIN_SCROLL;
        const endRange = totalItems - 3;
        
        const rangeStart = (startRange < endRange) ? startRange : 0;
        const rangeEnd = (startRange < endRange) ? endRange : totalItems - 1;

        finalIndex = Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
        attempts++;
        
        // ГЛАВНАЯ ПРОВЕРКА:
        // Если ссылка на картинке в этом месте ТАКАЯ ЖЕ, как в прошлый раз — пробуем снова
    } while (tapeItems[finalIndex] === lastWinSrc && attempts < maxAttempts);

    // Обновляем память: запоминаем ссылку, которая выпала СЕЙЧАС
    lastWinSrc = tapeItems[finalIndex];

    const stopPosition = -(finalIndex * ITEM_WIDTH);
    tape.style.left = `${stopPosition}px`;

    setTimeout(() => {
        spinBtn.disabled = false;
    }, 4000);
}
