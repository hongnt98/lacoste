// Override Settings
var bcSfFilterSettings = {
  general: {
      limit: 16,
      /* Optional */
      // loadProductFirst: true,
      requestInstantly: true
  }
};

// Declare Templates
var bcSfFilterTemplate = {
  'soldOutClass': 'sold-out',
  'saleClass': 'on-sale',
  'soldOutLabelHtml': '<div>' + bcSfFilterConfig.label.sold_out + '</div>',
  'saleLabelHtml': '<div>' + bcSfFilterConfig.label.sale + '</div>',
  'vendorHtml': '<div>{{itemVendorLabel}}</div>',

  // Grid Template
  'productGridItemHtml': '<li class="cell-7 cell-m-11 offset-1 l-vmargin-row-1">' +
                          '<div class="product-box js-product-box" data-pid="PH9396-00-WKD" data-original-image="{{itemThumbUrl}}" data-index="0.0">'+
                            '<a href="{{itemUrl}}" class="js-product-track">'+
                              '<div class="product-box-image-wrapper">'+
                                '<div class="loader-wrapper l-overlay js-product-loader">'+
                                  '<svg class="loader-icon">'+
                                    '<circle class="loader-circle" cx="50" cy="50" r="10" fill="none" strokeMiterlimit="10" ></circle>'+
                                  '</svg>'+
                                '</div>'+
                                '<picture class="product-box-image js-product-image-load">'+
                                  '<source media="(min-width: 801px)" data-srcset="{{itemThumbUrl}}">'+
                                  '<img class="product-box-image js-product-image-load lazyload" data-src="{{itemThumbUrl}}" alt="" width="100%" height="auto" />'+
                                '</picture>'+
                                '<img data-src="{{itemThumbUrl}}" class="lazyload product-box-image product-box-image-hover js-product-image-hover" width="100%" height="auto" />'+
                              '</div>'+
                            '</a>'+
                            '<div>'+
                              //'<div class="item-flag fs--xsmall l-hmargin--small l-vmargin--xsmall" style="color: white; background-color: #0d564d">40% off</div>'+
                            '</div>'+
                            '<div class="product-box-infos">'+
                              '<div class="fs--small">'+
                                '<a href="{{itemUrl}}" class="product-box-link js-product-track">{{itemTitle}}</a>'+
                              '</div>'+
                              '<div class="product-box-price-wrapper aaa">'+
                                '{{itemPrice}}' +
                              '</div>'+
                              '<div class="flex flex--align-center fs--medium">'+
                  '<span>{{colorCounter}}</span>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</li>',

  // Pagination Template
  'previousActiveHtml': '<li><a href="{{itemUrl}}">←</a></li>',
  'previousDisabledHtml': '<li class="disabled"><span>←</span></li>',
  'nextActiveHtml': '<li><a href="{{itemUrl}}">→</a></li>',
  'nextDisabledHtml': '<li class="disabled"><span>→</span></li>',
  'pageItemHtml': '<li><a href="{{itemUrl}}">{{itemTitle}}</a></li>',
  'pageItemSelectedHtml': '<li><span class="active">{{itemTitle}}</span></li>',
  'pageItemRemainHtml': '<li><span>{{itemTitle}}</span></li>',
  'paginateHtml': '<ul class="pagination-custom">{{previous}}{{pageItems}}{{next}}</ul>',

  // Sorting Template
  'sortingHtml': '<label class="label--hidden">' + bcSfFilterConfig.label.sorting + '</label><select class="collection-sort__input">{{sortingItems}}</select>',
};

/************************** BUILD PRODUCT LIST **************************/



// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index) {
  // function checkCollection(arr, name) {
  //   return arr.some(function(el) {
  //     return el.template_suffix === name;
  //   });
  // }

//   var itemRegPrice = '';
//   if(checkCollection(data.collections, 'private-sale')) {
//     itemRegPrice = data.price_max;
//   }
  
