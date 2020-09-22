function search_user(){
    var form = {
        type: "search_bar",
        username: $("#search_name").val(),
    };
    $.ajax({
    type: 'POST',
    url:  '/',
    data: form,
    success: function(data){
            $("#search_result").text("");
            var parent = document.getElementById('search_result');
            parent.style.display = 'block';
            if (data.user_list.length > 0){
                for (var i = 0; i < data.user_list.length; i++){
                    var newItem = '<li><a class="dropdown-item" href="#" onclick="add_args_profile('
                                + data.user_list[i].pk + '); return false;">'
                                + data.user_list[i].username
                                + '</a></li>';
                    parent.insertAdjacentHTML('beforeend', newItem);
                };
            }
            else{
                parent.insertAdjacentHTML('beforeend', '<p class="text-center" id="title_search_user">Not found such user</p>');
            }
        }
    });
};
function add_args_profile(pk){
    let url = '/profile/' + pk;
    window.location = url;
};

function user_menu_hide(){
    var parent = document.getElementById('search_result');
    parent.style.display = 'none';
};

$(document).mouseup(function (e){
    if (!$("#search_name").is(e.target) && !$("#search_result").is(e.target) && !$("#title_search_user").is(e.target)){
         user_menu_hide();
    }
});
