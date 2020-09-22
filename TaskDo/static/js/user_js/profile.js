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

function clear_trash_password_change(){
    $('#current_password').removeClass('is-invalid');
    $('#new_password').removeClass('is-invalid');
    $('#confirm_password').removeClass('is-invalid');
    $('#current_password').val("");
    $('#new_password').val("");
    $('#confirm_password').val("");
};

function clear_trash_username_change(){
    $("#new_username").removeClass('is-invalid');
    $("#new_username").val("");
};

$(document).ready(function(){

    $("#clear1").click(function(e) {
          clear_trash_password_change();
    });

    $("#clear2").click(function(e) {
          clear_trash_username_change();
    });

    $('#change_pass').bind('click', function() {
        var csrftoken = getCookie('csrftoken');
        var form = {
            csrfmiddlewaretoken: csrftoken,
            type: "password",
            old_password: $("#current_password").val(),
            new_password: $("#new_password").val(),
            confirm: $("#confirm_password").val(),
        };
        $.ajax({
            type: 'POST',
            url:  window.location.href,
            data: form,
            success: function(data){
                if (data.error_cur == false){
                     $('#current_password').removeClass('is-valid');
                     $('#current_password').addClass('is-invalid');
                     $('#error_cur').removeClass('valid-feedback');
                     $('#error_cur').addClass('invalid-feedback');
                     $('#error_cur').text(data.error_text);
                     $('#new_password').removeClass('is-invalid');
                     $('#confirm_password').removeClass('is-invalid');
                }
                else{
                    if (data.error_new == false){
                        $('#current_password').removeClass('is-invalid');
                        $('#new_password').removeClass('is-valid');
                        $('#new_password').addClass('is-invalid');
                        $('#confirm_password').removeClass('is-valid');
                        $('#confirm_password').addClass('is-invalid');
                        $('#error_new').removeClass('valid-feedback');
                        $('#error_new').addClass('invalid-feedback');
                        var errors = document.getElementById('error_new');
                        errors.innerHTML = '';
                        for (var i = 0; i < data.error_text.length; i++){
                            errors.insertAdjacentHTML('beforeend', '<p style="margin-left: 4px">' + data.error_text[i] + '</p>');
                        }
                    }
                    else{
                        clear_trash_password_change();
                        $('#change_password').modal('hide');
                    }
                }
            }
        });
    });

    $('#change_name').bind('click', function() {
        var csrftoken = getCookie('csrftoken');
        var form = {
            csrfmiddlewaretoken: csrftoken,
            type: "username",
            username: $("#new_username").val(),
        };
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: form,
            success: function(data){
                if (data.success == false){
                    $('#new_username').removeClass('is-valid');
                    $('#new_username').addClass('is-invalid');
                    $('#error_name').removeClass('valid-feedback');
                    $('#error_name').addClass('invalid-feedback');
                    var errors = document.getElementById('error_name');
                    errors.innerHTML = '';
                    for (var i = 0; i < data.error_text.length; i++){
                        errors.insertAdjacentHTML('beforeend', '<p style="margin-left: 4px">' + data.error_text[i] + '</p>');
                    }
                }
                else {
                    clear_trash_username_change();
                    location.reload();
                }
            }
        });
    });

});

function add_args(pk){
    let url = 'edit/' + pk;
    window.location = url;
};

var check = true;

function check_scroll(){
    check = false;
};

$(document).mouseup(function (e){
    if (!check) {
        check = true;
        return;
    }
    var target = event.target;
    while (target.tagName != 'HTML'){
        if (target.className == 'modal-content profile'
            || target.className == 'modal-content profile password'){
            return;
        }
        target = target.parentNode;
    }
    clear_trash_password_change();
    clear_trash_username_change();
});