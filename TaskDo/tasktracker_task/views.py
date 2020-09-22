from django.http import JsonResponse, Http404
from django.core.exceptions import ObjectDoesNotExist
from django.views.generic import DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from index.search_bar import check_similarity
from tasktracker_project.models import Project, ProjectMember
from user.models import CustomUser
from .models import Task
from .forms import TaskCreation, UpdateTask
from datetime import datetime


def add_project_member_list(input_string, project_id):
    project_member_list = list()
    for current_member in ProjectMember.objects.filter(project_id=project_id):
        get_user = CustomUser.objects.get(pk=current_member.user_id.pk)
        if check_similarity(input_string, get_user.username):
            member = {'username': get_user.username}
            project_member_list.append(member)
    return project_member_list


def task_creation(request, project_id):
    context = dict()
    if request.method == 'POST':
        if request.POST['type'] == "task_creation":
            task_form = TaskCreation(request.POST)
            if task_form.is_valid():
                try:
                    CustomUser.objects.get(username=request.POST['assignee'])
                except ObjectDoesNotExist:
                    context['success'] = False
                    return JsonResponse(context)
                entry_date = datetime.now().strftime("%Y-%m-%d")
                new_task = Task(owner_id=request.user,
                                project_id=Project.objects.get(pk=request.POST['project_id']),
                                title=request.POST['title'],
                                description=request.POST['description'],
                                assignee=request.POST['assignee'],
                                entry_date=entry_date)
                if request.POST['close_date']:
                    new_task.close_date = request.POST['close_date']
                new_task.save()
                context['success'] = True
            else:
                context['success'] = False
                context['errors'] = task_form.errors
        else:
            context['project_member_list'] = add_project_member_list(request.POST['project_member'],
                                                                     request.POST['project_id'])
        return JsonResponse(context)
    else:
        raise Http404


class TaskDetailView(DetailView):
    model = Task
    template_name = 'tasktracker/task_detail.html'

    def get_object(self, queryset=None):
        obj = super(TaskDetailView, self).get_object(queryset=queryset)
        self.extra_context = {'sidebar': [{'name': obj.project_id.title,
                                           'url': '/project/' + str(obj.project_id.pk),
                                           'url_args': True},
                                          {'name': 'Edit ' + obj.title,
                                           'url': '/project/' + str(obj.project_id.pk) + '/task/edit/' + str(obj.pk),
                                           'url_args': True},
                                          {'name': 'Delete ' + obj.title,
                                           'url': '/project/' + str(obj.project_id.pk) + '/task/delete/' + str(obj.pk),
                                           'url_args': True}],
                              'assignee_id': CustomUser.objects.get(username=obj.assignee).pk}
        return obj


class TaskUpdateView(UpdateView):
    model = Task
    form_class = UpdateTask
    template_name = 'tasktracker/task_edit.html'

    def get_object(self, queryset=None):
        obj = super(TaskUpdateView, self).get_object(queryset=queryset)
        self.extra_context = {'sidebar': [{'name': obj.project_id.title,
                                           'url': '/project/' + str(obj.project_id.pk),
                                           'url_args': True},
                                          {'name': obj.title,
                                           'url': '/project/' + str(obj.project_id.pk) + '/task/' + str(obj.pk),
                                           'url_args': True},
                                          {'name': 'Delete ' + obj.title,
                                           'url': '/project/' + str(obj.project_id.pk) + '/task/delete/' + str(obj.pk),
                                           'url_args': True}]}
        self.success_url = reverse_lazy('show_task', kwargs={'pk': obj.pk, 'project_id': obj.project_id.pk})
        return obj


class TaskDeleteView(DeleteView):
    model = Task
    template_name = 'tasktracker/task_delete.html'

    def get_object(self, queryset=None):
        obj = super(TaskDeleteView, self).get_object(queryset=queryset)
        self.extra_context = {'sidebar': [{'name': obj.project_id.title,
                                           'url': '/project/' + str(obj.project_id.pk),
                                           'url_args': True},
                                          {'name': obj.title,
                                           'url': '/project/' + str(obj.project_id.pk) + '/task/' + str(obj.pk),
                                           'url_args': True},
                                          {'name': 'Edit ' + obj.title,
                                           'url': '/project/' + str(obj.project_id.pk) + '/task/edit/' + str(obj.pk),
                                           'url_args': True}]}
        self.success_url = reverse_lazy('show_project', kwargs={'project_id': obj.project_id.pk})
        return obj
