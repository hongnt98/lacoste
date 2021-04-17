// (function($){
//   $(document).ready(function(){

    $.ns('Lacoste.passwordrecovery');

    Lacoste.passwordrecovery.bindEvents = function () {
      Lacoste.passwordrecovery.validateForm();
    };

    Lacoste.passwordrecovery.validateForm = function () {
      var message = '';
      var messageFunc = function () { return message; };

      Lacoste.securitypassword.validate('input[name="changeyourpassword"]');
      if (Lacoste.login.isLoginByMobile()) {
        $('#register-form').validate({
          errorElement: 'span',
          rules: {
            changeyourpassword: {
              required: true,
              regex: /^\w{6,20}$/
            },
            changepasswordconfirm: {
              required: true,
              equalTo: '#register-password'
            }
          },
          messages: {
            changeyourpassword: {
              required: $('input[name=changeyourpassword]').data('error-required'),
              regex: $('input[name=changeyourpassword]').data('error-length')
            },
            changepasswordconfirm: {
              required: $('input[name=changepasswordconfirm]').data('error-required'),
              equalTo: $('input[name=changepasswordconfirm]').data('error-equalto')
            }
          },
          // the errorPlacement has to take the table layout into account
          errorPlacement: function (error, element) {
            Lacoste.Utils.ErrorPlacement(error, element);
          }
        });
      } else {
        $('#register-form').validate({
          errorElement: 'span',
          rules: {
            changeyourpassword: {
              required: true,
              minlength: 6
            },
            changepasswordconfirm: {
              required: true,
              equalTo: '#register-password'
            }
          },
          messages: {
            changeyourpassword: {
              required: $('input[name=changeyourpassword]').data('error-required'),
              minlength: $('input[name=changeyourpassword]').data('error-length')
            },
            changepasswordconfirm: {
              required: $('input[name=changepasswordconfirm]').data('error-required'),
              equalTo: $('input[name=changepasswordconfirm]').data('error-equalto')
            }
          },
          // the errorPlacement has to take the table layout into account
          errorPlacement: function (error, element) {
            Lacoste.Utils.ErrorPlacement(error, element);
          }
        });
      }
    };

//   });



// })(jQuery);