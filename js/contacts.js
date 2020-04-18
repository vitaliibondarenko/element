//=============================================================
// Яндекс карты
ymaps.ready(init);
    function init(){
        // Создание карты.
        var myMap = new ymaps.Map("map", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [55.84840507, 37.49982163],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 16
        });
        var myPlacemark = new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: [55.84765663, 37.50505730]
            }
        }
        );
        myMap.geoObjects.add(myPlacemark);
    }
//=============================================================
//Сэндвич
const sandwichButton = document.querySelector('.sandwich');
const sandwichList = document.querySelector('.navigation ul');

// function toggleSandwich(e) {
//     sandwichList.classList.toggle('sandwich-active');
// }
// sandwichButton.addEventListener('click' , toggleSandwich);
// $('.navigation ul li').on('click', toggleSandwich);
