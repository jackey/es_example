(function () {
  $(function () {
    var $form = $('form[name="search-box"]');

    var api = '/search';
    function searchWithKeyword(keyword, cb) {
      cb = cb || (function () {});
      $.ajax({
        url: api,
        data: {q: keyword},
        method: 'get'
      }).then(function (res) {
        cb(res);
      });
    }

    var timer, $conResults = $('.search-items');
    $form.find('input').keyup(function (event) {
      if (timer) {
        clearTimeout(timer)
      }
      var $this = $(this);
      var keyword = $this.val();
      timer = window.setTimeout(function () {
        searchWithKeyword(keyword, function (results) {
          var html = [];
          for (var i = 0; i < results.length;i++) {
            var item = results[i];
            html.push('<a href="'+item.url+'" target="_blank">'+item.name+'</a>');
          }
          $conResults.html(html.join(''));
        });
      }, 600);
    });
  });
})(jQuery);