//   console.log(itemRegPrice);

  /*** Prepare data ***/
  var images = data.images_info;

  data.price_min *= 100, data.price_max *= 100, data.compare_at_price_min *= 100, data.compare_at_price_max *= 100; // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  //var onPrivateSale = itemRegPrice > 0; // Check a product is on Private Sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
      var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
      if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
      for (var i = 0; i < data['variants'].length; i++) {
          if (data['variants'][i].available) {
              firstVariant = data['variants'][i];
              break;
          }
      }
  }
  var av = data.available,
      is_gwp = data.tags.includes('GWP')
  /*** End Prepare data ***/

  // Get Template
  var itemHtml = bcSfFilterTemplate.productGridItemHtml;
//console.log(this)
  // Add Thumbnail
  var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src']) : bcSfFilterConfig.general.no_image_url;
  itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

  /** Check if have bold price */
  var getBoldPrice = function() {
    var url = 'https://apps.boldapps.net/pricerules/lacoste-ph-sandbox.myshopify.com/rulesets?products='+data.id;
    var value = 0;
    var type = '';
    var oldPrice = data.price_min/100;
    var boldPrice = 0;
    var rule = [];
    var tmp = null;
    $.ajax({
      async: false,
      type: 'GET',
      dataType: 'JSON',
      url: url,
      timeout: timeOut,
      crossDomain: true,
      success: function(pricerule, status, XMLHttpReq) {
        tmp = pricerule;
      },
      error: function(xhr, status, error) {
        console.log('error');
      }
    });
    
    rule = tmp.rulesets.filter(element => {
      return element.priority == 1;
    });

    if(rule.length) {
      value = rule[0].rules[0].actions[0].value;
      type = rule[0].rules[0].actions[0].type;
      
      var customerTag = (bcSfFilterConfig.boldPrice) ? bcSfFilterConfig.boldPrice.cusTag : false;
      console.log(customerTag);
      
      //var customerTag = rule[0].rules[0].conditions[0].value == 'Le Club';

      if(customerTag && value && type == 'PRICE_ADJUST_PERCENT') {
        var percent = -value;
        boldPrice = oldPrice*((100 - percent)/100);
      } else if(customerTag && value && type == 'PRICE_ADJUST_RELATIVE') {
        value = -value;
        boldPrice = oldPrice - value;
      } else if(customerTag && value && type == 'PRICE_ADJUST_ABSOLUTE') {
        boldPrice = value;
      }
    }

    return boldPrice;
  }();

  // Add Price
  var itemPriceHtml = '';
  if (data.title != '')  {
      itemPriceHtml += '<div data-uprice="130.0" data-currency-code="GBP" class="ff-bold fs--small">';
        if(getBoldPrice > 0) {
          itemPriceHtml += '<div class="nowrap" style="color: #0d564d">' + '<span class="money">' + this.formatMoney(getBoldPrice) + '</span>'+'</div>';
          itemPriceHtml += '<div class="nowrap strikethrough fs--xsmall text-grey-light">' + this.formatMoney(data.price_min/100) + '</div> ';
        } else {
          if (onSale) {
            itemPriceHtml += '<div class="nowrap strikethrough fs--xsmall text-grey-light">' + this.formatMoney(data.compare_at_price_min/100) + '</div> ';
          }
          if (priceVaries) {
            // itemPriceHtml += bcSfFilterConfig.label.from_price;
            // itemPriceHtml.replace(/{{ price }}/g, this.formatMoney(data.price_min/100));
            // itemPriceHtml += '<div class="nowrap strikethrough fs--xsmall text-grey-light">' + this.formatMoney(data.price_min/100) + '</div> ';
            itemPriceHtml += '<div class="nowrap" style="color: #0d564d">' + '<span class="money">' +this.formatMoney(data.price_min/100) + '</span>'+'</div>';
          } else {
            itemPriceHtml += '<div class="nowrap" style="color: #0d564d">' + '<span class="money">' + this.formatMoney(data.price_min/100) + '</span>'+'</div>';
          }
        }
      itemPriceHtml += '</div>';
  }
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

  // Add colorcounter 
  // var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
  // itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);
  var clrctstring = '';
  var checkAvailable = data.variants.filter(function(variant) {
    return variant.available;
  }).map(function(variant) {
    var variant_title = variant.title;
    variant_title = variant_title.split(' ');
    return variant_title[0];
  });
  var itemAvailable = checkAvailable.filter((a, b) => checkAvailable.indexOf(a) === b);

  if (itemAvailable.length >= 2) {
    if (itemAvailable.length > 2) {
      clrctstring = '+ ' + (itemAvailable.length - 1) + ' colors';
    } else {
      clrctstring = '+ 1 color';
    }
  }
  itemHtml = itemHtml.replace(/{{colorCounter}}/g, clrctstring);

  // Add soldOut class
  var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
  itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);

  // Add onSale class
  var saleClass = onSale ? bcSfFilterTemplate.saleClass : '';
  itemHtml = itemHtml.replace(/{{saleClass}}/g, saleClass);

  // Add soldOut Label
  var itemSoldOutLabelHtml = soldOut ? bcSfFilterTemplate.soldOutLabelHtml : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabelHtml);

  // Add onSale Label
  var itemSaleLabelHtml = onSale ? bcSfFilterTemplate.saleLabelHtml : '';
  itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabelHtml);

  // Add Vendor
