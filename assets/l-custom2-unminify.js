(function($){
  $(document).ready(function(){

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
        //$('#variant-inventory').text(stockText);
      }

      function getVarID(opts){
        // logic for shoes
        var optcolor = opts.color,
            optsize = opts.size;
        for (var a = 0; a < varslength; a++){
          var currVar = window.pVars[a],
              currColor = currVar.option1,
              currSize = currVar.option2
          if(currColor == optcolor && currSize == optsize){
            $productFormID.val(currVar.id);
            //             getStockText(currVar.id);
            console.log(currVar.id);
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
            if(salePrice < origPrice){
              $regPriceSpan.text(regPrice).parent().show();
              $salePriceSpan.text(currPrice);
            } else {
              $regPriceSpan.parent().hide();
              $salePriceSpan.text(currPrice);
            } 
          }
        }
      }


      $('.haring-slider').flickity({
        // options
        // 		wrapAround: true
      });

      //         


      var prodSlider = $('.js-slideshow-wrapper .js-slideshow').flickity({
        // options
        cellAlign: 'center',
        contain: true,
        prevNextButtons: false,
        pageDots: false,
        on: {
          ready: function() {
            console.log('let\'s get it on');
          },
          change: function( index ) {
            console.log( 'Slide changed to' + index );
            $('.js-slideshow-thumbs .js-slideshow-bullet:eq('+index+')').addClass('is-active').siblings().removeClass('is-active');
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


      // panel slide trigger for size selection
      $('#trigger-size-panel').click(function(e){
        e.preventDefault();
        var $this = $(this);
        //$('.js-popin-container').show();
        var $sizePanel = $('#size-panel');
        $sizePanel.removeClass('is-hidden').siblings().removeClass('is-opened');
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


      // color selection version 2 by Rengie Nullan
      $('.js-pdp-color-list a').click(function(e){
        e.preventDefault();
        var $this = $(this),
            swatch = $this.children('img').attr('src'),
            color = $this.attr('title').replace('-','•'),
            sliderParent = $('.js-pdp-gallery.js-slideshow-wrapper'),
            sliderImages = sliderParent.find('.unique-wrap'),
            indexCount = 0;

        //         	console.log(color)
        //             if(sliderImages.hasClass(color)){
        // 				sliderImages.addClass('hiden')
        //             } else{
        //              	sliderImages.removeClass('hiden') 
        //             }

        sliderImages.each(function(){
          var $this2 = $(this)

          if($this2.data('color') == color ){

            $this2.removeClass('hiden') 

            if($this2.hasClass('for-btn')){
              indexCount++;
              if(indexCount == 1)
                $this2.parent().trigger('click');
            }

          } else {
            $this2.addClass('hiden') 
          }
        })

        //         for (var a = 0; a < varslength; a++){
        //           var currVar = window.pVars[a],
        //               currColor = currVar.option1;
        // //           console.log(color)
        //           if(currColor == color){
        // //            	console.log(currColor)

        // //             if(sliderImages.hasClass(currColor)){
        // // //               console.log(sliderImages.data('color'))
        // //               console.log(color);
        // //             }

        //             if(sliderImages.hasClass(currColor)){
        // 				sliderImages.addClass('hiden')
        //             } else{
        //              	sliderImages.addClass('hiden') 
        //             }
        //           }

        //         }
        color = '<img src="'+swatch+'" class="l-hmargin--xsmall rounded" width="11" height="11">&nbsp;'+color;
        $('.js-pdp-color-title-block')[0].innerHTML = color;
        $this.addClass('is-active').parent().siblings().find('a').removeClass('is-active');
      });      


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
        $sizeTrigger[0].innerHTML = markup;
        $('#cta-btn-main').addClass('btn--green').text('Add to shopping bag');
        $('.js-pdp-mobile-size-list .btn-cta:contains('+selectedSize+')').addClass('is-active').siblings().removeClass('is-active');
        $sizeTrigger.attr('data-selected-size',selectedSize);

        var opts = {
          color: $('.js-pdp-color-list a.is-active').attr('title'),
          size: selectedSize
        }

        getVarID(opts)


      });
      // size selection for mobile
      $('.js-pdp-mobile-size-list .btn-cta').click(function(e){
        var $this = $(this),
            selectedSize = $this.text(),
            selectedButton = $('#popin-size .btn-cta:contains('+selectedSize+')');
        console.log(selectedButton);
        $this.addClass('is-active').siblings().removeClass('is-active')
        selectedButton.trigger('click');
      });


      // close slide panel
      $('.js-popin-close').click(function(e){
        e.preventDefault();
        var $this = $(this);
        $this.closest('.popin-wrapper')
        .removeClass('is-opened')
        .closest('.js-popin-container')
        .fadeOut();
      });

      // close slide panel 2
      $('#size-panel').click(function(e){
        e.preventDefault();
        var $this = $(this);
        $this.removeClass('is-opened')
        .closest('.js-popin-container')
        .fadeOut();
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
  console.log($('#productTypeContainer').val());

  });
});