$(document).ready(function(){
  $(".dropdownmenu").on("mouseover", function() {
    var list = $('[data-target="#' + $(this).attr('id') + '"]');
    list.slideDown('slow');
  });
  setInterval(function() {
    var menus = $(".dropdownmenu");
    for (var i = 0; i < menus.length; i++) {
      var list = $('[data-target="#' + menus.eq(i).attr('id') + '"]');
      if ((!menus.eq(i).is(":hover")) && (!list.is(":hover"))) {
        list.slideUp('slow');
      }
    }
  }, 800);
  $(".dropdownmenu-list li").on("click", function() {
    location.href = $(this).attr('href');
  });
});