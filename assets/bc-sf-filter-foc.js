// Override Settings
var bcSfFilterSettings = {
  general: {
      limit: 30,
      // Optional
      loadProductFirst: true,
      styleScrollToTop: 'style2'
//       defaultDisplay: bcSfFilterConfig.custom.layout,
//       showPlaceholderProductList: true
  },
};
bcSfFilterConfig.custom = {
  products_per_row: 4
}

var bcSfFilterTemplate = {
  'soldOutClass': 'product-price--sold-out grid-view-item--sold-out',

  // Grid Template
  'vendorGridHtml': '<div class="grid-view-item__vendor">{{itemVendorLabel}}</div>',
  'soldOutLabelGridHtml': ' <span class="product-price__sold-out">' + bcSfFilterConfig.label.sold_out + '</span>',
  'productGridItemHtml': '<div class="cell-5 cell-m-11 l-vmargin-row-1 l-prod-card offset-1">'+
                             '<div class="js-product-tile product-tile js-tracking-ready" data-tag-id="plp.onProductTileClick"  data-sku="3614032817047" data-page-number="1" data-producttile="a627e7be-21e0-47b5-a807-ad215ea05c74">'+
                                '<div class="l-relative l-overflow-hidden l-vmargin--small">'+
                                   '<a href="{{itemUrl}}" class="js-product-tile-link">'+
                                      '<div class="js-lazyload-wrapper with-placeholder l-relative lazyload">'+
                                         '<picture class="pict l-block img-fill-width lazyload">'+
                                            '<source media="" data-srcset="{{itemThumbUrl}}?imwidth=320&amp;impolicy=product 320w,{{itemThumbUrl}}?imwidth=375&amp;impolicy=product 375w,{{itemThumbUrl}}?imwidth=414&amp;impolicy=product 414w,{{itemThumbUrl}}?imwidth=457&amp;impolicy=product 457w,{{itemThumbUrl}}?imwidth=767&amp;impolicy=product 767w" sizes="(max-width: 320px) 320px,(min-width: 321px) and (max-width: 375px) 375px,(min-width: 376px) and (max-width: 414px) 414px,(min-width: 415px) and (max-width: 767px) 767px,(min-width: 768px) and (max-width: 1024px) 375px,(min-width: 1025px) and (max-width: 1190px) 414px,(min-width: 1191px) and (max-width: 1366px) 320px,(min-width: 1367px) and (max-width: 1680px) 414px,457px">'+
                                            '<img alt="" width="100%" height="auto" data-src="{{itemThumbUrl}}" class="l-block img-fill-width js-lazyload lazyload" data-zoom-url="null" data-was-processed="true">'+
                                         '</picture>'+
                                         '<noscript>'+
                                            '<img class="noscript-content" src="{{itemThumbUrl}}" alt="" width="auto" height="auto" />'+
                                         '</noscript>'+
                                         '<div class="lqip l-ratio--1 pointer-none"></div>'+
                                      '</div>'+
                                      '<div data-image="{{itemThumbUrl2}}?imwidth=457&amp;impolicy=product" class="js-product-tile-hover-img product-tile-image-hover l-overlay"></div>'+
                                  '</a>'+
                                   '<a href="{{itemUrl}}" class="js-product-tile-link">'+
                                      '<div class="flex flex--align-end fs--small product-tile-colors-wrapper bg-white">'+
                                         '{{colorCounter}} '+
                                      '</div>'+
                                   '</a>'+
                                '</div>'+
                                '{{newArrivalLabel}}'+
                                '<div class="fs--small l-vmargin--small">'+
                                   '<a href="{{itemUrl}}" class="simple-link js-product-tile-link">'+
                                   '{{itemTitle}}'+
                                   '</a>'+
                                '</div>'+
                                '<div class="ff-bold nowrap fs--small">'+
                                   '<div class="text-grey" style="">'+
                                      '{{itemPrice}}'+
                                   '</div>'+
                                '</div>'+
                             '</div>'+
                          '</div>',

  // List Template
  'vendorSmallListHtml': '<div class="list-view-item__vendor-column small--hide"><div class="list-view-item__vendor">{{itemVendorLabel}}</div></div>',
  'vendorMediumListHtml': '<div class="list-view-item__vendor medium-up--hide">{{itemVendorLabel}}</div>',
  'saleLabelListHtml': '<div class="list-view-item__on-sale">' + bcSfFilterConfig.label.sale + '</div>',
  'soldOutLabelListHtml': '<div class="list-view-item__sold-out">' + bcSfFilterConfig.label.sold_out + '</div>',
  'productListItemHtml':  '<li href="{{itemUrl}}" class="list-view-item">' +
                              '<div class="product-card product-card--list">' +
                                  '<div class="list-view-item__link">' +
                                      '<div class="list-view-item__image-column">' +
                                          '<div class="list-view-item__image-wrapper">' +
                                              '<img class="list-view-item__image" src="{{itemThumbUrl}}" alt="{{itemTitle}}">' +
                                          '</div>' +
                                      '</div>' +
                                      '<div class="list-view-item__title-column">' +
                                          '<div class="list-view-item__title">{{itemTitle}}</div>' +
                                          '{{itemSaleLabel}}' +
                                          '{{itemMediumVendor}}' +
                                          '{{itemSoldOutLabel}}' +
                                      '</div>' +
                                      '{{itemSmallVendor}}' +
                                      '<div class="list-view-item__price-column">{{itemPrice}}</div>' +
                                  '</div>' +
                              '</div>' +
                          '</li>',

  // Pagination Template
  'previousActiveHtml': '<li><a href="{{itemUrl}}" class="btn btn--tertiary btn--narrow"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--wide icon-arrow-left" viewBox="0 0 20 8"><path d="M4.814 7.555C3.95 6.61 3.2 5.893 2.568 5.4 1.937 4.91 1.341 4.544.781 4.303v-.44a9.933 9.933 0 0 0 1.875-1.196c.606-.485 1.328-1.196 2.168-2.134h.752c-.612 1.309-1.253 2.315-1.924 3.018H19.23v.986H3.652c.495.632.84 1.1 1.036 1.406.195.306.485.843.869 1.612h-.743z" fill="#000" fill-rule="evenodd"></path></svg><span class="icon__fallback-text">Previous</span></a></li>',
  'previousDisabledHtml': '<li><div class="btn btn--tertiary btn--narrow btn--disabled"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--wide icon-arrow-left" viewBox="0 0 20 8"><path d="M4.814 7.555C3.95 6.61 3.2 5.893 2.568 5.4 1.937 4.91 1.341 4.544.781 4.303v-.44a9.933 9.933 0 0 0 1.875-1.196c.606-.485 1.328-1.196 2.168-2.134h.752c-.612 1.309-1.253 2.315-1.924 3.018H19.23v.986H3.652c.495.632.84 1.1 1.036 1.406.195.306.485.843.869 1.612h-.743z" fill="#000" fill-rule="evenodd"></path></svg><span class="icon__fallback-text">Previous</span></div></li>',
  'nextActiveHtml': '<li><a href="{{itemUrl}}" class="btn btn--tertiary btn--narrow"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--wide icon-arrow-right" viewBox="0 0 20 8"><path d="M15.186.445c.865.944 1.614 1.662 2.246 2.154.631.491 1.227.857 1.787 1.098v.44a9.933 9.933 0 0 0-1.875 1.196c-.606.485-1.328 1.196-2.168 2.134h-.752c.612-1.309 1.253-2.315 1.924-3.018H.77v-.986h15.577c-.495-.632-.84-1.1-1.035-1.406-.196-.306-.486-.843-.87-1.612h.743z" fill="#000" fill-rule="evenodd"></path></svg><span class="icon__fallback-text">Next</span></a></li>',
  'nextDisabledHtml': '<li><div class="btn btn--tertiary btn--narrow btn--disabled"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--wide icon-arrow-right" viewBox="0 0 20 8"><path d="M15.186.445c.865.944 1.614 1.662 2.246 2.154.631.491 1.227.857 1.787 1.098v.44a9.933 9.933 0 0 0-1.875 1.196c-.606.485-1.328 1.196-2.168 2.134h-.752c.612-1.309 1.253-2.315 1.924-3.018H.77v-.986h15.577c-.495-.632-.84-1.1-1.035-1.406-.196-.306-.486-.843-.87-1.612h.743z" fill="#000" fill-rule="evenodd"></path></svg><span class="icon__fallback-text">Next</span></div></li>',
  'paginateHtml': '<ul class="list--inline pagination clearfix">{{previous}}<li class="pagination__text">{{pageItems}}</li>{{next}}</ul>',

  // Sorting Template
//   'sortingHtml': '<div class="js-plp-sorting fs--medium offset-2 cell-9 offset-mt-3 cell-mt-19 offset-m-0 cell-m-25 l-vmargin--xxlarge"><div class="fs--medium ff-bold text-grey l-vmargin--large padding-m-2">' + bcSfFilterConfig.label.sorting + '</div><ul>{{sortingItems}}</ul></div>',
  
  'sortingHtml': '',
};

