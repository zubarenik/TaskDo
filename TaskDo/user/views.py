from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from user_notes.models import Notes
from .models import CustomUser, Invitations
from tasktracker_project.models import Project, ProjectMember
from tasktracker_team.models import Team, TeamMember
from .forms import CreateNote
from django.core import serializers


def add_message_list(pk):
    message_list = list()
    for current_invite in Invitations.objects.filter(user=pk):
        if current_invite.is_read:
            continue
        invite = dict()
        invite['invite_pk'] = current_invite.pk
        inviter = CustomUser.objects.get(pk=current_invite.inviter_id)
        invite['inviter_name'] = inviter.username
        invite['inviter_pk'] = inviter.pk
        invite['role'] = current_invite.role
        if current_invite.project_id is not None:
            project = current_invite.project_id
            invite['object_title'] = project.title
            invite['object_pk'] = project.pk
            invite['is_project'] = True
        else:
            team = current_invite.team_id
            invite['object_title'] = team.name
            invite['object_pk'] = team.pk
            if current_invite.role == 'developer':
                invite['role'] = 'Philistine'
            invite['is_project'] = False
        invite['text'] = current_invite.text
        invite['title'] = current_invite.title
        message_list.append(invite)
    return message_list


def user(request):
    context = dict()
    if request.method == 'GET':
        context['notes'] = Notes.objects.filter(user_id=request.user)
        if 'type' in request.GET:
            data = serializers.serialize('json', context['notes'])
            return HttpResponse(data, content_type="application/json")
        context['my_messages'] = add_message_list(request.user.pk)
        context['sidebar'] = [{"name": 'Home', "url": 'user'},
                              {"name": 'Profile', "url": 'profile'},
                              {"name": 'Teams', "url": 'show_all_teams'}]
        return render(request, "user/user.html", context=context)
    else:
        if request.POST['type'] == 'note_create':
            form = CreateNote(request.POST)
            if form.is_valid():
                context['success'] = True
                error_text = request.POST['text'].split('\n')
                text = ''
                for line in error_text:
                    text += line + ' '
                new_note = Notes(user_id=CustomUser.objects.get(pk=request.POST['user_id']),
                                 title=request.POST['title'],
                                 text=text,
                                 priority=request.POST['priority'])
                if request.POST['date']:
                    new_note.date = request.POST['date']
                if request.POST['time']:
                    new_note.time = request.POST['time']
                new_note.save()
            else:
                context['errors'] = form.errors
                context['success'] = False
            return JsonResponse(context)
        else:
            current_invite = Invitations.objects.get(pk=request.POST['invite_pk'])
            current_invite.is_read = True
            current_invite.save()
            context['my_messages'] = add_message_list(request.user.pk)
            if request.POST['type'] == 'accept':
                if current_invite.project_id is not None:
                    new_member = ProjectMember(user_id=CustomUser.objects.get(pk=request.user.pk),
                                               project_id=Project.objects.get(pk=current_invite.project_id.pk),
                                               role=current_invite.role)
                    new_member.save()
                else:
                    new_member = TeamMember(member=CustomUser.objects.get(pk=request.user.pk),
                                            team=Team.objects.get(pk=current_invite.team_id.pk),
                                            role=current_invite.role)
                    new_member.save()
            return JsonResponse(context)
