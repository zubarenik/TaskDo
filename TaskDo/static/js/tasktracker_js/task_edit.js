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

function choose_project_member(){
    var csrftoken = getCookie('csrftoken');
    var form = {
        csrfmiddlewaretoken: csrftoken,
        type: "choose_project_member",
        project_id: $("#task_project_id_edit").val(),
        project_member: $("#task_assignee_edit").val(),
    };
    $.ajax({
        type: 'POST',
        url:   '/project/' + $("#task_project_id_edit").val() + '/create/task',
        data: form,
        success: function(data){
            $("#task_choose_result_edit").text("");
            var parent = document.getElementById('task_choose_result_edit');
            var task_assignee_title = document.getElementById('task_assignee_title_edit');
            if (data.project_member_list.length > 0){
                parent.style.display = 'block';
                for (var i = 0; i < data.project_member_list.length; i++){
                    var newItem = '<li><a class="dropdown-item" href="#" onclick="assignee_fill_field(' + "'"
                                + data.project_member_list[i].username + "'" + '); return false;">'
                                + data.project_member_list[i].username
                                + '</a></li>';
                    parent.insertAdjacentHTML('beforeend', newItem);
                    if (data.project_member_list[i].username == $("#task_assignee_edit").val()){
                        task_assignee_title.textContent = 'Correct';
                        task_assignee_title.style.color = '#05FF2B';
                        $("#task_assignee_edit").removeClass('is-invalid');
                        $("#task_assignee_edit").addClass('is-valid');
                        parent.style.display = 'none';
                    }
                };
            }
            else{
                parent.style.display = 'none';
                task_assignee_title.style.color = '#EC1820';
                task_assignee_title.textContent = 'Not found such user in this project';
                $('#task_assignee_edit').removeClass('is-valid');
                $('#task_assignee_edit').addClass('is-invalid');
            }
        }
    });
};

function task_menu_hide(){
    var parent = document.getElementById('task_choose_result_edit');
    parent.style.display = 'none';
};

function assignee_fill_field(username){
    var task_assignee_title = document.getElementById('task_assignee_title_edit');
    task_assignee_title.textContent = 'Correct';
    task_assignee_title.style.color = '#05FF2B';
    $("#task_assignee_edit").removeClass('is-invalid');
    $("#task_assignee_edit").addClass('is-valid');
    $("#task_assignee_edit").val(username);
    task_menu_hide();
};

$(document).mouseup(function (e){
    if (!$("#task_label_edit").is(e.target) && !$("#task_choose_result_edit").is(e.target)
        && !$("#task_assignee_edit").is(e.target)){
        task_menu_hide();
    }
});