$.get(
    window.location,
    function(){
        var gender_field = document.getElementById('gender_field');
        var genders = gender_field.getElementsByTagName('input');
        if ($("#gender").val() == 'False'){
            genders[0].setAttribute('checked', 'checked');
        }
        else if ($("#gender").val() == 'True'){
            genders[1].setAttribute('checked', 'checked');
        }
        var avatar_parent = document.getElementById('avatar');
        var avatar_clear = document.getElementById('avatar-clear_id');
        var avatar_field = document.getElementById('id_avatar');
        if (jQuery.contains(avatar_parent, avatar_clear)){
            var avatar_href = avatar_parent.getElementsByTagName('a')[0];
            avatar_parent.innerHTML = '';
            avatar_parent.insertAdjacentHTML('beforeend', '<p id="current_avatar">Currently:</p>');
            var current_avatar =  document.getElementById('current_avatar');
            current_avatar.appendChild(avatar_href);
            avatar_href.setAttribute('class', 'avatar');
            avatar_parent.insertAdjacentHTML('beforeend', '<p><small class="avatar" id="clear_avatar">Clear </small></p>');
            var clear_avatar = document.getElementById('clear_avatar');
            clear_avatar.appendChild(avatar_clear);
            avatar_parent.insertAdjacentHTML('beforeend', '<p id="change_avatar">Change:</p>');
            var change_avatar = document.getElementById('change_avatar');
            change_avatar.appendChild(avatar_field);
        }
        else{
            var avatar_label = document.getElementById('avatar_label');
            avatar_label.appendChild(avatar_field);
        }
    }
);

function gender_clear(){
    $("#female").prop('checked', false);
    $("#male").prop('checked', false);
};