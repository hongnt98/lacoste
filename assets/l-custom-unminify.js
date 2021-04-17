/*! * imagesLoaded PACKAGED v4.1.4 * JavaScript is all like "You images are done yet or what?" * MIT License */
!function(e,t){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",t):"object"==typeof module&&module.exports?module.exports=t():e.EvEmitter=t()}("undefined"!=typeof window?window:this,function(){function e(){}var t=e.prototype;return t.on=function(e,t){if(e&&t){var i=this._events=this._events||{},n=i[e]=i[e]||[];return n.indexOf(t)==-1&&n.push(t),this}},t.once=function(e,t){if(e&&t){this.on(e,t);var i=this._onceEvents=this._onceEvents||{},n=i[e]=i[e]||{};return n[t]=!0,this}},t.off=function(e,t){var i=this._events&&this._events[e];if(i&&i.length){var n=i.indexOf(t);return n!=-1&&i.splice(n,1),this}},t.emitEvent=function(e,t){var i=this._events&&this._events[e];if(i&&i.length){i=i.slice(0),t=t||[];for(var n=this._onceEvents&&this._onceEvents[e],o=0;o<i.length;o++){var r=i[o],s=n&&n[r];s&&(this.off(e,r),delete n[r]),r.apply(this,t)}return this}},t.allOff=function(){delete this._events,delete this._onceEvents},e}),function(e,t){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(i){return t(e,i)}):"object"==typeof module&&module.exports?module.exports=t(e,require("ev-emitter")):e.imagesLoaded=t(e,e.EvEmitter)}("undefined"!=typeof window?window:this,function(e,t){function i(e,t){for(var i in t)e[i]=t[i];return e}function n(e){if(Array.isArray(e))return e;var t="object"==typeof e&&"number"==typeof e.length;return t?d.call(e):[e]}function o(e,t,r){if(!(this instanceof o))return new o(e,t,r);var s=e;return"string"==typeof e&&(s=document.querySelectorAll(e)),s?(this.elements=n(s),this.options=i({},this.options),"function"==typeof t?r=t:i(this.options,t),r&&this.on("always",r),this.getImages(),h&&(this.jqDeferred=new h.Deferred),void setTimeout(this.check.bind(this))):void a.error("Bad element for imagesLoaded "+(s||e))}function r(e){this.img=e}function s(e,t){this.url=e,this.element=t,this.img=new Image}var h=e.jQuery,a=e.console,d=Array.prototype.slice;o.prototype=Object.create(t.prototype),o.prototype.options={},o.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},o.prototype.addElementImages=function(e){"IMG"==e.nodeName&&this.addImage(e),this.options.background===!0&&this.addElementBackgroundImages(e);var t=e.nodeType;if(t&&u[t]){for(var i=e.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background){var r=e.querySelectorAll(this.options.background);for(n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}}};var u={1:!0,9:!0,11:!0};return o.prototype.addElementBackgroundImages=function(e){var t=getComputedStyle(e);if(t)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(t.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,e),n=i.exec(t.backgroundImage)}},o.prototype.addImage=function(e){var t=new r(e);this.images.push(t)},o.prototype.addBackground=function(e,t){var i=new s(e,t);this.images.push(i)},o.prototype.check=function(){function e(e,i,n){setTimeout(function(){t.progress(e,i,n)})}var t=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(t){t.once("progress",e),t.check()}):void this.complete()},o.prototype.progress=function(e,t,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded,this.emitEvent("progress",[this,e,t]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,e),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,e,t)},o.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(e,[this]),this.emitEvent("always",[this]),this.jqDeferred){var t=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[t](this)}},r.prototype=Object.create(t.prototype),r.prototype.check=function(){var e=this.getIsImageComplete();return e?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},r.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.img,t])},r.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype=Object.create(r.prototype),s.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var e=this.getIsImageComplete();e&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},s.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.element,t])},o.makeJQueryPlugin=function(t){t=t||e.jQuery,t&&(h=t,h.fn.imagesLoaded=function(e,t){var i=new o(this,e,t);return i.jqDeferred.promise(h(this))})},o.makeJQueryPlugin(),o});
!function(e,t){"function"==typeof define&&define.amd?define(["flickity/js/index","fizzy-ui-utils/utils"],t):"object"==typeof module&&module.exports?module.exports=t(require("flickity"),require("fizzy-ui-utils")):t(e.Flickity,e.fizzyUIUtils)}(this,function(e,t){var i=e.Slide,s=i.prototype.updateTarget;i.prototype.updateTarget=function(){if(s.apply(this,arguments),this.parent.options.fade){var e=this.target-this.x,t=this.cells[0].x;this.cells.forEach(function(i){var s=i.x-t-e;i.renderPosition(s)})}},i.prototype.setOpacity=function(e){this.cells.forEach(function(t){t.element.style.opacity=e})};var a=e.prototype;e.createMethods.push("_createFade"),a._createFade=function(){this.fadeIndex=this.selectedIndex,this.prevSelectedIndex=this.selectedIndex,this.on("select",this.onSelectFade),this.on("dragEnd",this.onDragEndFade),this.on("settle",this.onSettleFade),this.on("activate",this.onActivateFade),this.on("deactivate",this.onDeactivateFade)};var n=a.updateSlides;a.updateSlides=function(){n.apply(this,arguments),this.options.fade&&this.slides.forEach(function(e,t){var i=t==this.selectedIndex?1:0;e.setOpacity(i)},this)},a.onSelectFade=function(){this.fadeIndex=Math.min(this.prevSelectedIndex,this.slides.length-1),this.prevSelectedIndex=this.selectedIndex},a.onSettleFade=function(){(delete this.didDragEnd,this.options.fade)&&(this.selectedSlide.setOpacity(1),this.slides[this.fadeIndex]&&this.fadeIndex!=this.selectedIndex&&this.slides[this.fadeIndex].setOpacity(0))},a.onDragEndFade=function(){this.didDragEnd=!0},a.onActivateFade=function(){this.options.fade&&this.element.classList.add("is-fade")},a.onDeactivateFade=function(){this.options.fade&&(this.element.classList.remove("is-fade"),this.slides.forEach(function(e){e.setOpacity("")}))};var d=a.positionSlider;a.positionSlider=function(){this.options.fade?(this.fadeSlides(),this.dispatchScrollEvent()):d.apply(this,arguments)};var h=a.positionSliderAtSelected;a.positionSliderAtSelected=function(){this.options.fade&&this.setTranslateX(0),h.apply(this,arguments)},a.fadeSlides=function(){if(!(this.slides.length<2)){var e=this.getFadeIndexes(),t=this.slides[e.a],i=this.slides[e.b],s=this.wrapDifference(t.target,i.target),a=this.wrapDifference(t.target,-this.x);a/=s,t.setOpacity(1-a),i.setOpacity(a);var n=e.a;this.isDragging&&(n=a>.5?e.a:e.b),null!=this.fadeHideIndex&&this.fadeHideIndex!=n&&this.fadeHideIndex!=e.a&&this.fadeHideIndex!=e.b&&this.slides[this.fadeHideIndex].setOpacity(0),this.fadeHideIndex=n}},a.getFadeIndexes=function(){return this.isDragging||this.didDragEnd?this.options.wrapAround?this.getFadeDragWrapIndexes():this.getFadeDragLimitIndexes():{a:this.fadeIndex,b:this.selectedIndex}},a.getFadeDragWrapIndexes=function(){var e=this.slides.map(function(e,t){return this.getSlideDistance(-this.x,t)},this),i=e.map(function(e){return Math.abs(e)}),s=Math.min.apply(Math,i),a=i.indexOf(s),n=e[a],d=this.slides.length,h=n>=0?1:-1;return{a:a,b:t.modulo(a+h,d)}},a.getFadeDragLimitIndexes=function(){for(var e=0,t=0;t<this.slides.length-1;t++){var i=this.slides[t];if(-this.x<i.target)break;e=t}return{a:e,b:e+1}},a.wrapDifference=function(e,t){var i=t-e;if(!this.options.wrapAround)return i;var s=i+this.slideableWidth,a=i-this.slideableWidth;return Math.abs(s)<Math.abs(i)&&(i=s),Math.abs(a)<Math.abs(i)&&(i=a),i};var o=a._getWrapShiftCells;a._getWrapShiftCells=function(){this.options.fade||o.apply(this,arguments)};var r=a.shiftWrapCells;return a.shiftWrapCells=function(){this.options.fade||r.apply(this,arguments)},e});
!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function g(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}return function e(l){function C(e,n,o){var t;if("undefined"!=typeof document){if(1<arguments.length){if("number"==typeof(o=g({path:"/"},C.defaults,o)).expires){var r=new Date;r.setMilliseconds(r.getMilliseconds()+864e5*o.expires),o.expires=r}o.expires=o.expires?o.expires.toUTCString():"";try{t=JSON.stringify(n),/^[\{\[]/.test(t)&&(n=t)}catch(e){}n=l.write?l.write(n,e):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),e=(e=(e=encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var i="";for(var c in o)o[c]&&(i+="; "+c,!0!==o[c]&&(i+="="+o[c]));return document.cookie=e+"="+n+i}e||(t={});for(var a=document.cookie?document.cookie.split("; "):[],s=/(%[0-9A-Z]{2})+/g,f=0;f<a.length;f++){var p=a[f].split("="),d=p.slice(1).join("=");this.json||'"'!==d.charAt(0)||(d=d.slice(1,-1));try{var u=p[0].replace(s,decodeURIComponent);if(d=l.read?l.read(d,u):l(d,u)||d.replace(s,decodeURIComponent),this.json)try{d=JSON.parse(d)}catch(e){}if(e===u){t=d;break}e||(t[u]=d)}catch(e){}}return t}}return(C.set=C).get=function(e){return C.call(C,e)},C.getJSON=function(){return C.apply({json:!0},[].slice.call(arguments))},C.defaults={},C.remove=function(e,n){C(e,"",g(n,{expires:-1}))},C.withConverter=e,C}(function(){})});
(function($){
  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }
  $(document).ready(function(){

    $('button.flickity-button.flickity-prev-next-button.next').css('display', 'none');

    // global variables
    $body = $('body');

    // global functions
    $('.js-menu-open, .js-menu-close').click(function(e){
      $('.js-menu-main.sub-nav').toggleClass('is-opened')
      .children('.nav-wrapper')
      .toggleClass('is-active');
    });


    $('.main-nav-tabs .js-nav-wrapper .js-menu-item span').click(function(e){

      if ($(window).width() < 1190) {
        if(!$(this).closest('.sale-menu').length) e.preventDefault();
      }

      var $this = $(this);
      $this.closest('.nav-wrapper')
      .removeClass('is-active')
      $this.parent().children('.sub-nav').addClass('is-opened')
      .children('.nav-wrapper')
      .addClass('is-active');
    });

    $('.nav-back').click(function(e){
      e.preventDefault();
      var $this = $(this);
      $this.closest('.sub-nav').removeClass('is-opened');
      $this.parent().next('.nav-wrapper').removeClass('is-active');
    });


    $('.js-track').click(function(e) {
      e.preventDefault();
      $('.js-popin-container').show();
      setTimeout(function(){
        //$('#size-guide').toggleClass('is-opened').removeClass('is-hidden');
      },200)	

    });

    $('.js-popin-close').click(function(e) {
      e.preventDefault();
      $('.js-popin-container').children('.is-opened').removeClass('is-opened').addClass('is-hidden');
//       $(this).hide()
    });


    // search toggle
    $('.js-popin-btn.js-search').click(function(e){
      e.preventDefault();
      $('#search-popin').toggleClass('is-opened');
    });

    $('#global-search-form').submit(function(e){
      e.preventDefault();
      return false;
    });

    if (getUrlVars()['bastille'] == 'test'){
      var in30Minutes = 1/48;
      Cookies.set('bastille', 'test', { expires: in30Minutes });
    }

    // product page functions
    if ($body.hasClass('template-product')){

      // product json data
      if($('#ProductJson-l-product-template').length){
        window.pData = JSON.parse(document.getElementById('ProductJson-l-product-template').innerHTML);
      }
      window.pVars = window.pData.variants;
      var $addToCartBtn = $('#cta-btn-main'),
          $productFormID = $('#ProductID-l-product-template'),
          varslength = window.pVars.length;   

      function getStockText(varid){
        var invCount = window.viq[varid],
            stockText = (invCount > 1) ? ' stocks left' : ' stock left';
        if(invCount == 0){
          stockText = "Out of stock";
        } else {
          stockText = 'Only ' + invCount + stockText;
        }
      }

      function getVarID(opts){
        var optcolor = opts.color,
            optsize = opts.size;
        for (var a = 0; a < varslength; a++){
          var currVar = window.pVars[a],
              currColor = currVar.option1,
              currSize = currVar.option2

          if(currColor == optcolor && currSize == optsize){
            $productFormID.val(currVar.id);
          }
        }
      }

      function updateVarPrice(opts){
        var optid = opts.id;
        for (var a = 0; a < varslength; a++){
          var moneySymbol = "₱";
          var currVar = window.pVars[a],
              salePrice = currVar.price,
              origPrice = currVar.compare_at_price,
              $regPriceSpan = $('#ComparePrice-pl-product-template'),
              $salePriceSpan = $('#ProductPrice-pl-product-template'),
              currPrice = currVar.price/100,
              currPrice = currPrice.toFixed(2),
              currPrice = moneySymbol + currPrice.toLocaleString(),
              regPrice = currVar.compare_at_price/100,
              regPrice = regPrice.toFixed(2),
              regPrice = moneySymbol + regPrice.toLocaleString();

          if(currVar.id == optid){
            if(salePrice <= origPrice){
              $regPriceSpan.text(currPrice)
              //.parent().show();
              $salePriceSpan.text(regPrice);
            } else {
              //$regPriceSpan.parent().hide();
              //$salePriceSpan.text(currPrice);
              $salePriceSpan.text('')
              $regPriceSpan.text(currPrice);
            }
          }
        }
      }


      $('.cool-polo-flick').flickity();

      $('.haring-slider').imagesLoaded(function(){
        $('.haring-slider').flickity({
          // options
          // 		wrapAround: true
        });
      });

      //         



      $('.polo-cool-slider').flickity({
        // options
        cellAlign: 'left',
        contain: true
      });




      // panel slide trigger for size selection
      $('#trigger-size-panel').click(function(e){
        e.preventDefault();
        var $this = $(this);
        //$('.js-popin-container').show();
        var $sizePanel = $('#size-panel');
        $sizePanel.removeClass('is-hidden').siblings().removeClass('is-opened is-active');
        setTimeout(function(){
          $sizePanel.addClass('is-opened');
        },200)
      });

      // panel slide for size-guide
      $('.size-guide-popin-btn').click(function(e){
        e.preventDefault();
        var $this = $(this);
        //$('.js-popin-container').show();
        var $sizeGuidePanel = $('#size-guide');
        $sizeGuidePanel.removeClass('is-hidden').siblings().removeClass('is-opened');
        setTimeout(function(){
          $sizeGuidePanel.addClass('is-opened');
        },200)
      });
	
      $('#swatch-size-btn').click(function(){
        var $this = $(this),
            p = $this.closest('#size-panel'),
            s = p.prev(),
        	c = $this.closest('.js-popin-container');
        p.removeClass('is-opened is-active');
        s.removeClass('is-hidden').addClass('is-opened is-active');
        event.stopImmediatePropagation();
//         console.log(c)
      });



      if($('#product-new').length){

        $('.js-slideshow-wrapper img:eq(1)').imagesLoaded( function() {
          // images have loaded
          var prodSlider = $('.js-slideshow-wrapper .js-slideshow').flickity({
            // options
            cellAlign: 'center',
            contain: true,
            prevNextButtons: false,
            pageDots: false,
            setGallerySize: true,
            adaptiveHeight: true,
            on: {
              ready: function() {
                // console.log('let\'s get it on');
              },
              change: function( index ) {
//                 console.log( 'Slide changed to' + index );
                $('.js-slideshow-bullet').eq(index).addClass('is-active').siblings().removeClass('is-active')
                var slideSelected = $('.slide.is-selected').attr('data-zoom'),
                    slideColor = $('.slide.is-selected').attr('data-color'),
                    selectedColor = $('.js-pdp-color-list a.is-active').attr('data-color'),
                    colorFirst = $('.js-slideshow .slide[data-color="' +selectedColor+ '"]').first(),
                    colorLast = $('.js-slideshow .slide[data-color="' +selectedColor+ '"]').last(),
                    dataFirst = colorFirst.attr('data-zoom'),
                    dataLast = colorLast.attr('data-zoom'),
                    dataNext = parseInt(dataLast) + 1,
                    currentTrigger = $('.js-pdp-color-list a.is-active'),
                    triggerParent = currentTrigger.parent(),
                    triggerPrevParent = triggerParent.prev(),
                    triggerPrev = triggerPrevParent.children('a'),
                    triggerPrevColor = triggerPrev.attr('data-color'),
                    colorParent = currentTrigger.parent(),
                    colorParentNext = colorParent.next(),
                    colorParentNextChild = colorParentNext.children('a'),
                    colorNextColor = colorParentNextChild.attr('data-color'),
                    currentBullet = $('.js-slideshow-bullet.is-active[data-zoom="' +slideSelected+ '"]'),
                    bulletColor = $('.js-slideshow-bullet:eq('+index+')').attr('data-color'),
                    bulletCount = $('.js-slideshowbullet[data-color="' +slideColor+ '"]').attr('data-zoom'),
                    triggerDataLast = $('.js-pdp-color-list li.click-color a[data-color="' +triggerPrevColor+ '"]').attr('data-last'),
                    triggerDataFirst = $('.js-pdp-color-list li.click-color a[data-color="' +triggerPrevColor+ '"]').attr('data-first'),
                    dataPrev = $('.js-slideshow-bullet[data-color="' +triggerPrevColor+ '"]').length;
//                 console.log(triggerDataLast)
//                 console.log(triggerPrevColor)
                if($('.slide[data-zoom="' +dataNext+ '"]').hasClass('is-selected')){
                  $('.js-pdp-color-list li.click-color a[data-color="' +colorNextColor+ '"]').trigger('click')
                } else if($('.slide[data-zoom="' +triggerDataLast+ '"]').hasClass('is-selected')) {
                  $('.js-pdp-color-list li.click-color a[data-color="' +triggerPrevColor+ '"]').trigger('click');
                  //                 $('.js-slideshow-bullet[data-color="' +triggerPrevColor+ '"]').first().addClass('is-active').siblings().removeClass('is-active');
                }
                //                 $('.js-slideshow-thumbs .js-slideshow-bullet:eq('+index+')').addClass('is-active').siblings().removeClass('is-active');
                $('.js-pdp-color-list li.click-color a[data-color="' +selectedColor+ '"]').attr("data-first", dataFirst).attr("data-last", dataLast)
              }
            }
          });
          $('.js-slideshow-thumbs .js-slideshow-bullet').on('click', function(){
            var $this = $(this),
                index = $this.index(),
                sliderindex = $this.parent().index(),
                slidername = 'flickslider'+sliderindex,
                slider = prodSlider;
            $this.addClass('is-active').siblings().removeClass('is-active');
            slider.flickity('select',index);
          }).first().trigger('click');
        });




        // color selection version 3 by Rengie Nullan
        $('.js-pdp-color-list a').click(function(e){
          e.preventDefault();
          var $this = $(this),
              swatch = $this.children('img').attr('src'),
              color = $this.data('title'),
              sliderParent = $('.js-pdp-gallery.js-slideshow-wrapper'),
              sliderImages = sliderParent.find('.unique-wrap'),
              indexCount = 0,
              thisColor = $this.data("color"),
              allSizes = $('#popin-size .btn-size'),
              allSizeLngth = allSizes.length;
              console.log(allSizeLngth, 'allSizeLngth');


          // disable all sizes first
          $('#popin-size .btn-size').addClass('is-disabled');


          for (var a = 0; a < varslength; a++){
            var currVar = window.pVars[a],
                currColor = currVar.option1,
                currSize = currVar.option2;

            if(thisColor == currColor){

              if(currVar.available){

                $.each(allSizes, function(){
                  var $this2 = $(this),
                      $data = $this2.data("size")

                  if($data == currSize){
                    $this2.removeClass('is-disabled');

                    var opts = {
                      id: currVar.id
                    }
                    updateVarPrice(opts)
                  }                

                })

              }
            }

          }        

          sliderImages.each(function(){
            var $this2 = $(this)


            if($this2.data('color') == color ){

              $this2.parent().removeClass('hiden'); //added by Rengie to hide buttons on mobile
              $this2.removeClass('hiden') 

              if($this2.hasClass('for-btn')){
                indexCount++;
                if(indexCount == 1)
                  $this2.parent().trigger('click');
              }

            } else {
              // $this2.addClass('hiden') 
              $this2.parent().addClass('hiden');//added by Rengie to hide buttons on mobile
            }
          })

          $('.gallery-img').hide();
          $('.gallery-img[data-img-alt="'+color+'"]').show();;

          color = $this.data('title').replace('-','•')   
          color = '<img src="'+swatch+'" class="l-hmargin--xsmall rounded" width="11" height="11">&nbsp;'+color;
          $('.js-pdp-color-title-block')[0].innerHTML = color;
          $this.addClass('is-active').parent().siblings().find('a').removeClass('is-active');
        });    
      }else {
        $('.js-slideshow-wrapper img:eq(1)').imagesLoaded( function() {
          // images have loaded
          var prodSlider = $('.js-slideshow-wrapper .js-slideshow').flickity({
            // options
            cellAlign: 'center',
            contain: true,
            prevNextButtons: false,
            pageDots: false,
            on: {
              ready: function() {
                //console.log('let\'s get it on');
              },
              change: function( index ) {
//                 console.log( 'Slide changed to' + index );
                $('.js-slideshow-bullet').eq(index).addClass('is-active').siblings().removeClass('is-active')
                var slideSelected = $('.slide.is-selected').attr('data-zoom'),
                    slideColor = $('.slide.is-selected').attr('data-color'),
                    selectedColor = $('.js-pdp-color-list a.is-active').attr('data-color'),
                    colorFirst = $('.js-slideshow .slide[data-color="' +selectedColor+ '"]').first(),
                    colorLast = $('.js-slideshow .slide[data-color="' +selectedColor+ '"]').last(),
                    dataFirst = colorFirst.attr('data-zoom'),
                    dataLast = colorLast.attr('data-zoom'),
                    dataNext = parseInt(dataLast) + 1,
                    currentTrigger = $('.js-pdp-color-list a.is-active'),
                    triggerParent = currentTrigger.parent(),
                    triggerPrevParent = triggerParent.prev(),
                    triggerPrev = triggerPrevParent.children('a'),
                    triggerPrevColor = triggerPrev.attr('data-color'),
                    colorParent = currentTrigger.parent(),
                    colorParentNext = colorParent.next(),
                    colorParentNextChild = colorParentNext.children('a'),
                    colorNextColor = colorParentNextChild.attr('data-color'),
                    currentBullet = $('.js-slideshow-bullet.is-active[data-zoom="' +slideSelected+ '"]'),
                    bulletColor = $('.js-slideshow-bullet:eq('+index+')').attr('data-color'),
                    bulletCount = $('.js-slideshowbullet[data-color="' +slideColor+ '"]').attr('data-zoom'),
                    triggerDataLast = $('.js-pdp-color-list li.click-color a[data-color="' +triggerPrevColor+ '"]').attr('data-last'),
                    dataPrev = $('.js-slideshow-bullet[data-color="' +triggerPrevColor+ '"]').length;
                if($('.slide[data-zoom="' +dataNext+ '"]').hasClass('is-selected')){
                  $('.js-pdp-color-list li.click-color a[data-color="' +colorNextColor+ '"]').trigger('click')
                } else if($('.slide[data-zoom="' +triggerDataLast+ '"]').hasClass('is-selected')) {
                  $('.js-pdp-color-list li.click-color a[data-color="' +triggerPrevColor+ '"]').trigger('click');
                  //                 $('.js-slideshow-bullet[data-color="' +triggerPrevColor+ '"]').first().addClass('is-active').siblings().removeClass('is-active');
                }
                //                 $('.js-slideshow-thumbs .js-slideshow-bullet:eq('+index+')').addClass('is-active').siblings().removeClass('is-active');
                $('.js-pdp-color-list li.click-color a[data-color="' +selectedColor+ '"]').attr("data-first", dataFirst).attr("data-last", dataLast)
              }
            }
          });

          var imagePosition = $('#imagePosition').val() - 1;

          window.productSlider = prodSlider
          $('.js-slideshow-thumbs .js-slideshow-bullet').on('click', function(){
            var $this = $(this),
                index = $this.index(),
                sliderindex = $this.parent().index(),
                slidername = 'flickslider'+sliderindex,
                slider = prodSlider;
            $this.addClass('is-active').siblings().removeClass('is-active');
            slider.flickity('select',index);
          }).eq(imagePosition).trigger('click');

        });
        
        // color selection version 3 by Rengie Nullan
        // Product Variant - Edit Here
        $('.js-pdp-color-list a').click(function(e){
          e.preventDefault();
          var $this = $(this),
              swatch = $this.children('img').attr('src'),
              color = $this.data('title'),
              sliderParent = $('.js-pdp-gallery.js-slideshow-wrapper'),
              sliderImages = sliderParent.find('.unique-wrap'),
              indexCount = 0,
              thisColor = $this.data("color"),
              allSizes = $('#popin-size .btn-size'),
              mobileSizes = $('.js-pdp-mobile-size-list  .btn-size'),
              allSizeLngth = allSizes.length;


          // disable all sizes first
          $('#popin-size .btn-size').addClass('is-disabled');
          $('.js-pdp-mobile-size-list  .btn-size').addClass('is-disabled');


          for (var a = 0; a < varslength; a++){
            var currVar = window.pVars[a],
                currColor = currVar.option1,
                currSize = currVar.option2;

            if(thisColor == currColor){
              if(currVar.available){

                $.each(allSizes, function(){
                  var $this2 = $(this),
                      $data = $this2.data("size")

                  if($data == currSize){
                    $this2.removeClass('is-disabled');

                    var opts = {
                      id: currVar.id
                    }
                    updateVarPrice(opts)
                  }                

                })

                $.each(mobileSizes, function(){
                  var $this2 = $(this),
                      $data = $this2.data("size")

                  if($data == currSize){
                    $this2.removeClass('is-disabled');

                    var opts = {
                      id: currVar.id
                    }
                    updateVarPrice(opts)
                  }                

                })

              }
            }

          }        

          sliderImages.each(function(){
            var $this2 = $(this)


            if($this2.data('color') == color ){

              $this2.parent().removeClass('hiden'); //added by Rengie to hide buttons on mobile
              $this2.removeClass('hiden') 

              if($this2.hasClass('for-btn')){
                indexCount++;
                if(indexCount == 1)
                  $this2.parent().trigger('click');
              }

            } else {
              $this2.addClass('hiden') 
              $this2.parent().addClass('hiden');//added by Rengie to hide buttons on mobile
            }
          })

          $('.gallery-img').hide();
          $('.gallery-img[data-img-alt="'+color+'"]').show();;

          color = $this.data('title').replace('-','•')   
          color = '<img src="'+swatch+'" class="l-hmargin--xsmall rounded" width="11" height="11">&nbsp;'+color;
          $('.js-pdp-color-title-block')[0].innerHTML = color;
//           console.log(color);
          $this.addClass('is-active').parent().siblings().find('a').removeClass('is-active');
        });    

      }





      // color selection version 1
      //       $('.js-pdp-color-list a').click(function(e){
      //         e.preventDefault();
      //         var $this = $(this),
      //             swatch = $this.children('img').attr('src'),
      //             color = $this.attr('title').replace('-','•');
      //         color = '<img src="'+swatch+'" class="l-hmargin--xsmall rounded" width="11" height="11">&nbsp;'+color;
      //         $('.js-pdp-color-title-block')[0].innerHTML = color;
      //         $this.addClass('is-active').parent().siblings().find('a').removeClass('is-active');
      //       });

      // size selection for desktop
      $('#popin-size .btn-size').click(function(e){
        var $this = $(this),
            $sizeTrigger = $('#trigger-size-panel'),
            $svg = $sizeTrigger.children('svg')[0].outerHTML,
            selectedSize = $this.text(),
            markup = '<span class="no-mob no-tab">Selected size&nbsp;—&nbsp;</span><strong>'+selectedSize+'</strong>'+$svg;


        if(!$this.hasClass('is-disabled')){
          $sizeTrigger[0].innerHTML = markup;
          $('#cta-btn-main').addClass('btn--green').text('Add to shopping bag');
          $('.js-pdp-mobile-size-list .btn-cta:contains('+selectedSize+')').addClass('is-active').siblings().removeClass('is-active');
          $sizeTrigger.attr('data-selected-size',selectedSize);

          var selectedColr = $('.js-pdp-color-list a.is-active').data('title');
          var opts = {
            color: $('.js-pdp-color-list a.is-active').data('title'),
            size: selectedSize
          }

          getVarID(opts)

          for (var a = 0; a < varslength; a++){
            var currVar = window.pVars[a],
                currColor = currVar.option1,
                currSize = currVar.option2;

            if(currVar.available){

              if(selectedSize == currSize && selectedColr == currColor){
                var opts = {
                  id: currVar.id
                }
                updateVarPrice(opts);
              }

            }

          }          
        }
        $('.js-popin-container').hide();


      });
      // size selection for mobile
      $('.js-pdp-mobile-size-list .btn-cta').click(function(e){
        var $this = $(this),
            $sizeTrigger = $('#trigger-size-panel'),
            $svg = $sizeTrigger.children('svg')[0].outerHTML,
            selectedButton = $this.data('size'),
            markup = '<span class="no-mob no-tab">Selected size&nbsp;—&nbsp;</span><strong>'+selectedButton+'</strong>'+$svg;

        console.log(selectedButton);

        if(!$this.hasClass('is-disabled')){
          $sizeTrigger[0].innerHTML = markup;
          $('#cta-btn-main').addClass('btn--green').text('Add to shopping bag');
          $('.js-pdp-mobile-size-list [data-size="' + selectedButton + '"]').addClass('is-active').siblings().removeClass('is-active');
          $sizeTrigger.attr('data-selected-size',selectedButton);

          var selectedColr = $('.js-pdp-color-list a.is-active').data('title');
          var opts = {
            color: $('.js-pdp-color-list a.is-active').data('title'),
            size: selectedButton
          }

          getVarID(opts)

          for (var a = 0; a < varslength; a++){
            var currVar = window.pVars[a],
                currColor = currVar.option1,
                currSize = currVar.option2;

            if(currVar.available){

              if(selectedButton == currSize && selectedColr == currColor){
                var opts = {
                  id: currVar.id
                }
                updateVarPrice(opts);
              }

            }

          }   
          
          $('.js-popin-container').hide()
        }
      });


      // close slide panel
      $('.js-popin-close').click(function(e){
        e.preventDefault();
        var $this = $(this);
        $this.closest('.popin-wrapper')
        .removeClass('is-opened is-active')
        $('.js-popin-container').hide();
      });

      // close slide panel 2
      $('#size-panel').click(function(e){
        e.preventDefault();
        var $this = $(this);
        $this.removeClass('is-opened is-active')
        $this.closest('.js-popin-container').hide()
      });

      $('#cta-btn-main').click(function(e){
        var $this = $(this),
            $sizeTrigger = $('#trigger-size-panel');
        if($sizeTrigger.attr('data-selected-size') == ""){
          $sizeTrigger.trigger('click');
        } else {
          $this.prev('form').submit();
        }
      });

    }

    // account reg check if confirmation email is same
    $('#create_customer').on('submit',function(e){
      var $email1 = $('#Email'),
          $email2 = $('#email2'),
          val1 = $email1.val(),
          val2 = $email2.val(),
          $pass1 = $('#CreatePassword '),
          $pass2 = $('#password2'),
          p1 = $pass1.val(),
          p2 = $pass2.val();
      var emailconfirmfail = !((val1 != '' && val2 != '') && (val1 == val2)) ? true : false;
      var passconfirmfail = !((p1 != '' && p2 != '') && (p1 == p2)) ? true : false;
      if(emailconfirmfail){
        alert('Please confirm your email address.');
      }
      if(passconfirmfail){
        alert('Please confirm your password.');
      }
      if(emailconfirmfail || passconfirmfail){
        e.preventDefault();
      }
    });

    $('#account-newsletter-form .saveLink').click(function(e){
      e.preventDefault();
      var $this = $(this);
      var $form = $this.closest('form');
      var $subscribe = ($('#togg-active').hasClass('active')) ? true : false;
      var marketing = $('#customer-fields').find('input[name="customer[accepts_marketing]"]')
      if ($subscribe){
        marketing.prop("checked",true)
      } else {
        marketing.prop("checked",false)
      }
      $('#customer-fields input[type="submit"]').trigger('click');
    });

    // accordions for text info pages
    $('.ordering-faq').click(function(e){
      var $this = $(this);
      $this.toggleClass('active');
      $this.next('.accordion-content').slideToggle();
    });

    $('.accordion-mobile-tablet-only').click(function(e){
      var $this = $(this);
      var $target = $this.data('accordion-href')
      if($target.length){
        $this.toggleClass('active');
        $('div[data-accordion-id="'+$target+'"]').slideToggle();
      }
    })

    //drop downtoggle fix
    $('#bc-sf-filter-tree.h .bc-sf-filter-block-title').click(function(){
      var $this = $(this)

      $this.toggleClass('selected')
    })

    //vimeo player rene-lacoste page
    $('.js-court-poster, .player-btn').click(function(e) {
      var $this = $(this),
          $wrapper = $this.closest('.court-launch');
      var thumb = $('.js-court-poster'),
          videoUrl = thumb.data('video'),
          iframeMarkup = '<iframe src="'+ videoUrl +'" width="100%" height="758.8125px" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" data-ready="true"></iframe>';
      $wrapper.append(iframeMarkup)
      thumb.remove();
      $('.court-content').css('display','none');
      var iframe = document.querySelector('iframe');
      var player = new Vimeo.Player(iframe);
      player.play();
    })

    $('#email-subscribe').click(function(e){
      if( $("#checkbox1:checked").length == 0){
        e.preventDefault();
        alert('Please tick the checkbox');
      }
      else{
        location.href = `/pages/signup`;
      }
    });

    //color auto select first color
    $('.js-pdp-color-list li.click-color a').first().trigger('click');

    //hide care when product is equals to footwear and leathergoods
    if($('body').hasClass('template-product')){

      var productTags = $('#producttags').val(),
          leatherGoods = (productTags.indexOf('Leather goods') > -1),
          shoes = (productTags.indexOf('Shoes') > -1),
          lGoods = (productTags.indexOf('Leather Goods') > -1),
          smallLeatherGoods = (productTags.indexOf('Small Leather Goods') > -1)

      if($('body').hasClass('template-product')){
        if( (leatherGoods) || (shoes) || (smallLeatherGoods) || (lGoods) ) {
          $('.care-icon').hide();
        }
      }
    }



    $('li button.js-popin-btn[data-popin-content-id]').click(function() {
      var $this = $(this),
          dataText = $this.attr("data-popin-content-id");
      $('.icon-modal[data-modal="' + dataText + '"]').fadeToggle().addClass('open');

    });


    $('.align-right').click(function() {
      $('.icon-modal').hide();
    });

    jQuery('#icon-modal-wrap').click(function(){
      $(this).data('clicked', true);
    });

    if(jQuery('.icon-modal-wrap').data('clicked')) {
    } else {
      $('.icon-modal').hide();

    }

    // cart done with address details
    $('#cta-payment').click(function(e){
      e.preventDefault();
      var fname = $('#s-fname').val(),
          lname = $('#s-lname').val(),
          add1 = $('#s-add1').val(),
          prov = $('#checkout_shipping_address_address2').val(),
          city = $('#checkout_shipping_address_city').val(),
          ctry = $('#checkout_shipping_address_country').val(),
          zip = $('#s-zip').val(),
          phone = $('#s-phone').val()
      if(fname && lname && add1 && prov && city && ctry && zip && phone){
        $('#checkout-shipping-form').submit();
      } else {
        alert('Please fill in all required fields.');
      }
    });


    $('.slide').click(function() {
      var $this = $(this),
          dataZoom = $this.attr("data-zoom");      
      $('.zoom-popup[data-zoom="' + dataZoom + '"]').show();      
    });

    $('.zoom-popup-close').click(function() {
      var $this = $(this);
      $this.parent('.zoom-popup').hide();
    });


    $('img.zoom-img').click(function() {
      var $this = $(this),
          imageSrc = $this.attr("src"),
          startingCount = $('.zoom-popup').first().attr("data-zoom");

      console.log(startingCount);

    })

    $('.js-checkout-login-checkmail').click(function(e){
      e.preventDefault();
      $('input[name="checkout[email]"]').val($('#js-checkout-login-check-mail').val());
      $('#cart-step-2').slideUp(function(){
        $('#cart-step-3').slideDown();
      });
    })


    $('.zoom-parent-div .zoom-popup .btn-prev.zoom-popup-prev').click(function(){
      var $this = $(this),
          $parent = $this.closest('.zoom-popup');

      $('.zoom-parent-div .zoom-popup').hide()
      $parent.prev().show()
    })

    $('.zoom-parent-div .zoom-popup .btn-next.zoom-popup-next').click(function(){
      var $this = $(this),
          $parent = $this.closest('.zoom-popup');

      $('.zoom-parent-div .zoom-popup').hide()
      $parent.next().show()
    })    

    $('button.flickity-button.flickity-prev-next-button.next').addClass('swiper-button-next swiper-button-offset-right nav-ico-after no-mob');

    $('#modal-popup').click(function(){
      var $this = $(this)

      $('.unique-add-address').fadeIn(500);
      $('#accountOverlay').fadeIn(500);
    })

    $('.editLink.unique').click(function(e){
      e.preventDefault();
      var $this = $(this)

      $this.closest('.address').next().fadeIn(500);
      $('#accountOverlay').fadeIn(500);
    })     

    $('.unique-add-address .cancelLink, .unique-edit-address .cancelLink').click(function(e){
      e.preventDefault();
      $('.unique-add-address').fadeOut(500);
      $('.unique-edit-address').fadeOut(500);
      $('#accountOverlay').fadeOut(500);      
    })



    $('.edit-info-btn').click(function() {
      $('.edit-personalinfo-form').fadeIn(500);
      $('#accountOverlay').fadeIn(500);
    })

    $('.edit-personalinfo-form .cancelLink').click(function(e){
      e.preventDefault();
      $('.edit-personalinfo-form').fadeOut(500);
      $('#accountOverlay').fadeOut(500);      
    })

    $('.newsletter-edit-btn').click(function() {
      $('.newsletter-form').fadeIn(500);
      $('#accountOverlay').fadeIn(500);
    })

    $('.newsletter-form .cancelLink').click(function(e){
      e.preventDefault();
      $('.newsletter-form').fadeOut(500);
      $('#accountOverlay').fadeOut(500);      
    })

    $('#togg-active').click(function() {
      var $this = $(this);

      $this.toggleClass('active');
    })
    $('#social-login-facebook .switch, #social-login-google .switch').click(function() {
      var $this = $(this);
      $this.parent().toggleClass('active');
    })
    $('.saveNews').click(function(e) {
      e.preventDefault();

      $('.newsletter-form').fadeOut(500);
      $('#accountOverlay').fadeOut(500); 


      if ($("#togg-active").hasClass("active")) {
        $('.check-inline-outside:nth-child(2)').hide().siblings().show();
      }else {
        $('.check-inline-outside:nth-child(2)').show().siblings().hide();
      }
    })

    $(document).ready(function() {
      var custSpent = $('.cust-total-spent').text(),
          custPoints = parseInt(custSpent);

      //       console.log(custTotSpent);

      if(custPoints == 0 && custPoints < 15000) {
        //         $('#fidelity-Standard').addClass('fidelity-box-current').siblings().removeClass('fidelity-box-current');
        console.log('Standard');
      } else if(custPoints >= 15000 && custPoints < 40000) {
        console.log('Silver');

      } else if(custPoints >= 40000 && custPoints < 85000) {
        console.log('Gold');

      } else if(custPoints >= 85000) {
        console.log('VIP');

      }
    })

  });

  $('.addressBox .deleteLink.address-delete').on('click', function(e) {
    e.preventDefault();
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    var url = 'https://lacoste.com.ph/account/addresses/'+formId;
    // eslint-disable-next-line no-alert
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink(url, {
        parameters: { _method: 'delete', method: 'delete' }
      });
    }
  });

  $('.js-accordion-handle').click(function(){
    var $this = $(this),
        sibling = $this.next(),
        sHeight = sibling.height();


    if(sibling.hasClass('toggled')){
      sibling.removeClass('toggled')
      sibling.css('max-height', 0)
    } else {
      sibling.addClass('toggled')
      sibling.css('max-height', 800)
    }
  })

  //text banner scroll
//   $('.announcement-banner').css({'top': $('header#announce-header').innerHeight(), 'position': 'fixed'})
  $(window).scroll(function(){
    var elemHeight = $('header#announce-header').innerHeight(),
        txtBanner = $('.announcement-banner'),
        bannerHeight = txtBanner.innerHeight(),
        pageContainer = $('.main-container .page-section'),
        screenWidth = window.outerWidth;
    $this = $(window)
    if( $(window).scrollTop() > 5 ){
      $('#announce-header').css('top','0');
      $('#announce-button').css('top', 31);

      if($(window).width() < 1191){
//         $('.announcement-banner.promo').css({"top": 60, "position": "static"})
      } else {
      }

    } else if( $(window).scrollTop() == 0 ) {
//       txtBanner.css({'top': elemHeight, 'position': 'fixed'})
//       $('.announcement-banner').parent().css('padding-bottom', $('.announcement-banner').height())
    } else {
      $('#announce-header').removeAttr( 'style' );
      $('#announce-button').removeAttr( 'style' );
      $('.announcement-banner.promo').removeAttr( 'style' );
      txtBanner.parent().removeAttr('style');

    }
  })   



  $('.swiper-button-next').click(function() {
    $('button.flickity-button.flickity-prev-next-button.next').trigger('click');
  });

  $('.swiper-button-prev').click(function() {
    $('button.flickity-button.flickity-prev-next-button.previous').trigger('click');
  })

  //   $('.color--btn').click(function() {
  //     var $this = $(this),
  //         parentColor = $this.attr("color");
  //     console.log(parentColor);
  //     $('a.js-pdp-color-item.swatch-wrapper[title="White"]').trigger('click');

  //   })

  $('.sku-infos-title').click(function(e) {
    e.preventDefault();
    var $this = $(this),
        btnAttr = $this.attr("parent-order");

    $('.accordion-content[order-count="' + btnAttr + '"]').slideToggle();

    $('.sku-infos-title[parent-order="' + btnAttr + '"]').toggle();
  })


  $('#notice-cookie-block .button').click(function(e){
    $('#notice-cookie-block').fadeOut();
    createCookie('cookieopted', '1', 1);

  });

  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/;domain=" + document.domain + "";
  }


  function processCookieLaw(cookieLawData) {
    if (isValueValid(cookieLawData)) { $('#cookiebar').hide(); } else { $('#cookiebar').show(); }
  }

  function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
  }
  //   COOKIES FOR EMAIL POP-UP

  var isFirstVisit = getCookie('firstvisit');    
  if (isFirstVisit == null ) {
    createCookie('firstvisit', '1', 1);
    setTimeout(function(){
      $('.modal-overlay-email').show();
      if(window.location.href  == 'https://lacoste.com.ph/'){
        setTimeout(function(){
          $('.popup-banner-content').fadeIn(500);
          $('.popup-banner-bg').fadeIn(500)
        },2000);
      }
      $('.popup-banner-bg, .js-banner-close').click(function(){ 
        $('.popup-banner-content').fadeOut(500); $('.popup-banner-bg').fadeOut(500);
      })
    },2000);
  } else {
    $('.modal-overlay-email').hide();
  }


  var optedIn = getCookie('cookieopted');  
  if (optedIn == null ) {
    setTimeout(function(){
      $("#notice-cookie-block").show();
    },2000);
  }

  //mailchimp
  $('#chimp-redirect').submit(function(e){
    e.preventDefault();
    var $this = $(this),
        emailText = $this.find('#lacoste_email'),
        mailChimp = $('#mc_embed_signup'),
        mailInput = mailChimp.find('#mce-EMAIL'),
        mailForm = mailChimp.find('#mc-embedded-subscribe-form'),
        testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;


    if(testEmail.test(emailText.val())){
      mailInput.val(emailText.val());
      mailForm.submit();
    } else {
      e.preventDefault(); 
    }

  });



  if ($("#fidelity-Standard").hasClass("fidelity-box-current")) {
    var $this = $(this);
    $("#fidelity-Standard").find(".vertical-center-content").addClass("hidden").siblings().removeClass("hidden");
  } else if ($("#fidelity-Silver").hasClass("fidelity-box-current")) {
    var $this = $(this);
    $("#fidelity-Silver").find(".vertical-center-content").addClass("hidden").siblings().removeClass("hidden");
  } else if ($("#fidelity-Gold").hasClass("fidelity-box-current")) {
    var $this = $(this);
    $("#fidelity-Gold").find(".vertical-center-content").addClass("hidden").siblings().removeClass("hidden");
  } else if ($("#fidelity-Vip").hasClass("fidelity-box-current")) {
    var $this = $(this);
    $("#fidelity-VIP").find(".vertical-center-content").addClass("hidden").siblings().removeClass("hidden");
  } else {
  }

  if($('body').hasClass('corporate')){
  } else {
    $('.swiper-container-horizontal').imagesLoaded( function() {
      // images have loaded
      $('.swiper-container-horizontal .swiper-wrapper').flickity({
        wrapAround: false,
        contain: true,
        initialIndex: 1,
        prevNextButtons: true,
        pageDots: false,
      })
    });
  }

  $('.click-color a').click(function(e) {
    e.preventDefault();
    var $this = $(this),
        src = $this.children().attr('src'),
        codeIndex = src.indexOf('_swatch'),
        code = src.substring(codeIndex,codeIndex-3);
    $('#col-code').text("• " +code+ "");
  })

  $(".js-scroll-to-top").click(function(e){
    e.preventDefault();
    $('html ,body').animate({scrollTop : 0},900);
  });

  //cart quantity change
  function lreload(){setTimeout(function(){location.reload()}, 1000)}

  $('.js-change-quantity').change(function() {
    var $this = $(this),
        $qtySelected = $this.val(),
        qtyInt = parseInt($qtySelected),
        stringId = $this.siblings('#item-id').attr('var-id'),
        itemId = parseInt(stringId);


    jQuery.post('/cart/update.js', 'updates['+itemId+']='+qtyInt+'');
    lreload();
  })

  /* remove gwp cardholder if no prerequisite exists */
  if($('body').hasClass('template-cart')){
    if(!$('.promo-prereq').length && $('.cart-product').length && $('.gwp-item').length){
      location.href = $('.gwp-item .cart-product-action-remove a').attr('href')
    }
  }

  if($('body').hasClass('template-cart')){
    var itemClass = $('.cart-product')
    if(itemClass.hasClass('gwp-item')){
      //       $('.checkout-block.cart-promo-wrapper').hide();
    }
  }
  $('#CartNote').empty();

  $('.js-product-image-load').hover(function(){
    var $this = $(this),
        i = $this.parent().next(),
        s = i.data('src')
    i.attr('src', s)
  });

  $('.js-static-video-wrapper').hover(function() {
    var $this = $(this)
    if($this.hasClass('is-ready')) {
      $this.addClass('show-controls')
      setTimeout(function() { 
        $this.removeClass('show-controls');
      }, 5000);
    }
  })

  $('.js-video').on('click', function() {
    $(this).toggleClass('active')

    if($(this).hasClass('active')) {
      $(this).removeClass('is-paused')
      $('.js-video-toggle').get(0).play();
    } else {
      $(this).addClass('is-paused')
      $('.js-video-toggle').get(0).pause();
    }
  })

  $('.js-video-mobile').on('click', function() {
    $(this).toggleClass('active')

    if($(this).hasClass('active')) {
      $(this).removeClass('is-paused')
      $('.js-video-mobile .js-video-toggle').get(0).play();
    } else {
      $(this).addClass('is-paused')
      $('.js-video-mobile .js-video-toggle').get(0).pause();
    }
  })

  function togglePausePlay(vidContainer, video) {
    if(vidContainer.hasClass('is-paused')) {
      video.get(0).pause();
      video.removeClass('playing')
    } else {
      video.get(0).play();
      video.addClass('playing')
    }
  }
  $('.btn-big-play').click(function() {
    var $this = $(this),
        vidCont = $this.parent().parent('.js-static-video-wrapper'),
        video = $this.parent().siblings('.js-static-video')
    vidCont.addClass('is-loaded').removeClass('is-ended').removeClass('is-paused');
    video.get(0).play();
    video.toggleClass('playing');
    togglePausePlay(vidCont, video)
  })
  $('.js-static-video').click(function() {
    var $this = $(this),
        vidCont = $this.parent()
    $('.static-video-btn.btn-play').trigger('click');
  })
  $('.static-video-btn.btn-play').click(function() {
    var $this = $(this),
        vid = $this.parent().siblings('.js-static-video'),
        vidCont = $this.parent().parent()

    vidCont.toggleClass('is-paused');
    togglePausePlay(vidCont, vid)
  })

  $('.js-toggle-fullscreen').click(function() {
    var $this = $(this),
        vid = $this.parent().siblings('.js-static-video'),
        vidCont = vid.parent()
    })
  $('.js-toggle-mute').click(function() {
    var $this = $(this),
        vid = $this.parent().siblings('.js-static-video'),
        vidCont = vid.parent()
    vidCont.toggleClass('is-muted')
    if( vid.prop('muted') ) {
      vid.prop('muted', false);
      vidCont.removeClass('is-muted');
    } else {
      vid.prop('muted', true);
      vidCont.addClass('is-muted');
    }
//     console.log('Toggle mute');
  })
  $('.js-static-video').on('ended',function(){
    var $this = $(this),
        vidCont = $this.parent()
    vidCont.addClass('is-ended');
    $this.removeClass('playing');
    vidCont.removeClass('is-fullscreen')
  });

  var updateTime = function() {
    var currTime = '',
        durTime = '',
        handleBar = (currTime/durTime) * 100 + '%',
        timerCurrent = $('.js-static-video.playing').siblings('.js-video-controls').children('.static-video--time:eq(0)'),
        timerDuration = $('.js-static-video.playing').siblings('.js-video-controls').children('.static-video--time:eq(1)')
    if(document.querySelector('.js-static-video.playing')) {
      currTime = parseInt($('.js-static-video.playing').get(0).currentTime)
      durTime = parseInt($('.js-static-video.playing').get(0).duration)
    }
    timerCurrent.html(currTime);
    timerDuration.html(durTime);
    $('.static-video--elapsed-timeline').css('flex-basis', handleBar);
  }
  $('.js-static-video').bind('timeupdate', updateTime);

  $('.js-slideshow-wrapper').imagesLoaded(function(){
	var media = $(window).width(),
        l = $('.js-slideshow-wrapper .slide').parent()
    
    
    if(media < 768){
      l.find('.slide:nth-child(3)').removeClass('is-initial');
      l.find('.slide:first-child').addClass('is-initial');
    }

    if ($body.hasClass('template-index')){
      var slider = $('.js-slideshow').flickity({
        pageDots: true,
        initialIndex: '.is-initial',
        cellAlign: 'right',
        prevNextButtons: false,
        contain: true,
        selectedAttraction: 0.2,
        friction: 0.8
      })
    }

    var slider = $('.js-slideshow').flickity({
      pageDots: false,
      initialIndex: '.is-initial',
      cellAlign: 'right',
      prevNextButtons: false,
      contain: true,
      selectedAttraction: 0.2,
      friction: 0.8
    })

    var christmas_easy = $('.l-christmas-easy').flickity({
      pageDots: false,
      initialIndex: '.is-initial',
      cellAlign: 'right',
      prevNextButtons: false,
      contain: true,
      selectedAttraction: 0.2,
      friction: 0.8
    })

    function sliderCount(slider, start) {
      var $this = slider,
          flkty = $this.data('flickity'),
          $indicator = $this.prev().find('.js-slideshow-indicator'),
          $cell_count = flkty.cells.length,
          $selected = flkty.selectedIndex + 1,
          $next = $this.prev().find('.js-slideshow-control-right'),
          $prev = $this.prev().find('.js-slideshow-control-left'),
          $cell = flkty.cells[0].target,
          $sliders = $this.find('[data-group]'),
          media = $(window).width();

      $indicator.text(''+$selected+' / '+$cell_count+'');

      $next.on('click', function() {
        $this.flickity('next');
      })

      $prev.on('click', function() {
        $this.flickity('previous');
      })
      $this.on( 'select.flickity', function( event, index ) {
        var $drag_index = flkty.selectedIndex + 1
        if($drag_index <= $cell_count ) {
          $indicator.text(''+$drag_index+' / '+$cell_count+'');
        }
        disabledButtons($drag_index, $next, $prev, $cell_count, start);
        highlightTab($sliders)
      });
    }

    function disabledButtons(sliderIndex, next, prev, cell_count, default_index) {
      var indexCount = parseInt(sliderIndex),
          $next = next,
          $prev = prev,
          $cell_count = cell_count,
          $start = default_index

      if(indexCount == $cell_count){
        $next.addClass('swiper-button-disabled');
        $next.attr('aria-disabled', 'true');
        $next.prop('disabled', true);
        $prev.removeClass('swiper-button-disabled');
        $prev.attr('aria-disabled', 'false');
        $prev.prop('disabled', false);
      } else if(indexCount <= $start){
        $prev.addClass('swiper-button-disabled');
        $prev.attr('aria-disabled', 'true');
        $prev.prop('disabled', true);
        $next.removeClass('swiper-button-disabled');
        $next.attr('aria-disabled', 'false');
        $next.prop('disabled', false);
      } else {
        $next.removeClass('swiper-button-disabled');
        $next.attr('aria-disabled', 'false');
        $next.prop('disabled', false);
        $prev.removeClass('swiper-button-disabled');
        $prev.attr('aria-disabled', 'false');
        $prev.prop('disabled', false);
      }
    }

    var lacoste_inside = $('.lacoste-slider').flickity({
      pageDots: true,
      initialIndex: '.is-initial',
      cellAlign: 'right',
      prevNextButtons: false,
      contain: true,
      selectedAttraction: 0.1,
      friction: 0.1,
      fade: true
    })

    function sliderLacosteInsideCount(lacoste_inside, start) {
      var $this = lacoste_inside,
          flkty = $this.data('flickity'),
          $indicator = $this.prev().find('.js-slideshow-indicator'),
          $cell_count = flkty.cells.length,
          $selected = flkty.selectedIndex + 1,
          $next = $this.prev().find('.js-slideshow-control-right'),
          $prev = $this.prev().find('.js-slideshow-control-left'),
          $cell = flkty.cells[0].target,
          $sliders = $this.find('[data-group]'),
          media = $(window).width();

      $indicator.text(''+$selected+' / '+$cell_count+'');

      $next.on('click', function() {
        $this.flickity('next');
      })

      $prev.on('click', function() {
        $this.flickity('previous');
      })
      $this.on( 'select.flickity', function( event, index ) {
        var $drag_index = flkty.selectedIndex + 1
        if($drag_index <= $cell_count ) {
          $indicator.text(''+$drag_index+' / '+$cell_count+'');
        }
        disabledButtonsLacosteInside($drag_index, $next, $prev, $cell_count, start);
        highlightTab($sliders)
      });
    }

    function disabledButtonsLacosteInside(sliderIndex, next, prev, cell_count, default_index) {
      var indexCount = parseInt(sliderIndex),
          $next = next,
          $prev = prev,
          $cell_count = cell_count,
          $start = 1

      if(indexCount == $cell_count){
        $next.addClass('swiper-button-disabled');
        $next.attr('aria-disabled', 'true');
        $next.prop('disabled', true);
        $prev.removeClass('swiper-button-disabled');
        $prev.attr('aria-disabled', 'false');
        $prev.prop('disabled', false);
      } else if(indexCount <= $start){
        $prev.addClass('swiper-button-disabled');
        $prev.attr('aria-disabled', 'true');
        $prev.prop('disabled', true);
        $next.removeClass('swiper-button-disabled');
        $next.attr('aria-disabled', 'false');
        $next.prop('disabled', false);
      } else {
        $next.removeClass('swiper-button-disabled');
        $next.attr('aria-disabled', 'false');
        $next.prop('disabled', false);
        $prev.removeClass('swiper-button-disabled');
        $prev.attr('aria-disabled', 'false');
        $prev.prop('disabled', false);
      }
    }


    var groupCell = $('[data-group]'),
        tabBtn = $('.js-slideshow-tab')

    //Highlight current category
    function highlightTab(a) {
      var $this = a
      $.each($this, function(){
        var $this = $(this)
      console.log($this)
        if($this.hasClass('is-selected')){
          var category = $this.data('group'),
              catBtn = $('#'+category+''),
              sibBtn = catBtn.parent().siblings().find('.js-slideshow-tab')
          catBtn.addClass('is-active')
          sibBtn.removeClass('is-active')
        }
      });
    }
    //Select cell group when clicking tab
    function clickTab(h) {
      $.each(tabBtn, function(){
        var $this = $(this),
            cat = $this.attr('id'),
            card = $('[data-group="'+cat+'"]'),
            cardCount = card.length

        $this.find('span').text('('+cardCount+')')

        $this.on('click', function() {
          var cat = $this.attr('id'),
              sliders = h.find('[data-group="'+ cat +'"]'),
              index = sliders.last().index()
          h.eq(0).flickity( 'selectCell', index );
        })

      })
    }

    $('.js-product-tile-hover-img').hover(function(){
      var $this = $(this)
      $this.toggleClass('is-visible')
    })


    $.each(slider, function(i, item){
      var $this = $(this),
          mediaSize = $(window).width()

      if(mediaSize > 767) {
        var c = 3
        } else {
          var c = 1 
          }

      sliderCount($this, c)
    });

    $.each(lacoste_inside, function(i, item){
      var $this = $(this),
          mediaSize = $(window).width()

      if(mediaSize > 767) {
        var c = 3
        } else {
          var c = 1 
          }

      sliderLacosteInsideCount($this, c)
    });
    
    var christmaspath = '/pages/gift-guide-noel'
    
    if(window.location.pathname === christmaspath){
      sliderCount(christmas_easy, 2)
    }

    highlightTab(groupCell)
    clickTab(slider)

  });
  
  if($('body').hasClass('template-customers/account') || $('body').hasClass('template-page')) {
    if($(window).width() < 768 ){
      $('#fidelityNav .swiper-wrapper').flickity({
        pageDots: false,
        contains: true
      })
    }
  }
  var custlog = parseInt($('#custlog').val())
  if(custlog == 0) {
    var block = "/pages/notfound",
        path = window.location.pathname
    if(path == "/pages/lacoste-rewards" || path == "/pages/orders") {
      window.location.pathname = block;
    }
  }
  
  
  //Temp product code 
  if($('body').hasClass('template-product')) {
    var sizeTab = $('.size-popin-tab-content'),
        firstTab = sizeTab.eq(0)
    firstTab.siblings().remove()

    // for lexer
    $('#cta-btn-main').click(function(e){
      var $this = $(this)
      
      if($this.hasClass('btn--green')) {
        e.preventDefault();
        console.log('before', dataLayer);
        window.dataLayer.push({
          'event': 'addToCart',
          'ecommerce': {
            'currencyCode': 'PHP',
            'add': {                                // 'add' actionFieldObject measures.
              'products': [{                        //  adding a product to a shopping cart.
                'name': window.productdata_raw.name,
                'price': parseFloat($('.main-price').text().replace('₱','').replace(',','').trim()).toFixed(2),
                'brand': window.productdata_raw.brand,
                'categories': window.productdata_raw.categories,
                'quantity': '1'
              }]
            }
          }
        });
        console.log('after', dataLayer);
        $('#cta-btn-main').siblings('form').submit();
      }
    });
  }
  
  function mobSlider() {
    var textBannerSlider = $('.js-banner-slider').flickity({
      // options
      cellAlign: 'left',
      contain: true,
      prevNextButtons: false,
      adaptiveHeight: true,
      autoPlay: 4000,
      wrapAround: true,
      pageDots: true
    });
    textBannerSlider.on( 'change.flickity', function( event, index ) {
      //     console.log( 'Slide changed to ' + index )
      var $this = $(this),
          cells = $this.find('.second-banner'),
          h = cells.eq(index).outerHeight();
      //         console.log(cells.eq(index).outerHeight())
//       $this.parent().css('padding-bottom', h)
    });
    if($(window).width() < 768) {
      textBannerSlider.flickity();
    }else {
      textBannerSlider.flickity('destroy');
    }
    
  }

  mobSlider()

  $(window).resize(function() {
    mobSlider();
  })

})(jQuery);

//Video
var screenWidth = $(window).width()
document.addEventListener("DOMContentLoaded", function() {
  var vid = document.getElementsByTagName('video'),
      videos = [ ...vid ]
  videos.forEach(video => {
    var source = video.children[0]
    if (screenWidth > 500) {
      source.src = source.dataset.desktop;
      console.log('Desktop')
    } else {
      source.src = source.dataset.mobile;
      console.log('Mobile')
    }
    video.load();

    var promise = video.play();

    if (promise !== undefined) {
      promise.catch(error => {
        // Auto-play was prevented
        // Show a UI element to let the user manually start playback
        var observer = new MutationObserver(function (event) {
          console.log(event)  
          video.load();
          video.play();
        })

        observer.observe(video, {
          attributes: true, 
          attributeFilter: ['class'],
          childList: false, 
          characterData: false
        })
        console.log(error)
      }).then((test) => {
        // Auto-play started
        console.log(test)
      });
    }
  })

});