var c = 0;

BCSfFilter.prototype.buildProductGridItem = function(data) {
  /*** Prepare data ***/
  var images = data.images_info;
  // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
    });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  /*** End Prepare data ***/

  // Get Template
  var itemHtml = bcSfFilterTemplate.productGridItemHtml;

  // Add a specific class for grid item
  var itemGridWidthClass = '';
  var imageSize = '600x600';

  switch (bcSfFilterConfig.custom.products_per_row) {
    case 2:
      itemGridWidthClass = 'medium-up--one-half';
      imageSize = '540x600';
      break;
    case 3:
      itemGridWidthClass = 'small--one-half medium-up--one-third';
      imageSize = '345x550';
      break;
    case 4:
      itemGridWidthClass = 'small--one-half medium-up--one-quarter';
      imageSize = '250x';
      break;
    case 5:
      itemGridWidthClass = 'small--one-half medium-up--one-fifth';
      imageSize = '195x';
      break;
  }
  itemHtml = itemHtml.replace(/{{itemGridWidthClass}}/g, itemGridWidthClass);

  // Add soldOut class
  var itemSoldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutClass}}/g, itemSoldOutClass);

  // Add soldOut label
  var itemSoldOutLabel = soldOut ? bcSfFilterTemplate.soldOutLabelGridHtml : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);
	//color counter 
  var clrctstring = '';
  var colorcount = data.options_with_values[0].values.length;
  if(colorcount >= 1){
    if (colorcount > 1) {
      clrctstring = '+ '+colorcount+' colours';        
    } else {
      clrctstring = '+ 1 colour';
    }
  }
  itemHtml = itemHtml.replace(/{{colorCounter}}/g, clrctstring);
  //Main product image
  var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src']) : bcSfFilterConfig.general.no_image_url;
  itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);
  // 2nd image for hover effect
  var itemThumbObj = data['images'][1]
  if(itemThumbObj !== undefined ){
    var itemThumbUrl2 = itemThumbObj.src
    }
  itemHtml = itemHtml.replace(/{{itemThumbUrl2}}/g, itemThumbUrl2);
  
  //new arrival label

  var productTags = data.tags,
      newArrivalLabel = '';
  if( productTags.includes('New arrival') || productTags.includes('New Arrival') || productTags.includes('new arrival')){
    newArrivalLabel = '<div><div class="item-flag fs--xsmall l-hmargin--small l-vmargin--xsmall text-white">New Arrival</div></div>'
  } else {
    newArrivalLabel = ''
  }

  itemHtml = itemHtml.replace(/{{newArrivalLabel}}/g, newArrivalLabel);
  
  var imgId = 'ProductCardImage-' + data.id;
  var wrapperId = 'ProductCardImageWrapper-' + data.id;

  // Build Image style
  var imageStyle = buildImageStyle(data);
  itemHtml = itemHtml.replace(/{{imageStyle}}/g, imageStyle);

  // Add Images
  var aspect_ratio = '';
  var itemImagesHtml = '<div id="' + wrapperId + '" class="grid-view-item__image-wrapper js">';
  itemImagesHtml += '<div style="padding-top:';
  if (images.length > 0) {
    aspect_ratio = images[0]['width'] / images[0]['height'];
    itemImagesHtml += 1 / aspect_ratio * 100;
  } else {
    itemImagesHtml += 100;
  }
  itemImagesHtml += '%;">';
  itemImagesHtml += '<img id="' + imgId + '" ' +
    'class="grid-view-item__image lazyload" ' +
    'src="' + this.getFeaturedImage(images, '300x300') + '" ' +
    'data-src="' + this.getFeaturedImage(images, '{width}x') + '" ' +
    'data-widths="[180, 360, 540, 720, 900, 1080, 1296, 1512, 1728, 2048]" ' +
    'data-aspectratio="' + aspect_ratio + '" ' +
    'data-sizes="auto" ' +
    'alt="{{itemTitle}}">';
  itemImagesHtml += '</div>';
  itemImagesHtml += '</div>';

  var image_size = bcSfFilterConfig.custom.max_height + 'x' + bcSfFilterConfig.custom.max_height;
  var max_width = images.length > 0 ? bcSfFilterConfig.custom.max_height * aspect_ratio : 0;
  itemImagesHtml += '<noscript><img class="grid-view-item__image" src="' + this.getFeaturedImage(images, image_size + '@2x') + '" alt="{{itemTitle}}" style="max-width: ' + max_width + 'px;"></noscript>';
  itemHtml = itemHtml.replace(/{{itemImages}}/g, itemImagesHtml);

  // Add Vendor
  var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorGridHtml : '';
  itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

  // Add Price
  var itemPriceHtml = buildPrice(data, onSale, priceVaries);
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

  // Add data json
  var self = this;
  var itemJson = {
    "id": data.id,
    "title": data.title,
    "handle": data.handle,
    "vendor": data.vendor,
    "variants": data.variants,
    "url": self.buildProductItemUrl(data),
    "options_with_values": data.options_with_values,
    "images": data.images,
    "available": data.available,
    "price_min": data.price_min,
    "price_max": data.price_max,
    "compare_at_price_min": data.compare_at_price_min,
    "compare_at_price_max": data.compare_at_price_max
  };
  itemHtml = itemHtml.replace(/{{itemJson}}/g, JSON.stringify(itemJson));

  // Add main attribute
  itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

  return itemHtml;
}

