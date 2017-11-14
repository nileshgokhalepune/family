$(document).ready(function() {
  $('#registerform').validate({
    rules: {
      name: {
        required: true
      },
      lastName: {
        required: true
      },
      userName: {
        required: true
      },
      dateofBirth: {
        required: true
      },
      password: {
        required: true,
        minlength: 8
      },
      retypepassword: {
        required: true,
        minlength: 8
      }
    },
    submitHandler: function(form) {
      debugger;
    }
  });
})
var submituserform = function() {
  if ($) {
    var str = $("form").serialize();
    console.log(str);
  }
}

var registerUser = function(event) {
  event.preventDefault();
  if ($('form').valid()) {
    var str = $('form').serialize();
    $.ajax({
      url: '/users/create',
      method: 'POST',
      data: str,
      success: function(x, h, r) {
        if (x) {
          //we need to join these together.
          var userId = $("#userId").val();
          var newUserId = x._id;
          var relation = $("#relation").val();
        }
        $.ajax({
          url: '/users/relate',
          method: 'POST',
          data: {
            userId: userId,
            newUserId: newUserId,
            relation: relation
          },
          success: function(res) {},
          error: function(err) {}
        })
        debugger;
      },
      error: function(x, h, r) {
        debugger;
      }
    });
  }
}