//     var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorHtml.replace(/{{itemVendorLabel}}/g, data.vendor) : '';
//     itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

  // Add main attribute (Always put at the end of this function)
  itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
  itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

  if(av && !is_gwp) {
    return itemHtml;
  }else {
    $.noop();
  }
};

// Build Product List Item
BCSfFilter.prototype.buildProductListItem = function(data) {
  // // Add Description
  // var itemDescription = jQ('<p>' + data.body_html + '</p>').text();
  // // Truncate by word
  // itemDescription = (itemDescription.split(" ")).length > 51 ? itemDescription.split(" ").splice(0, 51).join(" ") + '...' : itemDescription.split(" ").splice(0, 51).join(" ");
  // // Truncate by character
  // itemDescription = itemDescription.length > 350 ? itemDescription.substring(0, 350) + '...' : itemDescription.substring(0, 350);
  // itemHtml = itemHtml.replace(/{{itemDescription}}/g, itemDescription);
};

/************************** END BUILD PRODUCT LIST **************************/

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
  if (this.getSettingValue('general.paginationType') == 'default') {
      // Get page info
      var currentPage = parseInt(this.queryParams.page);
      var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

      // If it has only one page, clear Pagination
      if (totalPage == 1) {
          jQ(this.selector.bottomPagination).html('');
          return false;
      }

      if (this.getSettingValue('general.paginationType') == 'default') {
          var paginationHtml = bcSfFilterTemplate.paginateHtml;

          // Build Previous
          var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
          previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
          paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

          // Build Next
          var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml :  bcSfFilterTemplate.nextDisabledHtml;
          nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
          paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

          // Create page items array
          var beforeCurrentPageArr = [];
          for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
              beforeCurrentPageArr.unshift(iBefore);
          }
          if (currentPage - 4 > 0) {
              beforeCurrentPageArr.unshift('...');
          }
          if (currentPage - 4 >= 0) {
              beforeCurrentPageArr.unshift(1);
          }
          beforeCurrentPageArr.push(currentPage);

          var afterCurrentPageArr = [];
          for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
              afterCurrentPageArr.push(iAfter);
          }
          if (currentPage + 3 < totalPage) {
              afterCurrentPageArr.push('...');
          }
          if (currentPage + 3 <= totalPage) {
              afterCurrentPageArr.push(totalPage);
          }

          // Build page items
          var pageItemsHtml = '';
          var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
          for (var iPage = 0; iPage < pageArr.length; iPage++) {
              if (pageArr[iPage] == '...') {
                  pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
              } else {
                  pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
              }
              pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
              pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
          }
          paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

          jQ(this.selector.bottomPagination).html(paginationHtml);
      }
  }
};

