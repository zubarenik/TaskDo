$.get(
    window.location,
    function(){
        var login_messages = document.getElementById('login_messages');
        login_messages.style.opacity = '1';
        setTimeout(function(){
            login_messages.style.opacity = '0';
            setTimeout(function(){
                login_messages.style.display = 'none';
            }, 800);
        }, 4500);
    }
);