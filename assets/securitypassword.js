

validate('#CreatePassword');


function checkLevel(password) {
    var hasCapLetter = false;
    var hasNonCapLetter = false;
    var hasNumber = false;

    for (var i = 0; i < password.length; i++) {
		if(/[A-Z]+$/.test(password[i])){
			hasCapLetter = true;
		}
		if(/[a-z]+$/.test(password[i])){
			hasNonCapLetter = true;
		}
		if(/[0-9]+$/.test(password[i])){
			hasNumber = true;			
		}
    }

    return hasCapLetter && hasNonCapLetter && hasNumber;
};

function validate(element) {
    $('#security-level-message').hide();
    hideSecurity(5);

    $(element).on('keyup', function() {
        var password = $(this).val(),
            err = $(this).data('error-length'),
            errel = $(this).parent().find('.err');
        if(checkLevel(password)) {
          errel.text('');
        }else {
          errel.show();
          errel.text(err)
        }
        if (password.length > 0) {
            $('#security-level-message').show();
        } else {
            $('#security-level-message').hide();
            $('span > strong').removeClass();
          	errel.text('Required');
            return;
        }

        $('span > strong').removeClass();
        if (password.length > 7 && checkLevel(password)) {
            $('span > strong').addClass('lvl-4');
            hideSecurity(4);
            return true;
        }

        if (password.length > 6) {
            $('span > strong').addClass('lvl-3');
            hideSecurity(3);
            return false;
        }

        if (password.length === 6) {
            $('span > strong').addClass('lvl-2');
            hideSecurity(2);
            return false;
        }

        if (password.length < 6) {
            $('span > strong').addClass('lvl-1');
            hideSecurity(1);
            return false;
        }
    });

    function hideSecurity(level) {
        for (var i = 0; i < 5; i++) {
            if (i !== level) {
                $('.security' + i).hide();
            } else {
                $('.security' + i).css('display', 'inline-block');
            }
        }
    }
};

$('#password2').on('keyup', function() {
  var $this = $(this),
      txt = $('#CreatePassword').val(),
      v = $this.val(),
      errel = $this.parent().find('.err');
  if(v.length > 0) {
    if(txt === v) {
      errel.hide();
      errel.text('');
    }else {
      errel.show();
      errel.text('Not match')
    }
  }else {
    errel.show();
    errel.text('Required');
  }
  
})
$('#email2').on('keyup', function() {
  var $this = $(this),
      txt = $('#Email').val(),
      v = $this.val(),
      errel = $this.parent().find('.err');
  if(v.length > 0) {
    if(txt === v) {
      errel.hide();
      errel.text('');
    }else {
      errel.show();
      errel.text('Emails must be equals')
    }
  }else {
    errel.show();
    errel.text('Required');
  }

})