function add_args_task(event, project_id, pk){
    if ($(".project-href").is(event.target)){
        return;
    }
    let url = '/project/' + project_id + '/task/' + pk;
    window.location = url;
};

function add_args_author(pk, event){
    if ($(".project-info-item").is(event.target)){
        return;
    }
    let url = '/profile/' + pk;
    window.location = url;
};

function add_args_project(event, pk){
    if ($(".project-href").is(event.target)){
        return;
    }
    let url = '/project/' + pk;
    window.location = url;
};

function editProjectMember(event, project_id, pk){
    let url = '/project/' + project_id + '/member/edit/' + pk;
    window.location = url;
};

function deleteProjectMember(event, project_id, pk){
    let url = '/project/' + project_id + '/member/delete/' + pk;
    window.location = url;
};

function getMonthName(month){
    var months = ['January', 'February', 'March', 'April',
                  'May', 'June', 'July', 'August',
                  'September', 'October', 'November', 'December'];
    return months[month];
};

$.get(
    window.location,
    function() {
        if ($("#check_task_detail").val() == '0'){
            var date = document.getElementById('set_project_task_entry_date');
            var dateValue =  new Date($("#project_task_entry_date").val());
            date.innerHTML = String(dateValue.getDate()) + ' '
                           + getMonthName(dateValue.getMonth()) + ' '
                           + String(dateValue.getFullYear());
        }
        else{
            var dates = document.getElementsByClassName('task_set_date');
            var entryDate = new Date($("#task_entry_date").val());
            dates[0].innerHTML = String(entryDate.getDate()) + ' '
                               + getMonthName(entryDate.getMonth()) + ' '
                               + String(entryDate.getFullYear());
            if ($("#task_close_date").val() != 'None'){
                var closeDate = new Date($("#task_close_date").val());
                dates[1].innerHTML = String(closeDate.getDate()) + ' '
                                   + getMonthName(closeDate.getMonth()) + ' '
                                   + String(closeDate.getFullYear());
            }
            else{
                dates[1].innerHTML = 'None';
            }
        }
    }
);