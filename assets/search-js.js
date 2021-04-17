$(function() {
  $(document).ready(function(){
    $('.search-box-clear').click(function(e){
      $('#global-search-form input[name="q"]').val('');
      $('#wo-results,#w-results').hide();
      $('#product-search-results').children().fadeOut(function(){
        $(this).remove();
      });
    });

    // Current Ajax request.
    var currentAjaxRequest = null;
    // Grabbing all search forms on the page, and adding a .search-results list to each.
    var searchForms = $('form#global-search-form').css('position','relative').each(function() {
      // Grabbing text input.
      var input = $(this).find('input[name="q"]');
      // Adding a list for showing search results.
      var offSet = input.position().top + input.innerHeight();
      $('<ul class="search-results"></ul>').css( { 'position': 'absolute', 'left': '0px', 'top': offSet } ).appendTo($(this)).hide();    
      // Listening to keyup and change on the text field within these search forms.
      input.attr('autocomplete', 'off').bind('keyup change', function() {
        // What's the search term?
        var term = $(this).val();
        // What's the search form?
        var form = $(this).closest('form');
        // What's the search URL?
        var searchURL = '{{ shop.url }}/search?view=json&type=product&q=' + term;
        // What's the search results list?
        // var resultsList = form.find('.search-results');
        var resultsList = $('#product-search-results');
        // If that's a new term and it contains at least 3 characters.
        if (term.length > 2 && term != $(this).attr('data-old-term')) {
          // Saving old query.
          $(this).attr('data-old-term', term);
          // Killing any Ajax request that's currently being processed.
          if (currentAjaxRequest != null) currentAjaxRequest.abort();
          // Pulling results.
          currentAjaxRequest = $.getJSON(searchURL, function(data) {
            // Reset results.
            resultsList.empty();
            // If we have no results.
            if(data.results_count == 0) {
              // resultsList.html('<li><span class="title">No results.</span></li>');
              // resultsList.fadeIn(200);
              $('#w-results').hide();
              $('#wo-results').fadeIn();
              $('.s-query').text(term);
              resultsList.hide();
            } else {
              $('#w-results').fadeIn();
              $('#wo-results').hide();
              // The Ajax request will return at the most 10 results.
              $('#result-count').text(data.results_count);
              $('.s-query').text(term);
              // If we have results.
              $.each(data.results, function(index, item) {
                var link = $('<a class="productTile isLoaded"></a>').attr('href', item.url);
                var alt_thumb = (item.alt_thumb) ? '<img class="rover" src="'+item.alt_thumb+'">' : '' ;
                var images = $('<div class="images loaded"><img class="main" src="' + item.thumbnail + '" />'+ alt_thumb +'</div>');
                link.append(images);
                var colors = '';
                if(item.colors > 1){
                  colors = '+ '+item.colors;
                  colors += (item.colors == 1) ? ' color' : ' colors';
                }
                var description = '<div class="description"><div class="description-left"><p class="product-title">'+item.title+'</p><span class="track-data" data-productname="'+item.title+'" ></span></div>'+
                    '<div class="description-right"><div class="price" data-uprice="" data-currency-code="">'+
                    '<div><span class="price-initial">₱'+item.price+'</span><br></div></div></div>'+
                    '<span class="product-colors"><ul class="product-colors"><div class="colors more">'+colors+'</div></ul></span></div>'
                link.append(description);
                resultsList.append(link);


              });

              // If there are more than 10, let's link to the search results page.
              if(data.results_count > 10) {
                resultsList.append('<li><span class="title"><a href="' + searchURL + '">See all results (' + data.results_count + ')</a></span></li>');
              }
              resultsList.fadeIn(200);
            }        
          });
        }
      });
    });
    // Clicking outside makes the results disappear.
    $('body').bind('click', function(){
      $('.search-results').hide();
    });
  })
});