
const popupFormData = new FormData();
const serviceLinks = document.querySelectorAll(".service a");
const phonePattern = new RegExp('[+][7][(][0-9]{3}[)][ ][0-9]{3}[-][0-9]{4}');
// Переключение вкладок со сменой услуги в POPUP
function toggleService(e){
    e.preventDefault();
    if(this.closest('.service').classList.contains('active')) {
        return ;
    } else {
        document.querySelector('.service.active').classList.toggle('active');
        document.querySelector('.service-active').classList.toggle('service-active');
        this.closest('.service').classList.toggle('active');
        let selector = '#'+this.dataset.service;
        document.querySelector(selector).classList.toggle('service-active');
        
        let parentElement = this.closest('.service');
        let serviceNumber = parentElement.querySelector('.service__counter').innerHTML;
        document.querySelector('.service-content .service__counter').innerHTML = serviceNumber;

        pathChange(this.dataset.service);
        
        //  Смена услуги в POPUP по вкладке
        $(`option[value=${this.dataset.service}]`)[0].selected = true;
        
    }    
}
serviceLinks.forEach( item => item.addEventListener('click', toggleService));
// Смена Хэш пути в URL
function pathChange(selector) {
    let windowPath = window.location.href;
    let windowPathArr = windowPath.split('#');
    if (windowPathArr.length > 1) {
        windowPathArr.pop();
        windowPathArr.push('#' + document.querySelector(`a[data-service="${selector}"]`).dataset.service_name);
        window.location.href = windowPathArr.join('');
        console.log(window.location.href = windowPathArr.join(''));   
    } else {
        windowPathArr.push('#' + document.querySelector(`a[data-service="${selector}"]`).dataset.service_name);
        window.location.href = windowPathArr.join('');
        console.log(window.location.href = windowPathArr.join('')); 
    }
}
// Инициализация ссылки с Хэш
function serviceInit () {
    let windowPathArr = window.location.href.split('#');
    console.log(window.location.href.split('#'));
    if( windowPathArr.length > 1 && windowPathArr[1] != "" ) {
        document.querySelector('.active').classList.toggle('active');
        document.querySelector('.service-active').classList.toggle('service-active');
        //console.log(document.querySelector(`a[data-service_name="${windowPathArr.length-1}"]`));
        let activeTab = document.querySelector(`a[data-service_name="${windowPathArr[windowPathArr.length-1]}"]`);
        if (activeTab != null) {
            activeTab.closest('.service').classList.toggle('active');
            document.querySelector(`#${activeTab.dataset['service']}`).classList.toggle('service-active');
            let serviceNumber = document.querySelector('.active .service__counter').innerHTML;
            document.querySelector('.service-content .service__counter').innerHTML = serviceNumber;
        
            $(`option[value=${activeTab.dataset.service}]`)[0].selected = true; //смена услуги в POPOUP
        }
    } 
}
document.onload = serviceInit();

//=============================================================
// Вызов POPUP окна
const popupModal = document.querySelector('.popup-modal-wrapper');
const popupButton = document.querySelector('.popup-button');

function togglePopup(e) {
    // e.preventDefault();
    if(e.toElement === $('.popup-close')[0]){
        e.preventDefault(); 
    }
    if(popupModal.classList.contains('popup-active')){
        if(e.toElement === popupModal || e.toElement === $('.popup-close')[0]){
            popupModal.classList.toggle('popup-active');
        }
    } else {
        e.preventDefault();
        popupModal.classList.toggle('popup-active');
    }
}
if(popupButton != null){
    popupButton.addEventListener('click' , togglePopup);
    $('.popup-button').on('click' , togglePopup);
}
if(popupModal != null){
    popupModal.addEventListener('click' , togglePopup);
}
//=============================================================
//Маска ввода номера в POPUP
$(document).ready(function(){
    if($('.form-box__phone-field')[0] != undefined) {
        $('.form-box__phone-field').inputmask({"mask": "+7(999) 999-9999"}); //specifying options
    }
});
//=============================================================
// Функция отправки формы POPUP в mail.php
const callbackForm = document.querySelector('#callback-form');
function handlePopupSubmit(e) {
    e.preventDefault();
    
    const formData = popupFormData;
    formData.delete('service');
    formData.append('service', getSelectedOption() );
    let xhr = new XMLHttpRequest();
    xhr.open('POST',  `${location.origin}/php/mail.php` ); //'http://element-pb.ru/php/mail.php' `${location.origin}/php/mail.php`
    xhr.responseType = 'json';
    xhr.send( formData );
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status == 200){
            console.log(xhr);
            
            
            if (xhr.response === true) {
                document.querySelector('.form-box__send-button').innerHTML = 'отправлено';
                if (xhr.response === true) {
                    setTimeout(() => {
                        popupModal.classList.toggle('popup-active');
                        formReset();
                    }, 2000)
                }
            }
        } else if( xhr.readyState === 4 && xhr.status != 200 ){
            document.querySelector('.form-box__send-button').innerHTML = 'ошибка';
        }
    }
}
//============== Выбранный option Формы===============
function getSelectedOption () {
    let selectedOption;
    $('option.field').each( function ( i , element) {
        if( element.selected === true) {
            selectedOption = element.innerHTML;
        }
    });
    if ( selectedOption === undefined ) {
        selectedOption = 'Узнать стоимость'
    }
    return selectedOption;
}