// Build Image style
function buildImageStyle(data) {
  var images = data.images_info;
  var imgId = 'ProductCardImage-' + data.id;
  var wrapperId = 'ProductCardImageWrapper-' + data.id;
  var imageStyle = '';
  if (images.length > 0) {
    var image = images[0];
    var width = bcSfFilterConfig.custom.max_height;
    var height = bcSfFilterConfig.custom.max_height;
    var aspect_ratio = image.width / image.height;
    var small_style = true;
    var container_aspect_ratio = width * 1.0 / height;

    if (image.aspect_ratio < 1.0) {
      var maximum_width = height * aspect_ratio;
      if (image.height <= height) {
        var maximum_height = image.height;
        maximum_width = image.width;
      } else {
        var maximum_height = height;
      }
    } else if (aspect_ratio < container_aspect_ratio) {
      var maximum_height = height / aspect_ratio;
      if (image.height <= height) {
        var maximum_height = image.height;
        var maximum_width = image.width;
      } else {
        var maximum_height = height;
        var maximum_width = height * aspect_ratio;
      }
    } else {
      var maximum_height = height / aspect_ratio;
      if (image.width <= width) {
        maximum_height = image.height;
        var maximum_width = image.width
      } else {
        var maximum_width = width;
        maximum_height = maximum_width / aspect_ratio;
      }
    }

    imageStyle += '<style>';
    if (small_style) imageStyle += '@media screen and (min-width: 750px) {';
    imageStyle += '#' + imgId + ' {' +
      'max-width: ' + maximum_width + 'px;' +
      'max-height: ' + maximum_height + 'px;' +
      '}' +
      '#' + wrapperId + ' {' +
      'max-width: ' + maximum_width + 'px;' +
      'max-height: ' + maximum_height + 'px;' +
      '}';
    if (small_style) imageStyle += '}';

    if (small_style) {
      if (aspect_ratio < 1) {
        maximum_width = 750 * aspect_ratio;
      } else {
        if (image.width < 750) {
          maximum_width = image.width;
        } else {
          maximum_width = 750;
        }
      }
      imageStyle += '@media screen and (max-width: 749px) {'
      imageStyle += '#' + imgId + ' {' +
        'max-width: ' + maximum_width + 'px;' +
        'max-height: 750px;' +
        '}' +
        '#' + wrapperId + ' {' +
        'max-width: ' + maximum_width + 'px;' +
        '}';
      imageStyle += '}';
    }
    imageStyle += '</style>';
  }
  return imageStyle;
}

