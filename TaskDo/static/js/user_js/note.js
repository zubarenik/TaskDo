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

function clear_trash_note(){
    $("#note_title").removeClass('is-invalid');
    $("#note_title").val("");
    $('#note_error_title').removeClass('invalid-feedback');
    $("#note_error_title").text('');
    $("#note_text").removeClass('is-invalid');
    $("#note_text").val("");
    $('#note_error_text').removeClass('invalid-feedback');
    $("#note_error_text").text('');
    $("#note_priority").removeClass('is-invalid');
    $("#note_priority").val("1");
    $('#note_error_priority').removeClass('invalid-feedback');
    $("#note_error_priority").text('');
    $("#note_date").val("");
    $("#note_time").val("");
    document.getElementById('note_time_field').style.display = 'none';
    document.getElementById('note_date_field').style.display = 'block';
};

$(document).ready(function(){

    $('#note_clear').bind('click', function() {
        clear_trash_note();
    });

    $('#create_note_button').bind('click', function() {
        var csrftoken = getCookie('csrftoken');
        var form = {
            csrfmiddlewaretoken: csrftoken,
            type: "note_create",
            text: $("#note_text").val(),
            title: $("#note_title").val(),
            user_id: $("#user_id").val(),
            date: $("#note_date").val(),
            time: $("#note_time").val(),
            priority: $("#note_priority").val(),
        };
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: form,
            success: function(data){
                if (data.success){
                    clear_trash_note();
                    location.reload();
                }
                else {
                    if (typeof data.errors['title'] !== 'undefined'){
                        $('#note_title').removeClass('is-valid');
                        $('#note_title').addClass('is-invalid');
                        $('#note_error_title').removeClass('valid-feedback');
                        $('#note_error_title').addClass('invalid-feedback');
                        $("#note_error_title").text(data.errors['title']);
                    }
                    else{
                        $('#note_error_title').removeClass('invalid-feedback');
                        $("#note_error_title").text('');
                        $('#note_title').removeClass('is-invalid');
                    }
                    if (typeof data.errors['text'] !== 'undefined'){
                        $('#note_text').removeClass('is-valid');
                        $('#note_text').addClass('is-invalid');
                        $('#note_error_text').removeClass('valid-feedback');
                        $('#note_error_text').addClass('invalid-feedback');
                        $("#note_error_text").text(data.errors['text']);
                    }
                    else{
                        $('#note_error_text').removeClass('invalid-feedback');
                        $("#note_error_text").text('');
                        $('#note_text').removeClass('is-invalid');
                    }
                    if (typeof data.errors['priority'] !== 'undefined'){
                        $('#note_priority').removeClass('is-valid');
                        $('#note_priority').addClass('is-invalid');
                        $('#note_error_priority').removeClass('valid-feedback');
                        $('#note_error_priority').addClass('invalid-feedback');
                        $("#note_error_priority").text(data.errors['priority']);
                    }
                    else{
                        $('#note_error_priority').removeClass('invalid-feedback');
                        $("#note_error_priority").text('');
                        $('#note_priority').removeClass('is-invalid');
                    }
                }
            }
        });
    });

});

function processingTimeField(){
    var timeField = document.getElementById('note_time_field');
    if ($("#note_date").val() == ''){
        timeField.style.display = 'none';
        $("#note_time").val('');
    }
    else {
        timeField.style.display = 'block';
    }
}

var check = true;

function check_scroll(){
    check = false;
};

$(document).mouseup(function (event){
    if (!check) {
        check = true;
        return;
    }
    var target = event.target;
    while (target.tagName != 'HTML'){
        if (target.className == 'modal-content profile'){
            return;
        }
        target = target.parentNode;
    }
    clear_trash_note();
});