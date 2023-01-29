/* Makes jQuery accessible via $ using function escope because tray load another lib which creates conflict with jQuery $ */
(function($){
    $.fn.changeElementType = function(newType) {
        var attrs = {};

        $.each(this[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };

    Number.prototype.formatMoney = function(precision = 2, decimal = '.', thousands = ',', withCurrency = false) {

        const placeholderRegex = /{{\s*(\w+)\s*}}/;
        const format           = 'R$ {{amount}}';

        let number = this.toFixed(precision);

        let parts         = number.split('.');
        let dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
        let centsAmount   = parts[1] ? decimal + parts[1] : '';
        let value         = dollarsAmount + centsAmount;

        return (withCurrency) ? format.replace(placeholderRegex, value) : value;

    };

    window.theme = {

        ...window.theme,

        settings :{
            lastScrollPosition        : 0,
            storeId                   : 0,
            productVariantsQuantities : null,
            productThumbs             : null,
            productGallery            : null
        },


        /* General */

        recoveryStoreId: function(){
            this.settings.storeId = $('html').data('store');
        },

        resets: function(){

            // logo tray
            let trayLogo = $('.logotray-message a');
            trayLogo.attr('rel', 'noopener').attr('href', trayLogo.attr('href').replace('http', 'https'));

            // modal remove id duplcate

            $('[role="dialog"] .modal-title').removeAttr('id');


            /* Advanced search page */
            $('.page-search #Vitrine input[type="image"]').after('<button type="submit" class="botao-commerce">BUSCAR</button>')
            $('.page-search #Vitrine input[type="image"]').remove();
            $('.advancedSearchFormBTimg').addClass('botao-commerce');

            $('.page-central_senha input[type="image"]').after('<button type="submit" class="botao-commerce">CONTINUAR</button>').remove();
            $('.caixa-cadastro #email_cadastro').attr('placeholder', 'Seu e-mail');

            $('#imagem[src*="filtrar.gif"]').after('<button type="submit" class="botao-commerce">Filtrar</button>');
            $('#imagem[src*="filtrar.gif"]').remove();

            $('input[src*="gerarordem.png"]').after('<button type="submit" class="botao-commerce">Gerar ordem de devolu&ccedil;&atilde;o</button>');
            $('input[src*="gerarordem.png"]').remove();

        },

        initMasks: function(){

            let phoneMaskBehavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            };

            let phoneMaskOptions = {
                onKeyPress: function(val, e, field, options) {
                    field.mask(phoneMaskBehavior.apply({}, arguments), options);
                }
            };

            $('.phone-mask').mask(phoneMaskBehavior, phoneMaskOptions);

            $('.zip-code-mask').mask('00000-000');

        },

        initLazyload: function(selector = '.lazyload'){
            new LazyLoad({
                elements_selector: selector
            });
        },

        getLoader: function(message = null){
            return `
                <div class="loader show">
                    <div class="spinner">
                        <div class="double-bounce-one"></div>
                        <div class="double-bounce-two"></div>
                    </div>
                    ${ message ? `<div class="message">${message}</div>` : ''}
                </div>`;
        },

        scrollToElement: function (target, adjust = 0) {
            if(target && target !== "#"){

                $("html,body").animate({
                    scrollTop : Math.round($(target).offset().top) - adjust
                }, 600);

            }
        },

        overlay: function(){

            $('[data-toggle="overlay-shadow"]').on('click', function () {

                let target = $($(this).data('target'));
                target.addClass('show').attr('data-overlay-shadow-target', '');

                $('.overlay-shadow').addClass('show');
                $('body').addClass('overflowed');

            });

            $('.overlay-shadow').on('click', function(){
                $('[data-overlay-shadow-target]').removeClass('show').removeAttr('data-overlay-shadow-target');
                $('.overlay-shadow').removeClass('show');
                $('body').removeClass('overflowed');
            });

            $('.close-overlay').on('click', function(){
                $('.overlay-shadow').trigger('click');
            });

        },

        toggleModalTheme: function(){

            $('body').on('click', '[data-toggle="modal-theme"]', function(){
                $($(this).data('target')).addClass('show');
            });

            $('.modal-theme:not(.no-action) .modal-shadow, .modal-theme:not(.no-action) .close-icon').on('click', function(){
                $('.modal-theme').removeClass('show');
            });

        },

        generateBreadcrumb: function(local = ''){

            let items;
            let breadcrumb = '';
            let pageName   = document.title.split(' - ')[0];

            if(local == 'news-page'){
                items = [
                    { text: 'Home',            link: '/'         },
                    { text: 'Not&iacute;cias', link: '/noticias' },
                    { text: pageName }
                ];
            } else {
                items = [
                    { text: 'Home',  link: '/' },
                    { text: pageName }
                ];
            }

            $.each(items, function (index, item){
                if(this.link){

                    breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <a itemprop="item" class="t-color" href="${ item.link }">
                                <span itemprop="name">${ item.text }</span>
                            </a>
                            <meta itemprop="position" content="${ index + 1 }" />
                        </li>   
                    `;

                } else {

                    breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <span itemprop="name">${ item.text }</span>
                            <meta itemprop="position" content="${ index + 1 }" />
                        </li>          
                    `;

                }
            });

            $('.page-content > .container').prepend(`
                <ol class="breadcrumb flex f-wrap" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumb}
                </ol>
            `);

        },

        processRteElements: function(){

            $(`.col-panel .tablePage, 
               .page-extra .page-content table, 
               .page-extras .page-content table, 
               .board_htm table,
               .rte table,
               .page-noticia table
            `).wrap('<div class="table-overflow"></div>');

            $(`.page-noticia iframe[src*="youtube.com/embed"], 
               .page-noticia iframe[src*="player.vimeo"],
               .board_htm iframe[src*="youtube.com/embed"],
               .board_htm iframe[src*="player.vimeo"],
               .rte iframe[src*="youtube.com/embed"],
               .rte iframe[src*="player.vimeo"]
            `).wrap('<div class="rte-video-wrapper"></div>');

        },

        loadThemeVersion: function(){

            const themeVersion = Cookies.get('theme-version');
            const localPath = $('.local-path').attr('data-path');

            if(themeVersion){
                $('html').attr('data-tray-theme-version', themeVersion);
                return;
            }            

            $.getJSON(localPath + `js/version.json?t=${Date.now()}`, function(data){
                Cookies.set('theme-version', data.version, { expires: 7 });
                $('html').attr('data-tray-theme-version', data.version);
            });

        },

        /* Scroll behavior */

        setCorrectHeaderDesk: function(){

            let internal     = this;
            let deltaOne     = 32;
            let deltaTwo     = 152;
            let header       = $('.header');
            let nav          = $('.header .nav');
            let navbarHeight = $('.header').outerHeight() * 2;
            let position     = $(window).scrollTop();

            (position > deltaOne) ? header.addClass('hide-top-bar') : header.removeClass('hide-top-bar');
            (position > deltaTwo) ? header.addClass('fixed')        : header.removeClass('fixed');

            if(position > internal.settings.lastScrollPosition || position <= navbarHeight){
                nav.removeClass('show-nav');
            }
            else if(position > navbarHeight) {
                nav.addClass('show-nav');
            }

            internal.settings.lastScrollPosition = position;

        },

        setCorrectHeaderMobile: function(){

            let header       = $('.header');
            let headerMobile = $('.header-mobile');
            let headerHeight = $('.header').outerHeight() + 20;
            let position     = $(window).scrollTop() - 20;

            if(position > headerHeight){
                headerMobile.addClass('show');
                header.addClass('not-visible');
            } else {
                headerMobile.removeClass('show');
                header.removeClass('not-visible');
            }

        },

        scrollHeader: function () {

            let internal = this;

            if($(window).width() >= 768){
                this.setCorrectHeaderDesk();
            } else {
                this.setCorrectHeaderMobile();
            }

            $(window).on('scroll', function(){

                if($(window).width() >= 768){
                    internal.setCorrectHeaderDesk();
                } else {
                    internal.setCorrectHeaderMobile();
                }

            });

        },

        /* Main menu */

        fixSubcategoriesHeight: function(){

            let topContent   = $('.header').height();
            let windowHeight = $(window).height();
            let extraMargin  = 30;

            $('.nav .list > .first-level.sub .second-level').css('max-height', windowHeight - topContent - extraMargin);

        },

        mainMenu: function(){

            let internal = this;

            this.fixSubcategoriesHeight();

            $(window).on('resize', function(){
                internal.fixSubcategoriesHeight();
            });

        },

        mainMenuMobile: function(){

            $('.nav-mobile .first-level > .sub > a').on('click', function(event){

                let item = $(this).parent();

                item.toggleClass('show');

                if(item.hasClass('show')){
                    item.children('.sub').slideDown();
                } else {
                    item.children('.sub').slideUp();
                }

                event.preventDefault();
                return false;

            });

        },


        /* Index */

        bannerHome: function(){
            if($('.banner-home').length){

                let slideshow  = $('.banner-home');
                let size       = $('.swiper-slide', slideshow).length;
                let settings   = slideshow.data('settings');

                if(size > 0){

                    new Swiper('.banner-home .swiper-container', {
                        preloadImages : false,
                        loop          : true,
                        autoHeight    : true,
                        effect        : 'slide',
                        autoplay :{
                            delay: settings.timer,
                            disableOnInteraction : false
                        },
                        lazy :{
                            loadPrevNext: true,
                        },
                        pagination: {
                            el                : '.banner-home .dots',
                            bulletClass       : 'dot',
                            bulletActiveClass : 'dot-active',
                            clickable         : !settings.isMobile
                        },
                    });

                    if(settings.stopOnHover){

                        $('.banner-home .swiper-container').on('mouseenter', function(){
                            (this).swiper.autoplay.stop();
                        });

                        $('.banner-home .swiper-container').on('mouseleave', function(){
                            (this).swiper.autoplay.start();
                        });

                    }
                }

            }
        },

        storeReviewsIndex: function(){
            if(!$('.section-avaliacoes .dep_lista').length){

                $('.section-avaliacoes').remove();

            } else {

               
                $('.dep_lista').changeElementType('div');
                $('.dep_item').changeElementType('div');
                

                $('.dep_item').addClass('swiper-slide');
                $('.section-avaliacoes .dep_lista').addClass('swiper-wrapper').wrap('<div class="swiper-container"></div>');
                $('.section-avaliacoes .swiper-container').append(`
                    <div class="prev">
                        <i class="icon icon-arrow-left"></i>
                    </div>
                    <div class="next">
                        <i class="icon icon-arrow-right"></i>
                    </div>            
                    <div class="dots"></div>
                `);

                let swiper = new Swiper('.section-avaliacoes .swiper-container', {
                    slidesPerView: 3,
                    lazy: {
                        loadPrevNext: true,
                    },
                    navigation: {
                        nextEl: '.section-avaliacoes .next',
                        prevEl: '.section-avaliacoes .prev'
                    },
                    loop: false,
                    breakpoints :{
                        0 :{
                            slidesPerView : 1,
                        },
                        600 :{
                            slidesPerView : 2,
                        },
                        1000 :{
                            slidesPerView : 3,
                        }
                    },
                    pagination: {
                        el                : '.section-avaliacoes .dots',
                        type              : 'bullets',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : false
                    },
                    on: {
                        init: function () {
                            $('.section-avaliacoes').addClass('show');
                        },
                    }
                });

                $('.section-avaliacoes .dep_dados').wrap('<a href="/depoimentos-de-clientes" title="Ver depoimento"></a>');
                $('.dep_lista li:hidden').remove();

            }
        },

        loadNews: function(){
            if($('.section-news').length){

                let dataFiles = $('html').data('files');

                $.ajax({
                    url     : `/loja/busca_noticias.php?loja=${this.settings.storeId}&${dataFiles}`,
                    method  : 'get',
                    success : function(response){

                        let target;
                        let news;

                        if(!$(response).find('.noticias').length){
                            $('.section-news').remove();
                            return;
                        }

                        target = $('.section-news .news-content .swiper-wrapper');
                        news   = $($(response).find('.noticias'));

                        news.find('li:nth-child(n+4)').remove();
                        news.find('li').wrapInner('<div class="swiper-slide"><div class="box-noticia"></div></div>');
                        news.find('.swiper-slide').unwrap();
                        news = news.contents();

                        news.each(function (index, news){
                            let image  = $(news).find('img').closest('div').remove();
                        });

                        target.append(news);

                        new Swiper('.section-news .news-content', {
                            lazy : {
                                loadPrevNext: true,
                            },
                            pagination: {
                                el                : '.news-content .dots',
                                bulletClass       : 'dot',
                                bulletActiveClass : 'dot-active',
                                clickable         : false
                            },
                            breakpoints: {
                                0: {
                                    slidesPerView: 1
                                },
                                550: {
                                    slidesPerView: 2,
                                },
                                768: {
                                    slidesPerView: 3,
                                    allowTouchMove: false,
                                   
                                }
                            }
                        });

                    }
                });

            }
        },


        /* Category and search pages */

        slideCatalog: function(){
            if($('.slide-catalog').length){

                new Swiper('.slide-catalog', {
                    slidesPerView : 1,
                    preloadImages : false,
                    lazy :{
                        loadPrevNext: true,
                    },
                    pagination: {
                        el                : '.slide-catalog .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    }
                });

            }
        },

        sortMobile: function(){

            let options      = $();
            let selectedValue = $('#select_ordem').val();

            $('#select_ordem option').each(function(){
                options = options.add(
                    `<li ${ selectedValue === $(this).val() ? 'class="active"' : ''} data-option="${$(this).val()}">
                        ${$(this).text()}
                    </li>
                `);
            });

            $('.catalog-header .sort-mobile .sort-panel .sort-options').append(options);

            $('.catalog-header .sort-mobile .sort-panel .sort-options').on('click', 'li', function(){
                let option = $(this).data('option');
                $('#select_ordem').val(option).trigger('change');
            });

        },


        /* Product page */

        initProductGallery: function(){
            let zoomActive = $('.product-gallery').hasClass('zoom-true');

            let gallerySettings = {
                slidesPerView : 1,
                lazy :{
                    loadPrevNext: true,
                },
                on: {
                    init: function () {
                        if(!zoomActive) return;

                        if(this.slides.length === 1){
                            this.unsetGrabCursor();
                            this.allowTouchMove = false;
                        }

                        let wrapper = $('.product-wrapper .product-gallery').find(`.image[data-index="1"] .zoom`);

                        if(!wrapper.find('img:first').next().length){
                            wrapper.zoom({
                                touch : false,
                                url   : wrapper.find('img').attr('src')
                            });
                        }

                    },
                    slideChange: function () {
                        if(!zoomActive) return;
                        let index = this.activeIndex + 1;
                        let wrapper = $('.product-wrapper .product-gallery').find(`.image[data-index="${index}"] .zoom`);

                        if(!wrapper.find('img:first').next().length){
                            wrapper.zoom({
                                touch : false,
                                url   : wrapper.find('img').attr('src')
                            });
                        }

                    }
                }
            };


            if($('.product-wrapper .product-gallery .product-thumbs .swiper-slide').length){

                this.settings.productThumbs = new Swiper('.product-wrapper .product-gallery .product-thumbs .thumbs-list', {
                    slidesPerView: 4,
                    updateOnWindowResize: true,
                    centerInsufficientSlides: true,
                    watchSlidesProgress   : true,
                    watchSlidesVisibility : true,
                    navigation: {
                        nextEl: '.product-wrapper .product-gallery .product-thumbs .controls .next',
                        prevEl: '.product-wrapper .product-gallery .product-thumbs .controls .prev',
                    },
                    pagination: {
                        el                : '.product-wrapper .product-gallery .product-thumbs .thumbs-list .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    lazy :{
                        loadPrevNext: true,
                    },
                    breakpoints:{
                        0: {
                            slidesPerView: 3,
                        },
                        575: {
                            slidesPerView: 4,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1000: {
                            slidesPerView: 3,
                        },
                        1201: {
                            slidesPerView: 5,
                        }
                    },
                    on: {
                        init: function () {
                            $('.product-wrapper .product-gallery .product-thumbs').addClass('show');
                        }
                    }
                });

                gallerySettings.thumbs = {
                    autoScrollOffset     : 3,
                    multipleActiveThumbs : false,
                    swiper: this.settings.productThumbs
                };

            }

            this.settings.productGallery = new Swiper('.product-wrapper .product-gallery .product-images', gallerySettings);

        },

        recreateProductGallery: function(images){

            let productName = $('.product-wrapper .product-form .product-name').text();
            let htmlThumbs  = ``;
            let htmlImages  = ``;

            $.each(images, function (index, item){

                let slideIndex = index + 1;

                htmlImages += `
                    <div class="image swiper-slide ${ slideIndex === 1 ? 'active' : '' }" data-index="${slideIndex}">
                        <div class="zoom">
                            <img class="swiper-lazy" data-src="${item.https}" alt="${productName}">
                        </div>
                    </div>
                `;

                htmlThumbs +=
                    `<li class="swiper-slide ${ slideIndex === 1 ? 'active' : '' }" data-index="${slideIndex}">
                        <div class="thumb">
                            <img src="${item.thumbs[90].https}" alt="${productName}">
                        </div>
                    </li>
                `;

            });

            if(theme.settings.productThumbs){
                theme.settings.productThumbs.destroy();
            }

            if(theme.settings.productGallery){
                theme.settings.productGallery.destroy();
            }

            $('.product-wrapper .product-gallery .product-images .image').remove();
            $('.product-wrapper .product-gallery .product-thumbs .swiper-slide').remove();
            $('.product-wrapper .product-gallery .product-images .swiper-wrapper').html(htmlImages);

            if(images.length > 1){

                $('.product-wrapper .product-gallery .product-thumbs').addClass('show');
                $('.product-wrapper .product-gallery .product-thumbs .thumbs-list .swiper-wrapper').html(htmlThumbs);

            } else {
                $('.product-wrapper .product-gallery .product-thumbs').removeClass('show');
            }

            theme.initProductGallery();

        },

        toggleProductVideo: function(){

            let internal = this;

            $('.product-wrapper .product-box .product-video').on('click', function(){

                $('.modal-video').find('iframe').attr('data-src', $(this).data('url'));
                $('.modal-video').addClass('show');

                internal.initLazyload('.iframe-lazy');

            });

            $('.modal-video, .modal-video .close-icon').on('click', function(event){
                if(!$(event.target).hasClass('modal-info')){
                    setTimeout(function () {
                        $('.modal-video .video iframe').removeAttr('src').removeClass('loaded').removeAttr('data-was-processed data-ll-status');
                    },300);
                }
            });

        },

        goToProductReviews: function(){

            let internal = this;

            $('.product-wrapper .product-box .product-form .product-rating .total').on('click', function(){

                let target;
                let adjust;

                if($(window).width() < 768){
                    target = '.product-tabs .tabs-content .tab-link-mobile.comments-link-tab';
                    adjust = 60;
                } else {
                    target = '.product-tabs .tabs-nav .tab-link.comments-link-tab';
                    adjust = 120;
                }

                $(target).trigger('click');
                internal.scrollToElement(target, adjust);

            });

            setTimeout(() => {
                $("#form-comments .submit-review").on("click", function(e){

                    if(!$("#form-comments .stars .starn.star-on").length) {
                        var textError = 'Avaliação do produto obrigatória, dê sua avaliação por favor';
                        $("#div_erro .blocoAlerta").text(textError).show();
                        setTimeout(() => {
                            $("#div_erro .blocoAlerta").hide();
                        }, 5000);
                    }

                });
            }, 3000);

        },

        getShippingRates: function(){

            let internal = this;
            var quantity = 1;

            $('.shipping-form').on('submit', function(event){

                event.preventDefault();

                let variant  = $('#form_comprar').find('input[type="hidden"][name="variacao"]');
                let url      = $('#shippingSimulatorButton').data('url');                
                let cep      = $('input', this).val().split('-');

                if (jQuery('#quant:visible').is(':visible')) {
                    quantity = jQuery('#quant:visible').val();
                }

                if(variant.length && variant.val() === ''){
                    $('.product-shipping .result').addClass('loaded').html(`<div class="error-message">Por favor, selecione as varia&ccedil;&otilde;es antes de calcular o frete.</div>`);
                    return;
                }

                variant = variant.val() || 0;

                url = url.replace('cep1=%s', `cep1=${cep[0]}`  )
                         .replace('cep2=%s', `cep2=${cep[1]}`  )
                         .replace('acao=%s', `acao=${variant}` )
                         .replace('dade=%s', `dade=${quantity}`);


                $('.product-shipping .result').removeClass('loaded').addClass('loading').html(internal.getLoader('Carregando fretes...'));

                /* Validate zip code first using viacep web service */
                $.ajax({
                    'url'      : `https://viacep.com.br/ws/${cep[0]+cep[1]}/json/`,
                    'method'   : 'get',
                    'dataType' : 'json',
                    'success'  : function (viacepResponse) {

                        if(viacepResponse.erro){

                            let message = 'Cep inv&aacute;lido. Verifique e tente novamente.'
                            $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                            return;

                        }

                        $.ajax({
                            'url'    : url,
                            'method' : 'get',
                            'success' : function (response) {

                                if(response.includes('N&atilde;o foi poss&iacute;vel estimar o valor do frete')){

                                    let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarte.'
                                    $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                                    return;

                                }

                                let shippingRates = $(response.replace(/Prazo de entrega: /gi, ''));
                                let local = shippingRates.find('p .color').html().replace(/\s\s\\\s/g, '').replace(/ \\/g, ',');

                                //shippingRates.find('table:first-child, p, table tr td:first-child').remove();
                                shippingRates.find('table:first-child, p').remove();
                                shippingRates.find('table, table th, table td').removeAttr('align class width border cellpadding cellspacing height colspan');

                                shippingRates.find('table').addClass('shipping-rates-table');

                                var frete = shippingRates.find('table th:first-child').text();
                                if (frete == 'Forma de Envio:'){
                                    shippingRates.find('table th:first-child').html('Frete').attr("colspan", "2");
                                }

                                var valor = shippingRates.find('table th:nth-child(2)').text();
                                if (valor == 'Valor:'){
                                    shippingRates.find('table th:nth-child(2)').html('Valor');
                                }

                                var prazo = shippingRates.find('table th:last-child').text();
                                if (prazo == 'Prazo de Entrega e Observações:'){
                                    shippingRates.find('table th:last-child').html('Prazo');
                                }
                                shippingRates = shippingRates.children();

                                $('.product-shipping .result').removeClass('loading').addClass('loaded').html('').append(shippingRates);

                            },
                            'error' : function (request, status, error) {

                                console.error(`[Theme] Could not recover shipping rates. Error: ${error}`);

                                if(request.responseText !== ''){
                                    console.error(`[Theme] Error Details: ${request.responseText}`);
                                }

                                let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.'
                                $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                            }
                        });

                    },
                    'error': function (request, status, error) {

                        console.error(`[Theme] Could not validate cep. Error: ${error}`);
                        console.error(`[Theme] Error Details: ${request.responseJSON}`);

                        let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.'
                        $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                    }
                });

                return false;

            });

        },

        productBuyTogether: function(){

            let internal = this;

            $('.compreJunto form .fotosCompreJunto').append('<div class="plus color to">=</div>');

            $('.compreJunto .produto img').each(function(){

                let imagUrl = $(this).attr('src').replace('/90_', '/180_');
                let link    = $(this).parent().attr('href') || '';
                let name    = $(this).attr('alt');

                $(this).addClass('lazyload-buy-together').attr('src', '').attr('data-src', imagUrl);
                internal.initLazyload('.lazyload-buy-together');

                if(link !== ''){
                    $(this).unwrap();
                    $(this).parents('span').after(`<a class="product-name" href="${link}">${name}</a>`);
                } else {
                    $(this).parents('span').after(`<span class="product-name">${name}</span>`);
                }

            });

        },

        loadProductPaymentOptionsTab: function(){

            let productId     = $('#form_comprar').data('id');
            let price         = $('#preco_atual').val();
            let paymentTab    = $('.product-tabs .tabs-content .payment-tab');
            let previousPrice = paymentTab.attr('data-loaded-price');

            if(previousPrice !== price){

                $.ajax({
                    'url'     : `/mvc/store/product/payment_options?loja=${theme.settings.storeId}&IdProd=${productId}&preco=${price}`,
                    'method'  : 'get',
                    'success' : function (response){

                        let html = $(response);

                        html = html.find('#atualizaFormas').unwrap();
                        html = html.find('ul.Forma1').unwrap();

                        html.find('li').each(function () {
                            let image = $('img', this).remove();
                            $('a', this).prepend(image);
                        });

                        html.find('table br').remove();
                        html.find('table td:first-child').remove();

                        html.find('table').removeAttr('id class width cellpadding cellspacing border style');
                        html.find('table td, table th').removeAttr('class width style');
                        html.find('li').removeAttr('id style');
                        html.find('li a').removeAttr('id class name');
                        html.find('li a img').removeAttr('border');

                        html.removeClass().addClass('payment-options');
                        html.find('li').addClass('option');
                        html.find('li a').attr('href', 'javascript:void(0)');
                        html.find('table').wrap('<div class="option-details"></div>');
                        html.find('.option-details').css('display', 'none');

                        paymentTab.attr('data-loaded-price', price);
                        paymentTab.html('').append(html);

                    }
                });

            }

        },

        productTabsAction: function(){

            let internal = this;

            $('.tab-link-mobile[href*="AbaPersonalizada"]').each(function(){

                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                $(target).detach().insertAfter(this);

            });

            $('.product-tabs .tabs-content .tab[data-url]').each(function(){

                let tab = $(this);
                let url = tab.data('url');

                if(tab.hasClass('payment-tab')){

                    internal.loadProductPaymentOptionsTab();

                } else {
                    $.ajax({
                        'url'     : url,
                        'method'  : 'get',
                        'success' : function (response){
                            tab.html(response);
                        }
                    });
                }

            });

            $('.product-tabs .tabs-content .tab.payment-tab').on('click', '.option a', function (){

                let parent = $(this).parent();
                let table  = $(this).next();

                if (parent.hasClass('show')){
                    parent.removeClass('show');
                    table.slideUp();
                } else {
                    parent.addClass('show');
                    table.slideDown();
                }

            });

            $('.product-tabs .tabs-nav .tab-link').on('click', function (event) {

                let tabs = $(this).closest('.product-tabs');

                if(!$(this).hasClass('active')){

                    let target = $(this).attr('href').split('#')[1];
                    target = $(`#${target}`);

                    $('.tab-link', tabs).removeClass('active');
                    $(this).addClass('active');

                    $('.tabs-content .tab', tabs).fadeOut();

                    setTimeout(function (){
                        target.fadeIn();
                    }, 300);

                }

                event.preventDefault();
                event.stopPropagation();
                return false;

            });

            $('.product-tabs .tabs-content .tab-link-mobile').on('click', function (event){

                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                if($(this).hasClass('active')){

                    $(this).removeClass('active');
                    target.removeClass('active').slideUp();

                } else {

                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    $('.product-tabs .tabs-content .tab').removeClass('active').slideUp();

                    $(this).addClass('active');
                    target.addClass('active').slideDown();

                }

                event.preventDefault();
                event.stopPropagation();
                return false;

            });

            internal.productTabActionsOnResize();

            $(window).on('resize', function () {
                internal.productTabActionsOnResize();
            });

        },

        productTabActionsOnResize: function(){
            if($('.product-tabs .tabs-nav li').length){

                if($(window).width() < 768 && $('.product-tabs .tabs-nav .tab-link.active').length > 0){

                    $('.product-tabs .tabs-nav .tab-link').removeClass('active');
                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    $('.product-tabs .tabs-content .tab').removeClass('active').slideUp();

                } else if($(window).width() >= 768 && $('.product-tabs .tabs-nav .tab-link.active').length == 0) {

                    let firstLink = $('.product-tabs .tabs-nav .tab-link').first();
                    let target    = firstLink.attr('href').split('#')[1];

                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    firstLink.addClass('active');

                    $(`#${target}`).show();

                }

            }
        },

        observerProductPriceChange: function(){

            if($('.product-wrapper .product-form .product-price-tray').length){

                let target = $('.product-wrapper .product-form .product-price-tray').get(0);

                let options = {
                    childList: true,
                    subtree: true
                };

                let observer = new MutationObserver(function(){
                    theme.loadProductPaymentOptionsTab();
                });

                observer.observe(target, options);

            }

        },

        productReviews: function(){

            let commentsBlock = $(`<div class="product-comments">${window.commentsBlock}</div>`);

            commentsBlock.find('.hreview-comentarios + .tray-hide').remove();

            $.ajax({
                url: '/mvc/store/greeting',
                method: 'get',
                dataType: 'json',
                success: function(response){

                    if(!Array.isArray(response.data)){

                        commentsBlock.find('#comentario_cliente form.tray-hide').removeClass("tray-hide");

                        commentsBlock.find('#form-comments #nome_coment').val(response.data.name);
                        commentsBlock.find('#form-comments #email_coment').val(response.data.email);

                        commentsBlock.find('#form-comments [name="ProductComment[customer_id]"]').val(response.data.id);


                    } else {

                        commentsBlock.find('#comentario_cliente a.tray-hide').removeClass("tray-hide");
                    }

                    $('#tray-comment-block').before(commentsBlock);

                    $('#form-comments #bt-submit-comments').before('<button type="submit" class="submit-review">Enviar</button>').remove();

                    $('.ranking .rating').each(function() {

                        let review = Number($(this).attr('class').replace(/[^0-9]/g,''));

                        for (i = 1; i <= 5; i++){
                            if(i <= review){
                                $(this).append('<div class="icon active"></div>');
                            } else {
                                $(this).append('<div class="icon"></div>');
                            }
                        }

                    });

                    $('#tray-comment-block').remove();

                    theme.chooseProductRating();
                    theme.sendProductReview();

                }
            })
        },

        chooseProductRating: function() {
            $('#form-comments .rateBlock .starn').on('click', function(){

                let message = $(this).data('message');
                let rating = $(this).data('id');

                $(this).parent().find('#rate').html(message);
                $(this).closest('form').find('#nota_comentario').val(rating);

                $(this).parent().find('.starn').removeClass('star-on');

                $(this).prevAll().addClass('star-on');

                $(this).addClass('star-on');

            });
        },

        sendProductReview: function() {
            $('#form-comments').on('submit', function(event){

                let form = $(this);

                $.ajax({
                    url: form.attr('action'),
                    method: 'post',
                    dataType: 'json',
                    data: form.serialize(),
                    success: function(response) {

                        form.closest('.product-comments').find('.blocoAlerta').hide();
                        form.closest('.product-comments').find('.blocoSucesso').show();

                        setTimeout(function(){

                            form.closest('.product-comments').find('.blocoSucesso').hide();
                            $('#form-comments #mensagem_coment').val('');

                            form.find('#nota_comentario').val('');
                            form.find('#rate').html('');

                            form.find('.starn').removeClass('star-on');

                        }, 8000);
                    },
                    error: function(response){

                        form.closest('.product-comments').find('.blocoSucesso').hide();
                        form.closest('.product-comments').find('.blocoAlerta').html(response.responseText).show();
                    }

                })

                event.preventDefault();
            })
        },

        productRelatedCarousel: function(){

            $('.section-product-related .product').on('mouseenter', function() {
                $('.showcase').addClass('z-index');
            });

            $('.section-product-related product').on('mouseleave', function() {
                $('.showcase').removeClass('z-index');
            });

            new Swiper('.section-product-related .swiper-container', {
                slidesPerView : 4,
                preloadImages : false,
                loop          : false,
                lazy :{
                    loadPrevNext: true,
                },
                navigation: {
                    nextEl: '.section-product-related .next',
                    prevEl: '.section-product-related .prev',
                },
                pagination: {
                    el                : '.section-product-related .dots',
                    bulletClass       : 'dot',
                    bulletActiveClass : 'dot-active',
                    clickable         : true
                },
                breakpoints: {
                    0: {
                        slidesPerView: 2
                    },
                    620: {
                        slidesPerView: 3
                    },
                    1200: {
                        slidesPerView: 4
                    },
                }
            });

        },

        organizeProductHistory: function(){

            let target = $('.products-history .container').get(0);

            if(!target){
                return;
            }

            let observer = new MutationObserver(function(mutationsList, observer){
                $.each(mutationsList, function(){
                    if(this.type == "childList" && $(this.target).prop('id') == "produtos"){

                        $('.products-history .container img[src*="sobconsulta"]').after('<div class="botao-commerce">Sob consulta</div>');

                        setTimeout(function () {
                            $('.products-history .history-loader').removeClass('show');
                        }, 200);

                        return false;

                    }
                });
            });

            observer.observe(target, { childList: true, subtree: true });

            $('.products-history').on('click', '#linksPag a', function (){
                $('.products-history #produtos').html('');
                $('.products-history .history-loader').addClass('show');
            });

        },

        loadProductVariantImage : function(id){
            $.ajax({
                url    : `/web_api/variants/${id}`,
                method : 'get',
                success: function (response){

                    let images = response.Variant.VariantImage;
                    
                    if(images.length){
                        theme.recreateProductGallery(images);
                    }

                },
                error: function (request, status, error) {
                    console.log(`[Theme] An error occurred while retrieving product variant image. Details: ${error}`);
                }
            });
        },

        detectProductVariantChanges: function(){

            let internal = this;

            $('.product-variants').on('click', '.lista_cor_variacao li[data-id]', function(){
                internal.loadProductVariantImage($(this).data('id'));
            });

            $('.product-variants').on('click', '.lista-radios-input', function(){
                internal.loadProductVariantImage($(this).find('input').val());
            });

            $('.product-variants').on('change', 'select', function(){
                internal.loadProductVariantImage($(this).val());
            });

            $('.product-variants').on('change', '.infoSelects', function(){
                var optionSelected = $(this).find('option:selected');
                if (optionSelected.val().length){
                    var rel = optionSelected.attr('rel');
                    var image = [
                        {
                            https: rel,
                            thumbs: {
                                    90: {
                                        https: rel,
                                    },
                            }
                        },
                    ];
                    theme.recreateProductGallery(image);
                }
            });
            
        },


        /* Store reviews page */

        organizeStoreReviewsPage: function(){

            if($('.page-content .container .btns-paginator').length){
                $('.page-content .container .btns-paginator').parent().addClass('store-review-paginator');
            }

            $('.page-content .container').append('<div class="botao-commerce show-modal-store-review" data-toggle="modal-theme" data-target=".modal-store-reviews">Deixe seu depoimento</div>');
            $('#depoimento #aviso_depoimento').after('<button type="button" class="botao-commerce send-store-review">Enviar</button>');

            $('.page-content h2:first').appendTo('.modal-store-reviews .modal-info');
            $('#depoimento').appendTo('.modal-store-reviews .modal-info');

            $('#comentario_cliente').remove();
            $('.modal-store-reviews #depoimento a').remove();

            $('.page-depoimentos .page-content').addClass('show');
            $('.page-depoimentos').addClass('show-menu');

        },

        validateStoreReviewForm: function(){

            $('.modal-store-reviews #depoimento').validate({
                rules: {
                    nome_depoimento :{
                        required: true
                    },
                    email_depoimento :{
                        required: true,
                        email: true
                    },
                    msg_depoimento: {
                        required: true
                    },
                    input_captcha: {
                        required: true
                    }
                },
                messages: {
                    nome_depoimento :{
                        required: "Por favor, informe seu nome completo",
                    },
                    email_depoimento:{
                        required : "Por favor, informe seu e-mail",
                        email    : "Por favor, preencha com um e-mail v&aacute;lido",
                    },
                    msg_depoimento: {
                        required: "Por favor, escreva uma mensagem no seu depoimento",
                    },
                    input_captcha: {
                        required: "Por favor, preencha com o c&oacute;digo da imagem de verifica&ccedil;&atilde;o"
                    }
                },
                errorElement : 'span',
                errorClass   : 'error-block',
                errorPlacement: function(error, element){

                    if(element.prop('type') === 'radio'){
                        error.insertAfter(element.parent('.nota_dep'));
                    }

                    else if(element.is('textarea')){
                        error.insertAfter(element.parent().find('h5'));
                    }

                    else {
                        error.insertAfter(element);
                    }
                }
            } );

            $('.modal-store-reviews #depoimento .send-store-review').on('click', function() {

                let form = $('.modal-store-reviews #depoimento');
                let button = $(this);

                if (form.valid()) {

                    button.html('Enviando...').attr('disabled', true);
                    enviaDepoimentoLoja();

                }

            });

            /* Create observer to detect Tray return */

            let target = $('#aviso_depoimento').get(0);
            let config = { attributes: true };

            let observerReviewMessage = new MutationObserver(function(mutationsList, observer){
                $('.depoimentos-modal #depoimento .send-store-review').html('Enviar').removeAttr('disabled');
            });

            observerReviewMessage.observe(target, config);

        },


        /* News page */
        organizeNewsPage: function(){

            if(!window.location.href.includes('busca_noticias')){
                $('#listagemCategorias').parent().before('<h1>Not&iacute;cias</h1>')
            }
            $('.noticias').find('li').wrapInner('<div class="box-noticia"></div>');
            
            $('.page-busca_noticias .box-noticia').each(function(){
                let link = $(this).find('#noticia_imagem a').attr('href');
                $(this).find('p').after(`<a href="${link}" class="button-show">Ver mais</a>`);
            });

            $('.page-busca_noticias .page-content').addClass('show');
            $('.page-busca_noticias').addClass('show-menu');

        },


        /* Contact page */
        organizeContactPage: function(){

            $('.page-contact .page-content > .container').prepend(`
                <h1>Fale conosco</h1>
                <p class="description">Precisa falar com a gente? Utilize uma das op&ccedil;&otilde;es abaixo para entrar em contato conosco.</p>
                <div class="cols">
                    <div class="box-form">                        
                    </div>
                    <div class="info-form"></div>
                </div>
            `);

            $($('.page-content .container3').eq(1)).appendTo('.info-form');
            $($('.page-content .container3 .container2 .container2').eq(0)).appendTo('.box-form');

            if($('.info-form h3:contains(Empresa)').length){
                $('.info-form h3:contains(Empresa)').parent().insertBefore($('.info-form h3:contains(Endere)').parent());
            }

            $('.info-form h3:contains(Endere)').parent().after($('.map-iframe'));
            $('.page-contact form img.image').after('<div class="flex justify-end"><span class="botao-commerce flex align-center justify-center">Enviar</span></div>').remove();
            $('.page-contact #telefone_contato').removeAttr('onkeypress maxlength').addClass('phone-mask');


            if($('.page-contact .contato-telefones .block:nth-child(1)').length){

                let phoneNumberFormatted = $('.page-contact .contato-telefones .block:nth-child(1)').text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                $('.page-contact .contato-telefones .block:nth-child(1)').html(`<a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberFormatted}</a>`);

            }

            if($('.page-contact .contato-telefones .block:nth-child(2)').length){

                let phoneNumberFormatted = $('.page-contact .contato-telefones .block:nth-child(2)').text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                $('.page-contact .contato-telefones .block:nth-child(2)').html(`<a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?l=pt&phone=55${phoneNumber}" title="Fale conosco no WhatsApp">${phoneNumberFormatted}</a>`);

            }

            $('.page-contact .page-content').addClass('active');

        },


        /* Gifts page */
        gifts: function(){
            $('#form_presentes input[type="image"]').prev().html('<div class="botao-commerce">Continuar Comprando</div>');
            $('#form_presentes input[type="image"]').wrap('<div class="relative-button"></div>').after('<button class="botao-commerce">Avan&ccedil;ar</button>').remove();
        },


        /* Newsletter page */
        organizeNewsletterPage: function(){

            if($('.page-newsletter .formulario-newsletter').length){

                $('.page-newsletter .formulario-newsletter .box-captcha input, .page-newsletter .formulario-newsletter .box-captcha-newsletter input').attr('placeholder', 'Digite o c&oacute;digo ao lado').trigger('focus');
                $('.formulario-newsletter .newsletterBTimg').html('Enviar').removeClass().addClass('botao-commerce');

            } else {

                $('.page-newsletter .page-content').addClass('success-message-newsletter');
                $('.page-newsletter .page-content.success-message-newsletter .board p:first-child a').addClass('botao-commerce').html('Voltar para p&aacute;gina inicial');

            }

            setTimeout(function () {
                $('.page-newsletter .page-content').addClass('show');
            }, 200);

        },
        /* To Action in ajax.html */ 
        updateCartTotal: function() {
            $('[data-cart="amount"]').text($('.cart-preview-item').length);
        }

    };

    $(function(){

        theme.resets();
        theme.recoveryStoreId();
        theme.scrollHeader();

        setTimeout(function(){
            theme.processRteElements();
            theme.loadThemeVersion();
            theme.initLazyload();
            theme.mainMenu();
            theme.mainMenuMobile();
            theme.initMasks();
            theme.toggleModalTheme();
            theme.overlay();
        },20);
      
        if($('html').hasClass('page-home')){
            setTimeout(function(){
                theme.bannerHome();
                theme.loadNews();
            }, 40);
            theme.storeReviewsIndex();
        }

        else if($('html').hasClass('page-newsletter')){
            theme.organizeNewsletterPage();
        }

        else if($('html').hasClass('page-catalog') || $('html').hasClass('page-search')){
            theme.slideCatalog();
            theme.sortMobile();
        }

        else if($('html').hasClass('page-product')){
            theme.initProductGallery();
            theme.toggleProductVideo();
            theme.detectProductVariantChanges();
            theme.goToProductReviews();
            theme.getShippingRates();
            theme.productBuyTogether();
            theme.productTabsAction();
            theme.observerProductPriceChange();
            theme.productReviews();
            theme.productRelatedCarousel();
            theme.organizeProductHistory();
        }

        else if ($('html').hasClass('page-busca_noticias')){
            theme.organizeNewsPage();
            theme.generateBreadcrumb('news-page-listing');
        }

        else if ($('html').hasClass('page-noticia')){
            theme.generateBreadcrumb('news-page');
        }

        else if ($('html').hasClass('page-depoimentos')){
            theme.organizeStoreReviewsPage();
            theme.validateStoreReviewForm();
        }

        else if($('html').hasClass('page-contact')){
            theme.organizeContactPage();
        }

        else if($('html').hasClass('page-finalizar_presentes')){
            theme.gifts();
        }

    });

}(jQuery));