/************************** BUILD TOOLBAR **************************/

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
  if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
      jQ(this.selector.topSorting).html('');

      var sortingArr = this.getSortingList();
      if (sortingArr) {
          // Build content 
          var sortingItemsHtml = '';
          for (var k in sortingArr) {
              sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
          }
          var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
          jQ(this.selector.topSorting).html(html);

          // Set current value
          jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
      }
  }
};

// Build Display type (List / Grid / Collage)
// BCSfFilter.prototype.buildFilterDisplayType = function() {
//     var itemHtml = '<a href="' + this.buildToolbarLink('display', 'list', 'grid') + '" title="Grid view" class="change-view bc-sf-filter-display-grid" data-view="grid"><span class="icon-fallback-text"><i class="fa fa-th" aria-hidden="true"></i><span class="fallback-text">Grid view</span></span></a>';
//     itemHtml += '<a href="' + this.buildToolbarLink('display', 'grid', 'list') + '" title="List view" class="change-view bc-sf-filter-display-list" data-view="list"><span class="icon-fallback-text"><i class="fa fa-list" aria-hidden="true"></i><span class="fallback-text">List view</span></span></a>';
//     jQ(this.selector.topDisplayType).html(itemHtml);

//     // Active current display type
//     jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').removeClass('active');
//     jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').removeClass('active');
//     if (this.queryParams.display == 'list') {
//         jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').addClass('active');
//     } else if (this.queryParams.display == 'grid') {
//         jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').addClass('active');
//     }
// };

/************************** END BUILD TOOLBAR **************************/

// Build Default layout
function buildDefaultLink(a, b) {
var c = window.location.href.split("?")[0];
return c += "?" + a + "=" + b
}
BCSfFilter.prototype.buildDefaultElements = function (a) {
if (bcSfFilterConfig.general.hasOwnProperty("collection_count") && jQ("#bc-sf-filter-bottom-pagination").length > 0) {
  var b = bcSfFilterConfig.general.collection_count,
    c = parseInt(this.queryParams.page),
    d = Math.ceil(b / this.queryParams.limit);
  if (1 == d) return jQ(this.selector.pagination).html(""), !1;
  if ("default" == this.getSettingValue("general.paginationType")) {
    var e = bcSfFilterTemplate.paginateHtml,
      f = "";
    f = c > 1 ? bcSfFilterTemplate.hasOwnProperty("previousActiveHtml") ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousHtml : bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml") ? bcSfFilterTemplate.previousDisabledHtml : "", f = f.replace(/{{itemUrl}}/g, buildDefaultLink("page", c - 1)), e = e.replace(/{{previous}}/g, f);
    var g = "";
    g = c < d ? bcSfFilterTemplate.hasOwnProperty("nextActiveHtml") ? bcSfFilterTemplate.nextActiveHtml : bcSfFilterTemplate.nextHtml : bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml") ? bcSfFilterTemplate.nextDisabledHtml : "", g = g.replace(/{{itemUrl}}/g, buildDefaultLink("page", c + 1)), e = e.replace(/{{next}}/g, g);
    for (var h = [], i = c - 1; i > c - 3 && i > 0; i--) h.unshift(i);
    c - 4 > 0 && h.unshift("..."), c - 4 >= 0 && h.unshift(1), h.push(c);
    for (var j = [], k = c + 1; k < c + 3 && k <= d; k++) j.push(k);
    c + 3 < d && j.push("..."), c + 3 <= d && j.push(d);
    for (var l = "", m = h.concat(j), n = 0; n < m.length; n++) "..." == m[n] ? l += bcSfFilterTemplate.pageItemRemainHtml : l += m[n] == c ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml, l = l.replace(/{{itemTitle}}/g, m[n]), l = l.replace(/{{itemUrl}}/g, buildDefaultLink("page", m[n]));
    e = e.replace(/{{pageItems}}/g, l), jQ(this.selector.pagination).html(e)
  }
}
if (bcSfFilterTemplate.hasOwnProperty("sortingHtml") && jQ(this.selector.topSorting).length > 0) {
  jQ(this.selector.topSorting).html("");
  var o = this.getSortingList();
  if (o) {
    var p = "";
    for (var q in o) p += '<option value="' + q + '">' + o[q] + "</option>";
    var r = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, p);
    jQ(this.selector.topSorting).html(r);
    var s = void 0 !== this.queryParams.sort_by ? this.queryParams.sort_by : this.defaultSorting;
    jQ(this.selector.topSorting + " select").val(s), jQ(this.selector.topSorting + " select").change(function (a) {
      window.location.href = buildDefaultLink("sort_by", jQ(this).val())
    })
  }
}
};

