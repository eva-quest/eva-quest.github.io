// Список картинок локаций
const locations = [
    'https://ms-lestnic.ru/wp-content/uploads/2020/04/podokonnik-shpon-dub-04.jpg',
    'https://www.stolplit.ru/upload/resize_cache/iblock/b3e/qryc4kil82kle0ajh6hz65fe1ch632z5/350_262_0/i0000368313-detail.jpeg',
    'https://www.stolplit.ru/upload/resize_cache/iblock/da0/oixnm7lct8zuphh3dy7dk9o09i6bxlni/306_262_0/leon_sb_3369_krovat_1600_beliy_i0000464897_4.jpg',
    'https://www.stokdivanov.ru/covers/models/divan-ultra-evro-page-38252711891.jpg'
];

const itemWidth = 320;
const tape = document.getElementById('tape');
const spinBtn = document.getElementById('spinBtn');

// Генерируем ленту повторений
let tapeItems = [];
for (let i = 0; i < 20; i++) {
    tapeItems = tapeItems.concat(locations);
}

// Отрисовываем картинки в ленту
tapeItems.forEach(src => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<img src="${src}" alt="location">`;
    tape.appendChild(div);
});

function spin() {
    spinBtn.disabled = true;

    // 1. МГНОВЕННЫЙ СБРОС
    tape.style.transition = 'none';
    tape.style.left = '0px';
    tape.offsetHeight; // force-reflow

    // 2. ЗАПУСК КРУТКИ
    tape.style.transition = 'left 4s cubic-bezier(0.1, 0.8, 0.1, 1)';

    const totalItems = tapeItems.length;
    const minFinalIndex = totalItems - 6;
    const maxFinalIndex = totalItems - 2;
    const finalIndex = Math.floor(Math.random() * (maxFinalIndex - minFinalIndex + 1)) + minFinalIndex;

    const stopPosition = -(finalIndex * itemWidth);
    tape.style.left = stopPosition + 'px';

    setTimeout(() => {
        spinBtn.disabled = false;
    }, 4000);
}