// if (callbackForm != null) {
//     callbackForm.addEventListener('submit', handlePopupSubmit );
// }
//============== ОЧИСТКА ФОРМЫ ==============
function formReset() {
  $('#callback-form')[0].reset();
  if ( $('.popup-file__success')[0] != undefined ){
    $('.popup-file__success')[0].innerHTML = '';
  }
  $('.form-box__send-button')[0].innerHTML = 'Отправить';
}
//=============================================================
//Вылидация полей формы и отправка формы при success === true
$('#callback-form').submit('submit', function () {
    let form = $(this);
    let field = [];
    let success = [];
    form.find('input.field').each(function () {
      field.push('input.field');
      var value = $(this).val();
      for(var i=0;i<field.length;i++) {
        if( !value ) {
            $(this).addClass('field-required');
            setTimeout(function() {
            $(this).removeClass('field-required')
            }.bind(this),2000);
            event.preventDefault();
            success.push(false);
        } else {
            success.push(true);
        }
      }
    });
    if ( success.indexOf(false) == -1 ) {
        event.preventDefault();
        console.log(event);
        handlePopupSubmit(event);
    } 
  });
//=============Отображение прикреплённых файлов================
function displayAttachedFiles (e) {
    $('.popup-file__success')[0].innerHTML = '';
    if(this.files.length > 0){
        Array.from(this.files).forEach( (file, i) => {
            console.log(file, i);
            
            let fileHtml = `
            <div class="popup-file__success-file" id="attached-file-${i}">
                <span>${file.name}</span>
                <div class="popup-file__remove"></div>
            </div>
            `;
            $('.popup-file__success').prepend(fileHtml);
        });
        $('.popup-file__remove').on('click', deleteAttachedFile);
    }
}
$('#file').on('change', displayAttachedFiles);
//===================== Удаление Файла ========================
function deleteAttachedFile (e) {
    if ( confirm('Удалить файл?') ) {
        this.closest('.popup-file__success').innerHTML = '';
        popupFormData.delete('file');
        $('form #file').val('');
    }
}
//===================== PopUp FormData ========================
function optionAppend (e) {
    let optionName = this.name;
    let optionValue = this.value;
    popupFormData.delete(optionName);
    if ( this.files != null) {
        popupFormData.append( 'file', this.files[0], this.files[0].name);
    } else {
    popupFormData.append(optionName, optionValue);
    }
}
$('form input').on('change', optionAppend);
//================== Статус кнопки ОТПРАВИТЬ ==================
function checkFields () {
    if (callbackForm.name.value !== "") {
        if ( phonePattern.test(callbackForm.phone.value) ) {
            if ( $('.send-button-active')[0] === undefined ) {
                $('.form-box__send-button').addClass('send-button-active'); 
            }
        } else {
            $('.form-box__send-button').removeClass('send-button-active');
        }
    } else {
        $('.form-box__send-button').removeClass('send-button-active');
    }
}
$('#callback-form').on('input', checkFields);

//=============== Мобильное МЕНЮ==============================
const menuCloseButton = $('.navigation__close');
const menuOpenButton = $('.navigation-menu-button');

menuOpenButton.on('click', () => {$('.navigation').addClass('navigation-active')});
menuCloseButton.on('click', () => {$('.navigation').removeClass('navigation-active')});

//=============== Кнопка НАВЕРХ ==============================
const toTopButton = $('.backtotop-button');
if (toTopButton[0] != undefined) {
    $(window).scroll(function() {
        if ($(this).scrollTop()) {
            toTopButton.fadeIn();
        } else {
            toTopButton.fadeOut();
        }
    });
    
    toTopButton.click(function (e) {
        e.preventDefault();
       //1 second of animation time
       //html works for FFX but not Chrome
       //body works for Chrome but not FFX
       //This strange selector seems to work universally
       $("html, body").animate({scrollTop: 0}, 1000);
    });
}

//============== Кнопки ВЛЕВО ВПРАВО =======================
const servicesRight = $('.service-right');
const servicesLeft = $('.service-left');
const servicesBox = $('.services');

const scrollLength = () => servicesBox[0].scrollWidth - servicesBox[0].offsetWidth;

if (servicesRight[0] != undefined) {
    servicesBox.scroll(function() {
        if ($('.services').scrollLeft()) {
            servicesLeft.fadeIn();
        } else {
            servicesLeft.fadeOut();
        }
        if ($('.services')[0].scrollLeft !== scrollLength()) {
            servicesRight.fadeIn();
        } else {
            servicesRight.fadeOut();
        }
    });
    
    servicesRight.click(function (e) {
        e.preventDefault();
       servicesBox.animate({scrollLeft: servicesBox[0].scrollLeft + 300}, 300);
    });
    servicesLeft.click(function (e) {
        e.preventDefault();
       servicesBox.animate({scrollLeft: 0}, 300);
    });
}