// Customize data to suit the data of Shopify API
BCSfFilter.prototype.prepareProductData=function(data){for(var k=0;k<data.length;k++){data[k]['images']=data[k]['images_info'];if(data[k]['images'].length>0){data[k]['featured_image']=data[k]['images'][0]}else{data[k]['featured_image']={src:bcSfFilterConfig.general.no_image_url,width:'',height:'',aspect_ratio:0}}data[k]['url']='/products/'+data[k].handle;var optionsArr=[];for(var i=0;i<data[k]['options_with_values'].length;i++){optionsArr.push(data[k]['options_with_values'][i]['name'])}data[k]['options']=optionsArr;data[k]['price_min']*=100,data[k]['price_max']*=100,data[k]['compare_at_price_min']*=100,data[k]['compare_at_price_max']*=100;data[k]['price']=data[k]['price_min'];data[k]['compare_at_price']=data[k]['compare_at_price_min'];data[k]['price_varies']=data[k]['price_min']!=data[k]['price_max'];var firstVariant=data[k]['variants'][0];if(getParam('variant')!==null&&getParam('variant')!=''){var paramVariant=data.variants.filter(function(e){return e.id==getParam('variant')});if(typeof paramVariant[0]!=='undefined')firstVariant=paramVariant[0]}else{for(var i=0;i<data[k]['variants'].length;i++){if(data[k]['variants'][i].available){firstVariant=data[k]['variants'][i];break}}}data[k]['selected_or_first_available_variant']=firstVariant;for(var i=0;i<data[k]['variants'].length;i++){var variantOptionArr=[];var count=1;var variant=data[k]['variants'][i];var variantOptions=variant['merged_options'];if(Array.isArray(variantOptions)){for(var j=0;j<variantOptions.length;j++){var temp=variantOptions[j].split(':');data[k]['variants'][i]['option'+(parseInt(j)+1)]=temp[1];data[k]['variants'][i]['option_'+temp[0]]=temp[1];variantOptionArr.push(temp[1])}data[k]['variants'][i]['options']=variantOptionArr}data[k]['variants'][i]['compare_at_price']=parseFloat(data[k]['variants'][i]['compare_at_price'])*100;data[k]['variants'][i]['price']=parseFloat(data[k]['variants'][i]['price'])*100}data[k]['description']=data[k]['content']=data[k]['body_html']}return data};

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {
/* start-initialize-bc-al */
var self = this;
var alEnable = true;
if(self.getSettingValue('actionlist.qvEnable') != '' || self.getSettingValue('actionlist.atcEnable') != ''){
  alEnable = self.getSettingValue('actionlist.qvEnable') || self.getSettingValue('actionlist.atcEnable');
}
if (alEnable === true && typeof BCActionList !== 'undefined') {
    if (typeof bcActionList === 'undefined') {
        bcActionList = new BCActionList();
    }else{
      if (typeof bcAlParams !== 'undefined' && typeof bcSfFilterParams !== 'undefined') {
          bcActionList.initFlag = false;
          bcActionList.alInit(bcSfFilterParams, bcAlParams);
      } else {
          bcActionList.alInit();
      }
    }
}
/* end-initialize-bc-al */
var productSelector = jQ(this.selector.products);
if (this.queryParams.display == 'list') {
if (productSelector.children('.list-view-items').length == 0) {
  productSelector.children().wrapAll('ul class="list-view-items"/>');
}
productSelector.removeClass('grid grid--uniform grid--view-items');
} else {
if (productSelector.children('.list-view-items').length > 0) {
  productSelector.children('.list-view-items').children().unwrap();
}
productSelector.addClass('grid grid--uniform grid--view-items');
}

$('.js-plp-filter-btn').click(function() {
var filterContainer = $('#filter-popin')

filterContainer.removeClass('is-hidden').addClass('is-opened');
});


$('.js-product-tile-hover-img').hover(function() {
var $this = $(this),
    src = $this.data('image')
$this.toggleClass('is-visible');
$this.css('background-image', 'url('+src+')')
});
$('.js-popin-close').click(function() {
var $this = $(this),
    panel = $this.closest('#filter-popin')
panel.removeClass('is-opened').addClass('is-hidden')
})

var prodCard = $('.l-prod-card')
$(prodCard.eq(0)).addClass('offset-13 offset-m-1').removeClass('offset-1');
$(prodCard.eq(2)).addClass('cell-m-23').removeClass('cell-m-11');
$(prodCard.eq(7)).addClass('cell-m-23').removeClass('cell-m-11');
$(prodCard.eq(22)).addClass('cell-m-23').removeClass('cell-m-11');
$(prodCard.eq(25)).addClass('cell-m-23').removeClass('cell-m-11');
};

