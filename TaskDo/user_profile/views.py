from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect, Http404
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import get_default_password_validators, password_validators_help_texts
from django.contrib.auth import login
from django.urls import reverse_lazy
from django.views.generic import UpdateView
from user.models import CustomUser
from .forms import ProfileEditForm, UsernameEditForm


def custom_validate_password(password):
    errors = []
    password_validators = get_default_password_validators()
    for validator in password_validators:
        try:
            validator.validate(password)
        except ValidationError as error:
            errors.append(error.messages)
    if errors:
        return errors


def current_user_profile(request):
    context = dict()
    if request.method == 'GET':
        context['data'] = {'first_name': None, 'email': None, 'age': None,
                           'gender': None, 'description': None, 'projects_amount': None}
        context['data']['username'] = request.user.username
        context['data']['first_name'] = request.user.first_name
        context['data']['email'] = request.user.email
        context['data']['age'] = request.user.age
        context['data']['avatar'] = request.user.avatar
        if request.user.gender:
            context['data']['gender'] = "Male"
        elif request.user.gender is not None:
            context['data']['gender'] = "Female"
        context['data']['description'] = request.user.description
        context['data']['projects_amount'] = request.user.projects_amount
        context['sidebar'] = [{"name": 'Home', "url": 'user'},
                              {"name": 'Profile', "url": 'profile'},
                              {"name": 'Teams', "url": 'show_all_teams'}]
        context['pk'] = request.user.pk
        context['password_help'] = password_validators_help_texts()
        context['foreign'] = False
        return render(request, 'user/profile.html', context=context)
    else:
        if request.POST['type'] == 'password':
            context['error_cur'] = False
            if request.user.check_password(request.POST['old_password']):
                context['error_cur'] = True
                context['error_new'] = False
                if request.POST['new_password'] == request.POST['confirm']:
                    error_text = custom_validate_password(request.POST['new_password'])
                    if error_text:
                        context['error_text'] = error_text
                    else:
                        current_user = CustomUser.objects.get_by_natural_key(request.user)
                        current_user.set_password(request.POST['new_password'])
                        current_user.save()
                        login(request, current_user)
                        context['error_new'] = True
                else:
                    context['error_text'] = ["Passwords do not match"]
            else:
                context['error_text'] = "Incorrect password"
        else:
            username_form = UsernameEditForm(request.POST, instance=request.user)
            if username_form.is_valid():
                username_form.save()
                context['success'] = True
            else:
                context['success'] = False
                context['error_text'] = username_form.errors['username']
        return JsonResponse(context)


def another_user_profile(request, pk):
    context = dict()
    user = CustomUser.objects.get(pk=pk)
    if request.method == 'GET':
        context['data'] = {'first_name': None, 'email': None, 'age': None,
                           'gender': None, 'description': None, 'projects_amount': None}
        context['data']['username'] = user.username
        context['data']['first_name'] = user.first_name
        context['data']['email'] = user.email
        context['data']['age'] = user.age
        context['data']['avatar'] = user.avatar
        if user.gender:
            context['data']['gender'] = "Male"
        elif user.gender is not None:
            context['data']['gender'] = "Female"
        context['data']['description'] = user.description
        context['data']['projects_amount'] = user.projects_amount
        context['pk'] = pk
        context['foreign'] = True
        return render(request, 'user/profile.html', context=context)
    else:
        raise Http404


def profile(request, **pk):
    if pk == {}:
        return current_user_profile(request)
    elif pk['pk'] == request.user.pk:
        return HttpResponseRedirect('/profile/')
    return another_user_profile(request, pk['pk'])


class ProfileEdit(UpdateView):
    form_class = ProfileEditForm
    model = CustomUser
    extra_context = {'sidebar': [{"name": 'Home', "url": 'user'},
                                 {"name": 'Profile', "url": 'profile'},
                                 {"name": 'Teams', "url": 'show_all_teams'}]}
    success_url = reverse_lazy('profile')
    template_name = 'user/profile_edit.html'
