(function () {
    var getProductRef = function(product) {
        return product && product.sku;
    };

    var getProductData = function() {
        var product = utag_data.product;
        product = getProductRef(product);
        return [product];
    };

    var getCartDatas = function() {
        var datas = [];

        if (typeof utag_data.cart !== 'undefined') {
            var products = utag_data.cart.items;

            if (products) {
                for (var i = 0, l = products.length; i < l; i++) {
                    var product = products[i].product;
                    var productID = getProductRef(product);
                    datas.push(productID);
                }
            }
        }

        return datas;
    };

    var getCategoryData = function() {
        var category = utag_data.page.subcategory;
        return category.split('_');
    };

    var getDatasAndType = function() {
        var type = null;
        var datas = [];
        var language = document.querySelector('html').getAttribute('lang');

        if (typeof utag_data !== 'undefined') {
            var utagCategory = utag_data.page && utag_data.page.pagecategory;
            // 'utag_data.page.pagecategory' is not set to 'product' yet...
            if (utagCategory === 'other') {
                utagCategory = (utag_data.product && utag_data.product.productid) ? 'product' : 'other';
            }

            switch (utagCategory) {
            case 'home':
                type = 'HOMEPAGE';
                break;

            case 'basket':
                type = 'CART';
                datas = getCartDatas();
                break;

            case 'category':
                type = 'CATEGORY';
                datas = getCategoryData();
                break;

            case 'product':
                type = 'PRODUCT';
                datas = getProductData();
                break;

            default:
                type = 'OTHER';
                datas = [];
                break;
            }
        }

        return {
            type: type,
            data: datas,
            lng: language
        };
    };

    var init = function() {
        var dynamicYieldSectionID = window.dySectionId || null;

        if (dynamicYieldSectionID) {
            window.DY = window.DY || {};
            window.DY.recommendationContext = getDatasAndType();

            var dynamicScript = document.createElement('script');
            dynamicScript.src = '//cdn.dynamicyield.com/api/' + dynamicYieldSectionID + '/api_dynamic.js';

            var staticScript = document.createElement('script');
            staticScript.src = '//cdn.dynamicyield.com/api/' + dynamicYieldSectionID + '/api_static.js';

            document.querySelector('head').appendChild(dynamicScript);
            document.querySelector('head').appendChild(staticScript);
        }
    };

    init();
})();