window.productInsertCount = 0;
window.once = 0;
// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
jQ('.js-products-number').text(data.total_product); 
if(window.once == 0){
  jQ('.bc-sf-filter-block-title').click(function(e){
    var $sibs = jQ(this).closest('.bc-sf-filter-option-block').siblings();
    $sibs.children('.bc-sf-filter-block-content').slideUp();
    $sibs.children('.bc-sf-filter-block-title').removeClass('selected').find('span').addClass('up');
  });
  window.once = 1;
}

var prodCount = data.total_product
if(prodCount == 1 ) {
  var insertCount = 'See '+ prodCount +' product'
  }else{
    var insertCount = 'See '+ prodCount +' products'
    }
$('.bc-sf-filter-option-item').click(function() {
  var $this = $(this),
      $selectedSwatch = $this.data('id')
  $('#filter-count').text(insertCount);
  console.log($selectedSwatch)
})

$('#filter-count').text(insertCount);
var bannerBox = $('.banner-data')
for (var n = 0; n < bannerBox.length; n++) {
  var currentBox = bannerBox.eq(n);
  window.bannerLink = currentBox.attr('data-link');
  window.bannerDesktopImage = currentBox.attr('src-desktop');
  window.bannerMobileImage = currentBox.attr('src-mobile');
  window.bannerInsertCount = parseInt(currentBox.data('count'));
  if(window.bannerDesktopImage !== undefined && window.productInsertCount == 0){
    var markup = '<div class="cell-15 offset-1 offset-m-0 cell-m-25 l-vmargin-row-1"><div class="l-fill-height l-relative dir-ltr"><div class="js-content-tile l-block"><div class="l-overlay l-overflow-hidden l-m-relative l-fill-height"><div class="js-lazyload-wrapper with-placeholder l-fill-height lazyload"><a href="'+ window.bannerLink +'"><picture class="img-cover img-cover--top lazyload"><source media="(max-width: 767px)" data-srcset="https:'+ window.bannerMobileImage +'?imwidth=320&amp;impolicy=custom 320w,https:'+ window.bannerMobileImage +'?imwidth=375&amp;impolicy=custom 375w,https:'+ window.bannerMobileImage +'?imwidth=414&amp;impolicy=custom 414w,https:'+ window.bannerMobileImage +'?imwidth=767&amp;impolicy=custom 767w" sizes="(max-width: 320px) 320px,(min-width: 321px) and (max-width: 375px) 375px,(min-width: 376px) and (max-width: 414px) 414px,(min-width: 415px) and (max-width: 767px) 767px"><source media="(min-width: 768px)" data-srcset="https:'+ window.bannerDesktopImage +'?imwidth=451&amp;impolicy=custom 451w,https:'+ window.bannerDesktopImage +'?imwidth=524&amp;impolicy=custom 524w,https:'+ window.bannerDesktopImage +'?imwidth=594&amp;impolicy=custom 594w,https:'+ window.bannerDesktopImage +'?imwidth=732&amp;impolicy=custom 732w,https:'+ window.bannerDesktopImage +'?imwidth=838&amp;impolicy=custom 838w" sizes="(min-width: 768px) and (max-width: 1024px) 451px,(min-width: 1025px) and (max-width: 1190px) 524px,(min-width: 1191px) and (max-width: 1366px) 594px,(min-width: 1367px) and (max-width: 1680px) 732px,838px"><img alt="plp_content_brand_FW19_lacoste_festivalofchic" width="100%" height="auto" data-src="https:'+ window.bannerDesktopImage +'" class="img-cover img-cover--top js-lazyload lazyload" data-zoom-url="null" data-was-processed="true"></picture></a><noscript><img class="noscript-content" src="https:'+ window.bannerDesktopImage +'" alt="plp_content_brand_FW19_lacoste_festivalofchic" width="auto" height="auto" /></noscript></div></div></div></div></div>'
    $(markup).insertAfter($('#bc-sf-filter-products').children().eq(window.bannerInsertCount));
    var prodCard = $('.l-prod-card')
    $(prodCard.eq(7)).addClass('cell-m-11').removeClass('cell-m-23');
    window.productInsertCount = n
  } else {
    console.log('undefined');
  }
}

};

