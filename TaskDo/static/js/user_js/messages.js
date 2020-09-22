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

function add_inviter(pk){
    let url = '/profile/' + pk;
    window.location = url;
};

function add_project(pk){
    let url = '/project/' + pk;
    window.location = url;
};

function add_team(pk){
    let url = '/team/' + pk;
    window.location = url;
};

function appear_messages(){
    window_message = document.getElementById('message_nav');
    window_message.style.right = '0';
};

function hide_messages(){
    window_message = document.getElementById('message_nav');
    window_message.style.right = '-320px';
};

$(document).mousemove(function(event){
    if ($("#message_nav").attr('onmouseleave') === ''){
        return;
    }
    var target = event.target;
    while (target.tagName != 'HTML'){
        if (target.id == 'message_nav_toggle' || target.id == 'message_nav'){
            return;
        }
        target = target.parentNode;
    }
    hide_messages();
});

$(document).ready(function(){
    $('#clip').tooltip({
        title: 'Lock',
        delay: { show: 200, hide: 0 },
        container: "#clip_tooltip",
    });
});

function fasten_messages(){
    clip = document.getElementById('clip');
    if ($("#message_nav").attr('onmouseleave') === ''){
        clip.style.color = "#5E2EC5";
        $('#clip').attr('data-original-title', 'Lock');
        $("#message_nav").attr('onmouseleave', 'hide_messages()');
    }
    else{
        clip.style.color = "#431F8D";
        $('#clip').attr('data-original-title', 'Unlock');
        $("#message_nav").attr('onmouseleave', '');
    }
};

function add_element(parent, tag, html){
    newElement = document.createElement(tag);
    for (var i = 0; i < arguments.length; i++) {
        newElement.setAttribute(arguments[i].name, arguments[i].text);
    }
    newElement.innerHTML = html;
    parent.appendChild(newElement);
}

var save_message_list;

function return_messages(){
    message_body = document.getElementById('message_body');
    message_body.style.opacity = '0';
    external_arguments = arguments;
    setTimeout( function() {
        message_body.parentNode.removeChild(message_body);
        window_message = document.getElementById('message_nav');
        attribute = {'name': 'id', 'text': 'message_body'};
        add_element(window_message, 'DIV', '', attribute);
        message_body = document.getElementById('message_body');
        save_message_list.style.opacity = '0';
        if (external_arguments.length === 2 && external_arguments[1]){
            var messages = external_arguments[0];
            save_message_list.innerHTML = '';
            for (var i = 0; i < messages.length; i++){
                var new_item = '<div class="message-block" onclick="open_message(event,'
                         + "'" + messages[i].role + "','" + messages[i].text + "'," + messages[i].invite_pk + ')">'
                         + '<h3 class="message-name">' + messages[i].title + '</h3>'
                         +  '<p class="message-text">Inviter: <a href="#" class="check-url"'
                         +  'onclick="add_inviter(' + messages[i].inviter_pk + '); return false;">'
                         +  messages[i].inviter_name + '</a></p>'
                         +  '<p class="message-text">';
                if (messages[i].title == 'Invitation to project'){
                    new_item += 'Project:';
                }
                else{
                    new_item += 'Team:';
                }
                new_item += '<a href="#" class="check-url"'
                         +  'onclick="add_project(' + messages[i].object_pk + '); return false;">'
                         +  messages[i].project_title + '</a></p>'
                         +  '</div>';
                save_message_list.insertAdjacentHTML('beforeend', new_item);
            }
            $("#icon_text").text(messages.length);
            document.getElementById('icon_messages').style.display = 'block';
        }
        else if (external_arguments.length === 1 && !external_arguments[0]){
            document.getElementById('icon_messages').style.display = 'none';
            save_message_list.innerHTML = '<p class="no-new-message">No new messages</p>';
        }
        message_body.appendChild(save_message_list);
        setTimeout("save_message_list.style.opacity = '1'", 100);
    }, 600);
}

function open_message(event, role, text, invite_pk){
    if ($('.check-url').is(event.target)){
        return;
    }
    message_list = document.getElementById('messages_list');
    message_body = document.getElementById('message_body');
    save_message_list = message_list;
    message_body.style.opacity = '0';
    setTimeout( function() {
        message_list.parentNode.removeChild(message_list);
        attribute = {'name': 'class', 'text': 'message-text'};
        add_element(message_body, 'P', 'Your role in project: <nobr class="yellow-color">' + role + '</nobr>', attribute);
        add_element(message_body, 'P', 'Message: <p class="message-text yellow-color long-text">' + text + '</p>', attribute);
        attribute = {'name': 'class', 'text': 'd-flex justify-content-center message-footer'};
        another_attribute = {'name': 'id', 'text': 'buttons_bottom'};
        add_element(message_body, 'DIV', '', attribute, another_attribute);
        buttons_bottom = document.getElementById('buttons_bottom');
        attribute = {'name': 'class', 'text': 'btn btn-outline-light button-outline'};
        another_attribute = {'name': 'type', 'text': 'button'};
        another_attribute1 = {'name': 'onclick', 'text': 'return_messages()'};
        another_attribute2 = {'name': 'style', 'text': 'margin-right: 3px'}
        add_element(buttons_bottom, 'BUTTON', 'Return', attribute, another_attribute, another_attribute1, another_attribute2);
        attribute = {'name': 'class', 'text': 'btn btn-outline-light button-outline message-button'};
        another_attribute1 = {'name': 'onclick', 'text': 'processing_invite(false,' + invite_pk + ')'};
        add_element(buttons_bottom, 'BUTTON', 'Reject', attribute, another_attribute, another_attribute1);
        attribute = {'name': 'class', 'text': 'btn btn-outline-light button-outline message-button-right'};
        another_attribute1 = {'name': 'onclick', 'text': 'processing_invite(true,' + invite_pk + ')'};
        add_element(buttons_bottom, 'BUTTON', 'Accept', attribute, another_attribute, another_attribute1);
        setTimeout("message_body.style.opacity = '1'", 20);
    }, 600);
};

function processing_invite(flag, pk){
    var csrftoken = getCookie('csrftoken');
    var form = {
        csrfmiddlewaretoken: csrftoken,
        invite_pk: pk,
    };
    if (flag){
        form.type = 'accept';
    }
    else{
        form.type = 'reject';
    }
    $.ajax({
        type: 'POST',
        url:  '/user/',
        data: form,
        success: function(data){
            if (data.my_messages.length > 0){
                return_messages(data.my_messages, true);
            }
            else{
                return_messages(false);
            }
        }
    });
};