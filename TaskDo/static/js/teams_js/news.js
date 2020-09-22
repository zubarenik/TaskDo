$(document).ready(function(){
     var url = window.location.pathname;

     var btn_panel = $("<div/>", {class: 'block justify-content-center'});
     var btn = $("<button/>", {class: 'btn btn-outline-light button-outline project-btn', style: 'display: block; margin: 10px auto;', text: "Create News"});
     btn.attr('data-toggle', 'modal');
     btn.attr('data-target', '#create_news');
     btn_panel.append(btn);
     get_news();

    $("#news").on("click", function() {
        get_news();
    });

    $("#team_projects").on("click", function() {
       get_projects();
    });

    $("#members").on("click", function() {
        get_members();
    });

    $("#create_project_send").on("click", function() {
        $('#create_project').modal('hide');
        create_project();
    });


    function get_news() {

        var data = {
            team_id: url.split('/')[2]
        };

        $.ajax({
        type: 'POST',
        url:  '/teams/news/get',
        data: data,
        success: function(data){
            $('#team_content').html('');
            btn_panel.appendTo("#team_content");
            news_content = $("<div/>", {id: "news_content", style: "display: block"});
            news_content.appendTo("#team_content");
            data.forEach(function(news, i, data) {
                news_block = $("<div/>")
                news_block.addClass('news_block')
                news_head = $('<div/>')
                news_head.addClass('news_head')
                news_head.append('<h3 class="news_title">' + news['title'] + '</h3>')
                news_head.append('<a class="news_author" href="/profile/' + news['author']['id'] + '">' + news['author']['name'] + '</a>')
                news_block.append(news_head)
                news_block.append('<div class="news_desc">' + news['description'] + '</div>')
                news_block.append('<p class="news_date">' + news['date'] + '</p>')
                news_block.appendTo("#news_content");
            });
        }
        });
    }

    function get_members() {

        var data = {
            type: "get",
            team_id: url.split('/')[2]
        };

        $.ajax({
        type: 'POST',
        url:  '/teams/members',
        data: data,
        success: function(data){
            $('#team_content').html('');
            var btn_panel_p = $("<div/>", {class: 'block justify-content-center'});
            var btn_p = $("<button/>", {class: 'btn btn-outline-light button-outline project-btn', style: 'display: block; margin: 10px auto;', text: "Invite"});
            btn_p.attr('data-toggle', 'modal');
            btn_p.attr('data-target', '#team_invite');
            btn_panel_p.append(btn_p);
            btn_panel_p.appendTo("#team_content");
            data.forEach(function(member, i, data) {
                members_block = $("<div/>")
                members_block.addClass('news_block')
                members_info = $('<div/>')
                members_info.addClass('news_head')
                guest = (member['member'].role == 'guest') ? 'selected' : '';
                developer = (member['member'].role == 'developer') ? 'selected' : '';
                maintainer = (member['member'].role == 'maintainer') ? 'selected' : '';
                members_info.append(`
                    <div class="member">
                        <a class="name" href="/profile/${member['member']['id']}"> ${member['member']['name']} </a>
                        <select class="member_role custom-select" member_id="${member['member']['id']}">
                            <option value="guest" ${guest} >Guest</option>
                            <option value="developer" ${developer}>Philistine</option>
                            <option value="maintainer" ${maintainer}>Maintainer</option>
                        </select>
                        <a class="exit">&#10006</a>
                    </div>
                `);
                members_block.append(members_info);
                members_block.appendTo("#team_content");
                $("select").on("change", function() {
                    member_id = $(this).attr('member_id');
                    new_role = $(this).val();
                    change_role(member_id, new_role);
                });
            });
        }
        });
    }

    function get_projects() {

        var data = {
            type: "show",
            team_id: url.split('/')[2]
        };

        $.ajax({
        type: 'POST',
        url:  '/teams/projects',
        data: data,
        success: function(data){
            $('#team_content').html('');
            var btn_panel_p = $("<div/>", {class: 'block justify-content-center'});
            var btn_p = $("<button/>", {class: 'btn btn-outline-light button-outline project-btn', style: 'display: block; margin: 10px auto;', text: "Create Project"});
            btn_p.attr('data-toggle', 'modal');
            btn_p.attr('data-target', '#create_project');
            btn_panel_p.append(btn_p);
            btn_panel_p.appendTo("#team_content");
            data.forEach(function(project, i, data) {
                project_block = $("<div/>", {class: 'project_block', onclick: 'add_args_project(' + project["project"]["id"] + ')'});
                project_title = $("<h3/>", {class: 'project_name', text: project["project"]["title"]});
                project_block.append(project_title)
                project_text = $("<p/>", {class: 'project_text', text: project["project"]["desc"]});
                project_block.append(project_text)
                project_block.appendTo("#team_content");
            });
        }
        });
    }

    function create_project() {

        var data = {
            type: "create",
            team_id: url.split('/')[2],
            project_title:  $("#project_title").val(),
            project_desc:  $("#project_description").val(),
        };

        $.ajax({
        type: 'POST',
        url:  '/teams/projects',
        data: data,
        success: function(){
            get_projects();
        }
        });
    }

     function change_role(member_id, new_role) {

        var data = {
            type: "change",
            team_id: url.split('/')[2],
            member_id: member_id,
            new_role: new_role,
        };

        $.ajax({
        type: 'POST',
        url:  '/teams/members',
        data: data,
        success: function(){
            get_members();
        }
        });
    }

});

function add_args_project(pk){
    let url = '/project/' + pk;
    window.location = url;
};