/* Start Fix version 2.3.2 */
BCSfFilter.prototype.addFilterTreeItem = function (e, r, t, i) {
e = jQ.parseHTML(e);
if (
  (i != this.selector.filterTree &&
    i != this.selector.filterTreeHorizontal &&
    jQ(i).html(""),
  void 0 === i)
)
  i =
    "vertical" == t
      ? this.selector.filterTree
      : this.selector.filterTreeHorizontal;
void 0 !== r && "before" == r ? jQ(i).prepend(e) : jQ(i).append(e);
};
/* End Fix version 2.3.2 */

// Fix image url issue of swatch option
function getFilePath(fileName, ext, version) {
  var self = bcsffilter;
  var ext = typeof ext !== 'undefined' ? ext : 'png';
  var version = typeof version !== 'undefined' ? version : '1';
  var prIndex = self.fileUrl.lastIndexOf('?');
  if (prIndex > 0) {
      var filePath = self.fileUrl.substring(0, prIndex);
  } else {
      var filePath = self.fileUrl;
  }
  filePath += fileName + '.' + ext + '?v=' + version;
  return filePath;
}

// Build Default layout
BCSfFilter.prototype.buildDefaultElements=function(){var isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,isSafari=/Safari/.test(navigator.userAgent),isBackButton=window.performance&&window.performance.navigation&&2==window.performance.navigation.type;if(!(isiOS&&isSafari&&isBackButton)){var self=this,url=window.location.href.split("?")[0],searchQuery=self.isSearchPage()&&self.queryParams.hasOwnProperty("q")?"&q="+self.queryParams.q:"";window.location.replace(url+"?view=bc-original"+searchQuery)}};


