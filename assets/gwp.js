//Ty Card GWP
(function($) {
  var cartItem = $('.cart-product-wrapper .cart-product'),
      cardTitle = 'Thank You Card',
      cartCard = $('.cart-product-wrapper .ty-card'),
      cardQty = parseInt($('.ty-qty-count').val()),
      tyCard = $('.ty-card'),
      gwpCard = Cookies.get('gwpCard'),
      gwpCardItem = parseInt(localStorage.getItem('gwpCard')),
      card1 = window.card1




  if(tyCard.length === 0) {
    Cookies.remove('gwpCard')
  }

  if(cartItem.length > 0) {
    console.log('Lvl1')
    if(cartCard.length < 1) {
      if(gwpCard == undefined || tyCard.length === 0 ) {
        console.log('Lvl2')
        gwpArray = 31528305131581;
        addCard(gwpArray)
        loadPage()
      }
    }
  } else {
    if(cartCard.length > 0) {
      removeCard()
      Cookies.remove('gwpCard')
      loadPage()
    }
  }


  function addCard(item) {
    jQuery.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: {
        quantity: 1,
        id: item
      },
      dataType: 'json',           
      success: function() {
        console.log('Added', item)
        Cookies.set('gwpCard', item, { sameSite: 'strict' }, { secure: true })
      },
      error: function() {
        alert('Oops! Something went wrong. Please try to add your product again. If this message persists, the item may not be available.');
      }

    });
  }
  function changeCard(item) {
    jQuery.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: {
        quantity: 0,
        id: item
      },
      dataType: 'json',           
      success: function() {
        //           loadPage()
        location.reload();
      }

    });
  }
  function removeCard() {
    jQuery.post('/cart/clear.js')
    Cookies.remove('gwpCard')
  }

  function loadPage(){
    setTimeout(function(){
      location.reload()
    }, 1000)
  }

  $('.js-remove-lineitem').click(function(e) {
    var $this = $(this),
        item = $this.closest('.cart-product').data('item');
    Cookies.remove(item.toString())
    e.preventDefault();
    changeCard(item)
  })
})(jQuery);
