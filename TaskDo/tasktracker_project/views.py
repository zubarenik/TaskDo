from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from .models import Project, ProjectMember
from tasktracker_task.models import Task
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from user.models import CustomUser, Invitations
from index.search_bar import check_similarity
from .forms import CreateProject, UpdateProject


def add_new_project_member(input_string, project_id):
    user_list = list()
    for current_user in CustomUser.objects.all():
        if check_similarity(input_string, current_user.username):
            is_in_project = False
            for current_member in ProjectMember.objects.filter(project_id=project_id):
                if current_member.user_id.username == current_user.username:
                    is_in_project = True
                    break
            is_invited = False
            for current_invite in Invitations.objects.filter(user=CustomUser.objects.get(username=current_user.username)):
                if current_invite.project_id is not None and current_invite.project_id.pk == project_id and not current_invite.is_read:
                    is_invited = True
            user = {'username': current_user.username, 'is_in_project': is_in_project, 'is_invited': is_invited}
            user_list.append(user)
    return user_list


def create_project(request):
    context = dict()
    if request.method == 'POST':
        form = CreateProject(request.POST)
        if form.is_valid():
            new_project = Project(owner_id=request.user,
                                  title=request.POST["title"],
                                  description=request.POST["description"])
            new_project.save()
            new_member = ProjectMember(user_id=request.user,
                                       project_id=new_project,
                                       role="Owner")
            new_member.save()
            return redirect('/projects/all')
        else:
            context['errors'] = form.errors
            return JsonResponse(context)
    else:
        return render(request, "tasktracker/create_project.html", context=context)


def show_project(request, project_id):
    context = dict()
    if request.method == 'GET':
        project = Project.objects.get(pk=project_id)
        context['tasks'] = Task.objects.filter(project_id=project_id)
        context['project_title'] = project.title
        context['project_description'] = project.description
        context['project_id'] = project_id
        context['role'] = None
        for each_project in ProjectMember.objects.filter(user_id=request.user):
            if each_project.project_id.pk == project_id:
                context['role'] = each_project.role
        context['sidebar'] = [{'name': 'Edit ' + project.title,
                               'url': '/project/edit/' + str(project_id),
                               'url_args': True},
                              {'name': 'Delete ' + project.title,
                               'url': '/project/delete/' + str(project_id) + '/',
                               'url_args': True}]
        return render(request, "tasktracker/show_project.html", context=context)
    else:
        if request.POST['type'] == 'invite':
            try:
                CustomUser.objects.get(username=request.POST['username'])
            except ObjectDoesNotExist:
                context['success'] = False
                context['errors'] = 'Not found such user'
                return JsonResponse(context)
            for current_member in ProjectMember.objects.filter(project_id=project_id):
                if current_member.user_id.username == request.POST['username']:
                    context['success'] = False
                    return JsonResponse(context)
            error_text = request.POST['text'].split('\n')
            text = ''
            for line in error_text:
                text += line + ' '
            invitation = Invitations(user=CustomUser.objects.get(username=request.POST['username']),
                                     text=text,
                                     inviter_id=request.user.pk,
                                     project_id=Project.objects.get(pk=project_id),
                                     role=request.POST['role'],
                                     is_read=False,
                                     title='Invitation to project')
            invitation.save()
            context['success'] = True
        elif request.POST['type'] == 'choose_new_member':
            context['user_list'] = add_new_project_member(request.POST['username'], project_id)
        else:
            context['tasks'] = list()
            for task in Task.objects.filter(project_id=project_id):
                current_task = dict()
                current_task['pk'] = task.pk
                current_task['title'] = task.title
                current_task['entry_date'] = task.entry_date
                current_task['owner_pk'] = task.owner_id.pk
                current_task['owner_username'] = task.owner_id.username
                context['tasks'].append(current_task)
            context['members'] = list()
            for member in ProjectMember.objects.filter(project_id=project_id):
                current_member = dict()
                current_member['pk'] = member.pk
                current_member['user_pk'] = member.user_id.pk
                current_member['user_username'] = member.user_id.username
                current_member['role'] = member.role
                context['members'].append(current_member)
        return JsonResponse(context)


def show_all_project(request):
    context = dict()
    context['projects'] = list()
    for project in ProjectMember.objects.filter(user_id=request.user):
        get_project = Project.objects.get(pk=project.project_id.pk)
        context['projects'].append(get_project)
    return render(request, "tasktracker/show_all_projects.html", context=context)


class ProjectUpdateView(UpdateView):
    model = Project
    form_class = UpdateProject
    template_name = 'tasktracker/project_edit.html'

    def get_object(self, queryset=None):
        obj = super(ProjectUpdateView, self).get_object(queryset=queryset)
        self.extra_context = {'sidebar': [{'name': obj.title,
                                           'url': '/project/' + str(obj.pk),
                                           'url_args': True},
                                          {'name': 'Delete ' + obj.title,
                                           'url': '/project/delete/' + str(obj.pk) + '/',
                                           'url_args': True}]}
        self.success_url = reverse_lazy('show_project', kwargs={'project_id': obj.pk})
        return obj


class ProjectDeleteView(DeleteView):
    model = Project
    template_name = 'tasktracker/project_delete.html'

    def get_object(self, queryset=None):
        obj = super(ProjectDeleteView, self).get_object(queryset=queryset)
        self.extra_context = {'sidebar': [{'name': obj.title,
                                           'url': '/project/' + str(obj.pk),
                                           'url_args': True},
                                          {'name': 'Edit ' + obj.title,
                                           'url': '/project/edit/' + str(obj.pk),
                                           'url_args': True}]}
        self.success_url = reverse_lazy('show_all_project')
        return obj


class ProjectMemberUpdateView(UpdateView):
    model = ProjectMember
    fields = ['role']
    template_name = 'tasktracker/project_member_edit.html'

    def get_object(self, queryset=None):
        obj = super(ProjectMemberUpdateView, self).get_object(queryset=queryset)
        self.extra_context = {'sidebar': [{'name': obj.project_id.title,
                                           'url': '/project/' + str(obj.project_id.pk),
                                           'url_args': True}],
                              'member_username': obj.user_id.username}
        self.success_url = reverse_lazy('show_project', kwargs={'project_id': obj.project_id.pk})
        return obj


class ProjectMemberDeleteView(DeleteView):
    model = ProjectMember
    template_name = 'tasktracker/project_member_delete.html'

    def get_object(self, queryset=None):
        obj = super(ProjectMemberDeleteView, self).get_object(queryset=queryset)
        self.extra_context = {'sidebar': [{'name': obj.project_id.title,
                                           'url': '/project/' + str(obj.project_id.pk),
                                           'url_args': True}],
                              'member_username': obj.user_id.username}
        self.success_url = reverse_lazy('show_project', kwargs={'project_id': obj.project_id.pk})
        return obj
