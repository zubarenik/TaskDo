$(document).ready(function(){

      $('#create_project').bind('click', function() {
        var form = {
            type: "project_creation",
            title: $("#project_title").val(),
            description: $("#project_description").val(),
        };
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: form,
            success: function(data){
                if (typeof data.errors === 'undefined'){
                    let url = '/projects/all';
                    window.location = url;
                }
                else{
                    if (typeof data.errors['title'] !== 'undefined'){
                        $('#project_title').removeClass('is-valid');
                        $('#project_title').addClass('is-invalid');
                        $('#project_title_errors').removeClass('valid-feedback');
                        $('#project_title_errors').addClass('invalid-feedback');
                        $("#project_title_errors").text(data.errors['title']);
                    }
                    else{
                        $('#project_title_errors').removeClass('invalid-feedback');
                        $("#project_title_errors").text('');
                        $('#project_title_errors').removeClass('is-invalid');
                    }
                    if (typeof data.errors['description'] !== 'undefined'){
                        $('#project_description').removeClass('is-valid');
                        $('#project_description').addClass('is-invalid');
                        $('#project_description_errors').removeClass('valid-feedback');
                        $('#project_description_errors').addClass('invalid-feedback');
                        $("#project_description_errors").text(data.errors['description']);
                    }
                    else{
                        $('#project_description_errors').removeClass('invalid-feedback');
                        $("#project_description_errors").text('');
                        $('#project_description').removeClass('is-invalid');
                    }
                }
            }
        });
    });

});