BCSfFilter.prototype.buildProductListItem = function(data) {
  /*** Prepare data ***/
  var images = data.images_info;
  // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
    });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  /*** End Prepare data ***/
//  var prodCount =
  console.log(data)
  // Get Template
  var itemHtml = bcSfFilterTemplate.productListItemHtml;

  // Add onSale label
  var itemSaleLabel = onSale ? bcSfFilterTemplate.saleLabelListHtml : '';
  itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabel);

  // Add soldOut label
  var itemSoldOutLabel = soldOut ? bcSfFilterTemplate.soldOutLabelListHtml : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

  // Add Thumbnail
  var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src'], '600x600') : bcSfFilterConfig.general.no_image_url;
  itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

  // Add Vendor
  var itemSmallVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorSmallListHtml : '';
  itemHtml = itemHtml.replace(/{{itemSmallVendor}}/g, itemSmallVendorHtml);
  var itemMediumVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorMediumListHtml : '';
  itemHtml = itemHtml.replace(/{{itemMediumVendor}}/g, itemMediumVendorHtml);

  // Add Price
  var itemPriceHtml = buildPrice(data, onSale, priceVaries);
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

  // Add main attribute
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

  return itemHtml;
}

function buildPrice(data, onSale, priceVaries) {
  var priceHtml = '',
    onSaleClass = onSale ? ' price--on-sale' : '';

  priceHtml += '<dl class="price' + onSaleClass + '" data-price>';
  if (bcSfFilterConfig.custom.vendor_enable) {
    priceHtml += '<div class="price__vendor">';
    priceHtml += '<dt>';
    priceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.vendor + '</span>';
    priceHtml += '</dt>';
    priceHtml += '<dd>';
    priceHtml += data.vendor;
    priceHtml += '</dd>';
    priceHtml += '</div>';
  }
  priceHtml += '<div class="price__regular">';
  priceHtml += '<dt>';
  priceHtml += '<span class="visually-hidden visually-hidden--inline">' + bcSfFilterConfig.label.regular_price + '</span>';
  priceHtml += '</dt>';
  priceHtml += '<dd>';
  priceHtml += '<span class="price-item price-item--regular" data-regular-price>';
  if (data.available) {
    if (onSale) {
      priceHtml += bcsffilter.formatMoney(data.compare_at_price_min, bcsffilter.moneyFormat);
    } else {
      priceHtml += bcsffilter.formatMoney(data.price_min, bcsffilter.moneyFormat);
    }
  } else {
    priceHtml += bcSfFilterConfig.label.sold_out;
  }
  priceHtml += '</span>';
  priceHtml += '</dd>';
  priceHtml += '</div>';
  priceHtml += '<div class="price__sale">';
  priceHtml += '<dt>';
  priceHtml += '<span class="visually-hidden visually-hidden--inline">' + bcSfFilterConfig.label.sale_price + '</span>';
  priceHtml += '</dt>';
  priceHtml += '<dd>';
  priceHtml += '<span class="price-item price-item--sale" data-sale-price>';
  priceHtml += bcsffilter.formatMoney(data.price_min, bcsffilter.moneyFormat);
  priceHtml += '</span> ';
  priceHtml += '<span class="price-item__label" aria-hidden="true">' + bcSfFilterConfig.label.sale + '</span>';
  priceHtml += '</dd>';
  priceHtml += '</div>';
  priceHtml += '</dl>';

  return priceHtml;
}

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
  // Get page info
  var currentPage = parseInt(this.queryParams.page);
  var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

  // If it has only one page, clear Pagination
  if (totalPage == 1) {
    jQ(this.selector.pagination).html('');
    return false;
  }

  if (this.getSettingValue('general.paginationType') == 'default') {
    var paginationHtml = bcSfFilterTemplate.paginateHtml;

    // Build Previous
    var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
    previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
    paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

    // Build Next
    var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml : bcSfFilterTemplate.nextDisabledHtml;
    nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
    paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

    // Build page items
    var currentPage = bcSfFilterConfig.label.current_page.replace(/{{ current }}/g, currentPage).replace(/{{ total }}/g, totalPage);
    paginationHtml = paginationHtml.replace(/{{pageItems}}/g, currentPage);

    jQ(this.selector.pagination).html(paginationHtml);
  }
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
  var param = window.bcsffilter.queryParams.sort
  if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
    jQ(this.selector.topSorting).html('');
    
    jQ(this.selector.topSorting).append('<div class="js-plp-sorting fs--medium offset-2 cell-9 offset-mt-3 cell-mt-19 offset-m-0 cell-m-25 l-vmargin--xxlarge"><div class="fs--medium ff-bold text-grey l-vmargin--large padding-m-2">' + bcSfFilterConfig.label.sorting + '</div><ul></ul></div>')
    //   $(clearAllBtn).append(bcsffilter.template.clearAllButton);
    var sortingArr = this.getSortingList();
    var sortingItemsHtml2 = '',
        sortItem = '';
    for (var i in sortingArr) {
      var sortingItemsHtml2 = '<li class="l-vmargin--small padding-m-2"><input type="radio" name="sortItem" class="radio-custom" id="' + sortingArr[i] + '" value="' + i +'"><label class="flex flex--space-between radio-label" for="' + sortingArr[i] + '"><!---->' + sortingArr[i] + '<!----></label></li>';
      if (this.queryParams.sort == i) {
        sortingItemsHtml2 = '<li class="l-vmargin--small padding-m-2"><input checked="checked" type="radio" name="sortItem" class="radio-custom" id="' + sortingArr[i] + '" value="' + i +'"><label class="flex flex--space-between radio-label" for="' + sortingArr[i] + '"><!---->' + sortingArr[i] + '<!----></label></li>';
      }
      $('.js-plp-sorting ul').append(sortingItemsHtml2);
    }
  }
};

