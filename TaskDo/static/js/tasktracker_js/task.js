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

function clear_trash_task(){
    $("#task_assignee").removeClass('is-invalid');
    $("#task_assignee").removeClass('is-valid');
    $("#task_assignee_title").text("");
    $("#task_assignee").val("");
    $("#task_title").removeClass('is-invalid');
    $("#task_title").val("");
    $('#task_title_errors').removeClass('invalid-feedback');
    $("#task_title_errors").text('');
    $("#task_description").removeClass('is-invalid');
    $("#task_description").val("");
    $('#task_description_errors').removeClass('invalid-feedback');
    $("#task_description_errors").text('');
    $("#task_date").val("");
};

$(document).ready(function(){

      $('#task_clear').bind('click', function() {
        clear_trash_task();
      });

      $('#task_creation').bind('click', function() {
        var csrftoken = getCookie('csrftoken');
        var form = {
            csrfmiddlewaretoken: csrftoken,
            type: "task_creation",
            project_id: $("#project_id").val(),
            title: $("#task_title").val(),
            description: $("#task_description").val(),
            assignee: $("#task_assignee").val(),
            close_date: $("#task_date").val(),
        };
        $.ajax({
            type: 'POST',
            url: $("#project_id").val() + '/create/task',
            data: form,
            success: function(data){
                if (data.success){
                    clear_trash_task();
                    location.reload();
                }
                else{
                    if (typeof data.errors['title'] !== 'undefined'){
                        $('#task_title').removeClass('is-valid');
                        $('#task_title').addClass('is-invalid');
                        $('#task_title_errors').removeClass('valid-feedback');
                        $('#task_title_errors').addClass('invalid-feedback');
                        $("#task_title_errors").text(data.errors['title']);
                    }
                    else{
                        $('#task_title_errors').removeClass('invalid-feedback');
                        $("#task_title_errors").text('');
                        $('#task_title').removeClass('is-invalid');
                    }
                    if (typeof data.errors['description'] !== 'undefined'){
                        $('#task_description').removeClass('is-valid');
                        $('#task_description').addClass('is-invalid');
                        $('#task_description_errors').removeClass('valid-feedback');
                        $('#task_description_errors').addClass('invalid-feedback');
                        $("#task_description_errors").text(data.errors['description']);
                    }
                    else{
                        $('#task_description_errors').removeClass('invalid-feedback');
                        $("#task_description_errors").text('');
                        $('#task_description').removeClass('is-invalid');
                    }
                }
            }
        });
    });

});

function choose_project_member(){
    var csrftoken = getCookie('csrftoken');
    var form = {
        csrfmiddlewaretoken: csrftoken,
        type: "choose_project_member",
        project_id: $("#project_id").val(),
        project_member: $("#task_assignee").val(),
    };
    $.ajax({
        type: 'POST',
        url:  $("#project_id").val() + '/create/task',
        data: form,
        success: function(data){
            $("#task_choose_result").text("");
            var parent = document.getElementById('task_choose_result');
            var task_assignee_title = document.getElementById('task_assignee_title');
            if (data.project_member_list.length > 0){
                parent.style.display = 'block';
                var flag = true;
                for (var i = 0; i < data.project_member_list.length; i++){
                    var newItem = '<li><a class="dropdown-item" href="#" onclick="assignee_fill_field(' + "'"
                                + data.project_member_list[i].username + "'" + '); return false;">'
                                + data.project_member_list[i].username
                                + '</a></li>';
                    parent.insertAdjacentHTML('beforeend', newItem);
                    if (data.project_member_list[i].username == $("#task_assignee").val()){
                        task_assignee_title.textContent = 'Correct';
                        task_assignee_title.style.color = '#05FF2B';
                        $("#task_assignee").removeClass('is-invalid');
                        $("#task_assignee").addClass('is-valid');
                        parent.style.display = 'none';
                        flag = false;
                    }
                    else if (flag){
                        task_assignee_title.style.color = '#EC1820';
                        task_assignee_title.textContent = 'Not found such user in this project';
                        $('#task_assignee').removeClass('is-valid');
                        $('#task_assignee').addClass('is-invalid')
                    }
                    if (parent.innerHTML == ''){
                        parent.style.display = 'none';
                    }
                };
            }
            else{
                parent.style.display = 'none';
                task_assignee_title.style.color = '#EC1820';
                task_assignee_title.textContent = 'Not found such user in this project';
                $('#task_assignee').removeClass('is-valid');
                $('#task_assignee').addClass('is-invalid');
            }
        }
    });
};

function task_menu_hide(){
    var parent = document.getElementById('task_choose_result');
    parent.style.display = 'none';
};

function assignee_fill_field(username){
    var task_assignee_title = document.getElementById('task_assignee_title');
    task_assignee_title.textContent = 'Correct';
    task_assignee_title.style.color = '#05FF2B';
    $("#task_assignee").removeClass('is-invalid');
    $("#task_assignee").addClass('is-valid');
    $("#task_assignee").val(username);
    task_menu_hide();
};

$(document).mouseup(function (e){
    if (!$("#task_label").is(e.target) && !$("#task_choose_result").is(e.target)
        && !$("#task_assignee").is(e.target)){
        task_menu_hide();
    }
});

var task_check = true;

function check_scroll(){
    task_check = false;
};

$(document).mouseup(function (event){
    if (!task_check) {
        task_check = true;
        return;
    }
    var target = event.target;
    while (target.tagName != 'HTML'){
        if (target.className == 'modal-content profile'){
            return;
        }
        target = target.parentNode;
    }
    clear_trash_task();
});