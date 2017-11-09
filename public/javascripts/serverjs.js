var submituserform = function() {
  if ($) {
    var str = $("form").serialize();
    console.log(str);
  // $.ajax(
  //   {
  //     url: '/users/create',
  //     method: 'POST',
  //     data: JSON.stringify($('form').serialize()),
  //     success: function(x, h, r) {
  //       alert(x);
  //     },
  //     error: function(x, h, r) {
  //       alert(x)
  //     }
  //   });
  }
}