//=================== Minimixed HEADER APEARE =================
$(window).scroll(function() {
    if ($(window).width() <= 986) {
        if ($(window).scrollTop() >= 55 && !$('.header-minimize')[0]) {
            $('.header').css({'top': '-55px'});
            $('.header').addClass('header-minimize');
            $('.header').animate({top: "0px"}, 300);
        } else if ($(window).scrollTop() <= 55 && $('.header-minimize')[0]) {
            $('.header').animate({top: "-55px"}, 300, "swing", function() {
                $('.header').removeClass('header-minimize');
            } );
        }
    }
});
//=============================================================
// Яндекс карты
if (typeof ymaps !== 'undefined') {
    ymaps.ready(init);
        function init(){
            // Создание карты.
            var myMap = new ymaps.Map("map", {
                // Координаты центра карты.
                // Порядок по умолчанию: «широта, долгота».
                // Чтобы не определять координаты центра карты вручную,
                // воспользуйтесь инструментом Определение координат.
                center: [55.84765663, 37.50505730],
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
}
//=============================================================
//Изменение POPUP для Моб. версии
const popupTitle = $('.popup-title').prop('innerHTML');
const popupTitleText = $('.popup-title-text').prop('innerHTML');
const checkboxTextSpan = $('.checkbox-text span').prop('innerHTML');

function changeTexts ( modal ) {
    if ( modal === 'main' ) {
        $('.chckbx').prop('required', false);
        $('option:nth-child(6)').prop('selected', true);
        $('.popup-title').prop('innerText', 'Пожалуйста, заполните форму');
        $('.popup-title-text').prop('innerText', 'Наши специалисты свяжутся с Вами в ближайшее время!');
        $('.checkbox-text span').prop('innerText', 'Нажимая кнопку ниже, Вы даете свое согласие с');
    }
    if ( modal === 'services' ) {
        $('.checkbox-text span').prop('innerText', 'Нажимая кнопку ниже, Вы даете свое согласие с');
    }     
}
function changeTextsBack ( modal ) {
    if ( modal = 'main' ) {
        $('.chckbx').prop('required', true);
            $('.popup-title').prop('innerHTML', `${popupTitle}`);
            $('.popup-title-text').prop('innerHTML', `${popupTitleText}`);
            $('.checkbox-text span').prop('innerHTML', `${checkboxTextSpan}`);
    }
    if ( modal === 'services' ) {
        $('.checkbox-text span').prop('innerHTML', `${checkboxTextSpan}`);
    }  
}

if ( $(window).width() <= 450 && $('.chckbx').prop('required') && $('.main-modal')[0] ){
    changeTexts( 'main' );
} else if ( $(window).width() <= 450 && $('.chckbx').prop('required') && $('.services-modal')[0] ){
    changeTexts( 'services' );
}
$(window).on('resize', function(){
    if ( $(window).width() <= 450 && $('.chckbx').prop('required') && $('.main-modal')[0] ){
        changeTexts('main');        
    } else if ( $(window).width() > 450 && !$('.chckbx').prop('required') && $('.main-modal')[0] ){
        changeTextsBack('main');
    }
    if ( $(window).width() <= 450 && $('.chckbx').prop('required') && $('.services-modal')[0] ){
        changeTexts('services');        
    } else if ( $(window).width() > 450 && !$('.chckbx').prop('required')  && $('.services-modal')[0]){
        changeTextsBack('services');
    }   
})

//===============================================================
// Изменение Кнопок Нормативов
const buttonText = $('.content-box__text-button__link span').prop('innerHTML');

function changeButtonText () {
    $('.content-box__text-button__link span').prop('innerHTML', 'СМОТРЕТЬ');    
}
function changeButtonTextBack () {
    $('.content-box__text-button__link span').prop('innerHTML', `${buttonText}`);
}

if ( $(window).width() <= 710 && $('.standards')[0] ){
    changeButtonText();
}
$(window).on('resize', function(){
    if ( $(window).width() <= 710 && $('.standards')[0] ){
        changeButtonText();        
    } else if ( $(window).width() > 710 && $('.standards')[0] ){
        changeButtonTextBack();
    }
})
//===============================================================
// Копирование КАК ДОБРАТСЬЯ
const howToGet = $('.howtoget');

if ( $(window).width() <= 450 && $('.contacts-box')[0] ){
    $('<div>', {'class': 'contacts-box-row third-col'}).appendTo('.contacts-box');
    howToGet.appendTo('.contacts-box-row:nth-child(3)');
}
$(window).on('resize', function(){
    if ( $(window).width() <= 450 && $('.address + .howtoget')[0] && !$('.third-col')[0] ){
        $('<div>', {'class': 'contacts-box-row third-col'}).appendTo('.contacts-box');
        howToGet.appendTo('.contacts-box-row:nth-child(3)');        
    } else if ($(window).width() <= 450 && $('.address + .howtoget')[0] && $('.third-col')[0]) {
        howToGet.appendTo('.contacts-box-row:nth-child(3)');
    }
    if ( $(window).width() > 450 && $('.contacts-box .howtoget')[0] ){
        howToGet.appendTo('.contacts-box-row:nth-child(1)'); 
    }
})


