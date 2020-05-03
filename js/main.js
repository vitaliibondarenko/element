
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
    xhr.open('POST', 'http://element/php/mail.php');
    xhr.responseType = 'json';
    xhr.send( formData );
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status == 200){
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