BCSfFilter.prototype.getFilterData=function(eventType,errorCount){function BCSend(eventType,errorCount){var self=bcsffilter;var errorCount=typeof errorCount!=="undefined"?errorCount:0;self.showLoading();if(typeof self.buildPlaceholderProductList=="function"){self.buildPlaceholderProductList(eventType)}self.beforeGetFilterData(eventType);self.prepareRequestParams(eventType);self.queryParams["callback"]="BCSfFilterCallback";self.queryParams["event_type"]=eventType;var url=self.isSearchPage()?self.getApiUrl("search"):self.getApiUrl("filter");var script=document.createElement("script");script.type="text/javascript";var timestamp=(new Date).getTime();script.src=url+"?t="+timestamp+"&"+jQ.param(self.queryParams);script.id="bc-sf-filter-script";script.async=true;var resendAPITimer,resendAPIDuration;resendAPIDuration=2e3;script.addEventListener("error",function(e){if(typeof document.getElementById(script.id).remove=="function"){document.getElementById(script.id).remove()}else{document.getElementById(script.id).outerHTML=""}if(errorCount<3){errorCount++;if(resendAPITimer){clearTimeout(resendAPITimer)}resendAPITimer=setTimeout(self.getFilterData("resend",errorCount),resendAPIDuration)}else{self.buildDefaultElements(eventType)}});document.getElementsByTagName("head")[0].appendChild(script);script.onload=function(){if(typeof document.getElementById(script.id).remove=="function"){document.getElementById(script.id).remove()}else{document.getElementById(script.id).outerHTML=""}}}this.requestFilter(BCSend,eventType,errorCount)};BCSfFilter.prototype.requestFilter=function(sendFunc,eventType,errorCount){sendFunc(eventType,errorCount)};


/* start-boost-2.4.8 */
BCSfFilter.prototype.buildFilterOptionItem=function(html,iLabel,iValue,fOType,fOId,fOLabel,fODisplayType,fOSelectType,fOItemValue,fOData){var keepValuesStatic=fOData.hasOwnProperty("keepValuesStatic")?fOData.keepValuesStatic:false;if(fOType=="review_ratings"&&this.getSettingValue("general.ratingSelectionStyle")=="text"){var title=this.getReviewRatingsLabel(fOItemValue.from)}else{var title=this.customizeFilterOptionLabel(iLabel,fOData.prefix,fOType)}if(keepValuesStatic===true)var productNumber=null;else var productNumber=fOItemValue.hasOwnProperty("doc_count")?fOItemValue.doc_count:0;html=html.replace(/{{itemLabel}}/g,this.buildFilterOptionLabel(iLabel,productNumber,fOData));html=html.replace(/{{itemLink}}/g,this.buildFilterOptionLink(fOId,iValue,fOType,fODisplayType,fOSelectType,keepValuesStatic));html=html.replace(/{{itemValue}}/g,encodeURIParamValue(iValue));html=html.replace(/{{itemTitle}}/g,title);html=html.replace(/{{itemFunc}}/g,"onInteractWithFilterOptionValue(event, this, '"+fOType+"', '"+fODisplayType+"', '"+fOSelectType+"', '"+keepValuesStatic+"')");html=this.checkFilterOptionSelected(fOId,iValue,fOType,fODisplayType)?html.replace(/{{itemSelected}}/g,"selected"):html.replace(/{{itemSelected}}/g,"");var htmlElement=jQ(html);htmlElement.children().attr({"data-id":fOId,"data-value":encodeURIParamValue(iValue),"data-parent-label":fOLabel,"data-title":title,"data-count":productNumber});if(fOType!="collection"){htmlElement.children().attr("rel","nofollow")}if(fOType=="collection")htmlElement.children().attr("data-collection-scope",fOItemValue.key);return jQ(htmlElement)[0].outerHTML};
/* end-boost-2.4.8 */

/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