BCSfFilter.prototype.buildSortingEvent = function() {
  var self = this;
  jQ(this.getSelector('topSorting') + ' .radio-label').click(function(e) {
    onInteractWithToolbar(e, 'sort', self.queryParams.sort, jQ(this).siblings('input').val());
  })
};

// Build Display type
BCSfFilter.prototype.buildFilterDisplayType = function() {
  var itemHtml = '<span>View As </span>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'list', 'grid') + '" title="Grid view" class="bc-sf-filter-display-item bc-sf-filter-display-grid" data-view="grid"><span class="icon-fallback-text"><span class="fallback-text">Grid view</span></span></a>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'grid', 'list') + '" title="List view" class="bc-sf-filter-display-item bc-sf-filter-display-list" data-view="list"><span class="icon-fallback-text"><span class="fallback-text">List view</span></span></a>';
  jQ(this.selector.topDisplayType).html(itemHtml);

  // Active current display type
  jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').removeClass('active');
  jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').removeClass('active');
  if (this.queryParams.display == 'list') {
    jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').addClass('active');
  } else if (this.queryParams.display == 'grid') {
    jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').addClass('active');
  }
};

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
// Build Additional Elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
  //   var totalProduct = '';
  //   if (data.total_product == 1) {
  //     totalProduct = bcSfFilterConfig.label.items_with_count_one.replace(/{{ count }}/g, data.total_product);
  //   } else {
  //     totalProduct = bcSfFilterConfig.label.items_with_count_other.replace(/{{ count }}/g, data.total_product);
  //   }
  //   jQ('#bc-sf-filter-total-product').html(totalProduct);

  var seeBtn = $('#filter-count'),
      clearBtn = $('.bc-sf-filter-clear'),
      clearAllBtn = $('.js-plp-filters-reset')

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
      var markup = '<div class="cell-11 offset-1 offset-m-0 cell-m-25 l-vmargin-row-1"><div class="l-fill-height l-relative dir-ltr"><div class="js-content-tile l-block"><div class="l-overlay l-overflow-hidden l-m-relative l-fill-height"><div class="js-lazyload-wrapper with-placeholder l-fill-height lazyload"><a href="'+ window.bannerLink +'"><picture class="img-cover img-cover--top lazyload"><source media="(max-width: 767px)" data-srcset="https:'+ window.bannerMobileImage +'?imwidth=320&amp;impolicy=custom 320w,https:'+ window.bannerMobileImage +'?imwidth=375&amp;impolicy=custom 375w,https:'+ window.bannerMobileImage +'?imwidth=414&amp;impolicy=custom 414w,https:'+ window.bannerMobileImage +'?imwidth=767&amp;impolicy=custom 767w" sizes="(max-width: 320px) 320px,(min-width: 321px) and (max-width: 375px) 375px,(min-width: 376px) and (max-width: 414px) 414px,(min-width: 415px) and (max-width: 767px) 767px"><source media="(min-width: 768px)" data-srcset="https:'+ window.bannerDesktopImage +'?imwidth=451&amp;impolicy=custom 451w,https:'+ window.bannerDesktopImage +'?imwidth=524&amp;impolicy=custom 524w,https:'+ window.bannerDesktopImage +'?imwidth=594&amp;impolicy=custom 594w,https:'+ window.bannerDesktopImage +'?imwidth=732&amp;impolicy=custom 732w,https:'+ window.bannerDesktopImage +'?imwidth=838&amp;impolicy=custom 838w" sizes="(min-width: 768px) and (max-width: 1024px) 451px,(min-width: 1025px) and (max-width: 1190px) 524px,(min-width: 1191px) and (max-width: 1366px) 594px,(min-width: 1367px) and (max-width: 1680px) 732px,838px"><img alt="plp_content_brand_FW19_lacoste_festivalofchic" width="100%" height="auto" data-src="https:'+ window.bannerDesktopImage +'" class="img-cover img-cover--top js-lazyload lazyload" data-zoom-url="null" data-was-processed="true"></picture></a><noscript><img class="noscript-content" src="https:'+ window.bannerDesktopImage +'" alt="plp_content_brand_FW19_lacoste_festivalofchic" width="auto" height="auto" /></noscript></div></div></div></div></div>'
      $(markup).insertAfter($('#bc-sf-filter-products').children().eq(window.bannerInsertCount));
      var prodCard = $('.l-prod-card')
      $(prodCard.eq(7)).addClass('cell-m-11').removeClass('cell-m-23');
      window.productInsertCount = n
    } else {
      console.log('undefined');
    }
  }
};

// Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b}BCSfFilter.prototype.buildDefaultElements=function(a){if(bcSfFilterConfig.general.hasOwnProperty("collection_count")&&jQ("#bc-sf-filter-bottom-pagination").length>0){var b=bcSfFilterConfig.general.collection_count,c=parseInt(this.queryParams.page),d=Math.ceil(b/this.queryParams.limit);if(1==d)return jQ(this.selector.pagination).html(""),!1;if("default"==this.getSettingValue("general.paginationType")){var e=bcSfFilterTemplate.paginateHtml,f="";f=c>1?bcSfFilterTemplate.hasOwnProperty("previousActiveHtml")?bcSfFilterTemplate.previousActiveHtml:bcSfFilterTemplate.previousHtml:bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml")?bcSfFilterTemplate.previousDisabledHtml:"",f=f.replace(/{{itemUrl}}/g,buildDefaultLink("page",c-1)),e=e.replace(/{{previous}}/g,f);var g="";g=c<d?bcSfFilterTemplate.hasOwnProperty("nextActiveHtml")?bcSfFilterTemplate.nextActiveHtml:bcSfFilterTemplate.nextHtml:bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml")?bcSfFilterTemplate.nextDisabledHtml:"",g=g.replace(/{{itemUrl}}/g,buildDefaultLink("page",c+1)),e=e.replace(/{{next}}/g,g);for(var h=[],i=c-1;i>c-3&&i>0;i--)h.unshift(i);c-4>0&&h.unshift("..."),c-4>=0&&h.unshift(1),h.push(c);for(var j=[],k=c+1;k<c+3&&k<=d;k++)j.push(k);c+3<d&&j.push("..."),c+3<=d&&j.push(d);for(var l="",m=h.concat(j),n=0;n<m.length;n++)"..."==m[n]?l+=bcSfFilterTemplate.pageItemRemainHtml:l+=m[n]==c?bcSfFilterTemplate.pageItemSelectedHtml:bcSfFilterTemplate.pageItemHtml,l=l.replace(/{{itemTitle}}/g,m[n]),l=l.replace(/{{itemUrl}}/g,buildDefaultLink("page",m[n]));e=e.replace(/{{pageItems}}/g,l),jQ(this.selector.pagination).html(e)}}if(bcSfFilterTemplate.hasOwnProperty("sortingHtml")&&jQ(this.selector.topSorting).length>0){jQ(this.selector.topSorting).html("");var o=this.getSortingList();if(o){var p="";for(var q in o)p+='<option value="'+q+'">'+o[q]+"</option>";var r=bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g,p);jQ(this.selector.topSorting).html(r);var s=void 0!==this.queryParams.sort_by?this.queryParams.sort_by:this.defaultSorting;jQ(this.selector.topSorting+" select").val(s),jQ(this.selector.topSorting+" select").change(function(a){window.location.href=buildDefaultLink("sort_by",jQ(this).val())})}}};

