var members = [], tasks = [];

function getData(){
    $.ajax({
        type: 'POST',
        url:  '/project/' + $("#project_id").val(),
        data: {'type': 'switch'},
        async: false,
        success: function(data){
            tasks = data.tasks;
            members = data.members;
        }
    });
};

$.get(
    window.location,
    function() {
        getData();
    }
);

function projectSwitch(role){
    var button = document.getElementById('project_switch_button');
    var content = document.getElementById('project_switch_output');
    content.innerHTML = '';
    if (button.innerHTML == 'Members'){
        button.innerHTML = 'Tasks';
        for (var i = 0; i < members.length; i++){
            var newItem = '<div class="project_block" onclick="add_args_author(' + members[i].user_pk + ',event)">'
                        + '<h3 class="project_name">' + members[i].user_username + '</h3>'
                        + '<p class="project_text">' + members[i].role + '</p>';
            if (members[i].role != 'Owner' && (role == 'Owner' || (role == 'Maintainer' && members[i].role != 'Maintainer'))){
            newItem += '<div class="project-info">'
                    + '<div class="project-info-item" onclick="editProjectMember(event,'
                    + $("#project_id").val() + ',' + members[i].pk + ')">Edit</div>'
                    + '<div class="project-info-item delete" onclick="deleteProjectMember(event,'
                    + $("#project_id").val() + ',' + members[i].pk + ')">Delete</div>'
                    + '</div>';
            }
            newItem += '</div>';
            content.insertAdjacentHTML('beforeend', newItem);
        }
    }
    else{
        button.innerHTML = 'Members';
        if (tasks.length == 0){
            content.innerHTML = '<h3 class="text-center" style="color: #A747F8; font-size: 25px">There ' + "aren't " +  'any tasks in this project :(</h3>'
            return;
        }
        for (var i = 0; i < tasks.length; i++){
            var dateValue =  new Date(tasks[i].entry_date);
            dateString = String(dateValue.getDate()) + ' '
                           + getMonthName(dateValue.getMonth()) + ' '
                           + String(dateValue.getFullYear());
            var newItem = '<div class="project_block" onclick="add_args_task(event,' + $("#project_id").val() + ',' + tasks[i].pk + ')">'
                        + '<h3 class="project_name">' + tasks[i].title + '</h3>'
                        + '<p class="project_text">' + dateString
                        + ' by <a href="#" class="project-href" onclick="add_args_author(' + tasks[i].owner_pk + ',event); return false;">' + tasks[i].owner_username + '</a>'
                        + '</p></div>';
            content.insertAdjacentHTML('beforeend', newItem);
        }
    }
};