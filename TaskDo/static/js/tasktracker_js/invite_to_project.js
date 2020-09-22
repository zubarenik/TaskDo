function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
            }
        }
    }
    return cookieValue;
};

function clear_trash_invite(){
    $("#invited_member").removeClass('is-invalid');
    $("#invited_member").removeClass('is-valid');
    $("#invited_member").val("");
    $("#invited_member_title").text("");
    $("#message").val("");
    $('input[name=role]:checked').prop('checked', false);
    $("#role_guest").prop('checked', true);
};

function choose_new_project_member(){
    var csrftoken = getCookie('csrftoken');
    var form = {
        csrfmiddlewaretoken: csrftoken,
        type: "choose_new_member",
        project_id: $("#project_id").val(),
        username: $("#invited_member").val(),
    };
    $.ajax({
        type: 'POST',
        url:  '/project/' + $("#project_id").val(),
        data: form,
        success: function(data){
            $("#choose_new_member").text("");
            var parent = document.getElementById('choose_new_member');
            var invited_member_title = document.getElementById('invited_member_title');
            if (data.user_list.length > 0){
                parent.style.display = 'block';
                var flag = true;
                for (var i = 0; i < data.user_list.length; i++){
                    if (!data.user_list[i].is_in_project && !data.user_list[i].is_invited){
                        var newItem = '<li><a class="dropdown-item" href="#" onclick="member_fill_field(' + "'"
                                    + data.user_list[i].username + "'" + '); return false;">'
                                    + data.user_list[i].username
                                    + '</a></li>';
                        parent.insertAdjacentHTML('beforeend', newItem);
                        parent.style.display = 'block';
                    }
                    if (data.user_list[i].username == $("#invited_member").val()){
                        if (!data.user_list[i].is_in_project && !data.user_list[i].is_invited){
                            invited_member_title.textContent = 'Correct';
                            invited_member_title.style.color = '#05FF2B';
                            $("#invited_member").removeClass('is-invalid');
                            $("#invited_member").addClass('is-valid');
                        }
                        else if(!data.user_list[i].is_invited){
                            invited_member_title.textContent = 'This user is already a member of this project';
                            invited_member_title.style.color = '#EC1820';
                            $("#invited_member").removeClass('is-valid');
                            $("#invited_member").addClass('is-invalid');
                        }
                        else{
                            invited_member_title.textContent = 'This user is already invited';
                            invited_member_title.style.color = '#EC1820';
                            $("#invited_member").removeClass('is-valid');
                            $("#invited_member").addClass('is-invalid');
                        }
                        parent.style.display = 'none';
                        flag = false;
                    }
                    else if (flag){
                        invited_member_title.style.color = '#EC1820';
                        invited_member_title.textContent = 'Not found such user';
                        $('#invited_member').removeClass('is-valid');
                        $('#invited_member').addClass('is-invalid')
                    }
                    if (parent.innerHTML == ''){
                        parent.style.display = 'none';
                    }
                };
            }
            else{
                parent.style.display = 'none';
                invited_member_title.style.color = '#EC1820';
                invited_member_title.textContent = 'Not found such user';
                $('#invited_member').removeClass('is-valid');
                $('#invited_member').addClass('is-invalid');
            }
        }
    });
};

$(document).ready(function(){

    $("#clear_invite_project").click(function(e) {
          clear_trash_invite();
    });

    $('#project_invite_member').bind('click', function() {
        var csrftoken = getCookie('csrftoken');
        var form = {
            csrfmiddlewaretoken: csrftoken,
            type: "invite",
            text: $("#message").val(),
            role: $('input[name=role]:checked').val(),
            username: $("#invited_member").val(),
            project_id: $("#project_id").val(),
        };
        $.ajax({
            type: 'POST',
            url: '/project/' + $("#project_id").val(),
            data: form,
            success: function(data){
                if (data.success){
                    clear_trash_invite();
                    $('#project_invite').modal('hide');
                }
                else {
                    if (typeof data.errors !== 'undefined'){
                        var invited_member_title = document.getElementById('invited_member_title');
                        invited_member_title.style.color = '#EC1820';
                        invited_member_title.textContent = data.errors;
                        $('#invited_member').removeClass('is-valid');
                        $('#invited_member').addClass('is-invalid')
                    }
                }
            }
        });
    });
});

function invite_menu_hide(){
    var parent = document.getElementById('choose_new_member');
    parent.style.display = 'none';
};

function member_fill_field(username){
    var invited_member_title = document.getElementById('invited_member_title');
    invited_member_title.textContent = 'Correct';
    invited_member_title.style.color = '#05FF2B';
    $("#invited_member").removeClass('is-invalid');
    $("#invited_member").addClass('is-valid');
    $("#invited_member").val(username);
    invite_menu_hide();
};

$(document).mouseup(function (e){
    if (!$("#invited_member_label").is(e.target) && !$("#choose_new_member").is(e.target)
        && !$("#invited_member").is(e.target)){
        invite_menu_hide();
    }
});

var invite_check = true;

function check_scroll(){
    invite_check = false;
};

$(document).mouseup(function (event){
    if (!invite_check) {
        invite_check = true;
        return;
    }
    var target = event.target;
    while (target.tagName != 'HTML'){
        if (target.className == 'modal-content profile'){
            return;
        }
        target = target.parentNode;
    }
    clear_trash_invite();
});