BCSfFilter.prototype.prepareProductData = function(data) { var countData = data.length; for (var k = 0; k < countData; k++) { data[k]['images'] = data[k]['images_info']; if (data[k]['images'].length > 0) { data[k]['featured_image'] = data[k]['images'][0] } else { data[k]['featured_image'] = { src: bcSfFilterConfig.general.no_image_url, width: '', height: '', aspect_ratio: 0 } } data[k]['url'] = '/products/' + data[k].handle; var optionsArr = []; var countOptionsWithValues = data[k]['options_with_values'].length; for (var i = 0; i < countOptionsWithValues; i++) { optionsArr.push(data[k]['options_with_values'][i]['name']) } data[k]['options'] = optionsArr; if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) { var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim(); function updateMultiCurrencyPrice(oldPrice, newPrice) { if (typeof newPrice != 'undefined') { return newPrice; } return oldPrice; } data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]); data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]); data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]); data[k].compare_at_price_max = updateMultiCurrencyPrice(data[k].compare_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]); } data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100; data[k]['price'] = data[k]['price_min']; data[k]['compare_at_price'] = data[k]['compare_at_price_min']; data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max']; var firstVariant = data[k]['variants'][0]; if (getParam('variant') !== null && getParam('variant') != '') { var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant') }); if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0] } else { var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { if (data[k]['variants'][i].available) { firstVariant = data[k]['variants'][i]; break } } } data[k]['selected_or_first_available_variant'] = firstVariant; var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { var variantOptionArr = []; var count = 1; var variant = data[k]['variants'][i]; var variantOptions = variant['merged_options']; if (Array.isArray(variantOptions)) { var countVariantOptions = variantOptions.length; for (var j = 0; j < countVariantOptions; j++) { var temp = variantOptions[j].split(':'); data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1]; data[k]['variants'][i]['option_' + temp[0]] = temp[1]; variantOptionArr.push(temp[1]) } data[k]['variants'][i]['options'] = variantOptionArr } data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100; data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100 } data[k]['description'] = data[k]['content'] = data[k]['body_html']; if(data[k].hasOwnProperty('original_tags') && data[k]['original_tags'].length > 0){ data[k].tags = data[k]['original_tags'].slice(0); }} return data };