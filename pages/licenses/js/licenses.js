const menuCloseButton = $('.navigation__close');
const menuOpenButton = $('.navigation-menu-button');

menuOpenButton.on('click', () => {$('.navigation').addClass('navigation-active')});
menuCloseButton.on('click', () => {$('.navigation').removeClass('navigation-active')});
