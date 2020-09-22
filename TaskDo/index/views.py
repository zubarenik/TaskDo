from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseRedirect, Http404
from django.utils.deprecation import MiddlewareMixin
from .search_bar import add_search_bar
from django.contrib import messages
from tasktracker_project.models import ProjectMember
from user.models import Invitations


class CatchAnonymous(MiddlewareMixin):

    @staticmethod
    def process_request(request):
        if request.user.is_anonymous:
            full_path = request.get_full_path()
            if request.method == 'GET' and full_path != '/signup/' and full_path != '/login/' and full_path != '/logout/' and full_path != '/':
                messages.error(request, 'You must log in to use our site!')
                return HttpResponseRedirect('/login/')
        return None


class ProjectAccess(MiddlewareMixin):

    @staticmethod
    def process_request(request):
        full_path = request.get_full_path()
        full_path_list = full_path.split('/')
        path = full_path_list[1]
        if path == 'project':
            flag = False
            flag_project_settings = False
            if full_path_list[2] == 'edit' or full_path_list[2] == 'delete':
                project_args = full_path_list[3]
                flag_project_settings = True
            else:
                project_args = full_path_list[2]
            role = None
            for each_member in ProjectMember.objects.filter(project_id=int(project_args)):
                if each_member.user_id.username == request.user.username:
                    role = each_member.role
                    flag = True
                    break
            only_invite = False
            for each_invite in Invitations.objects.filter(user=request.user):
                if not each_invite.is_read and each_invite.project_id.pk == int(project_args):
                    only_invite = True
                    break
            if not flag and not only_invite:
                raise Http404
            if flag_project_settings and (role != 'Owner' or only_invite):
                messages.error(request, 'No access!')
                return HttpResponseRedirect('/project/' + str(project_args))
            if len(full_path_list) > 5:
                if full_path_list[3] == 'task':
                    task_args = full_path_list[5]
                    if only_invite or role == 'Guest':
                        messages.error(request, 'No access!')
                        return HttpResponseRedirect('/project/' + str(project_args) + '/task/' + str(task_args))
                else:
                    get_member = ProjectMember.objects.get(pk=str(full_path_list[5]))
                    if only_invite or get_member.role == 'Owner' or (role != 'Owner' and role != 'Maintainer') or (role == 'Maintainer' and get_member.role == 'Maintainer'):
                        messages.error(request, 'No access!')
                        return HttpResponseRedirect('/project/' + str(project_args))
        return None


def index(request):
    context = dict()
    if request.method == 'POST':
        if 'type' in request.POST:
            context['user_list'] = add_search_bar(request.POST['username'])
            return JsonResponse(context)
        else:
            return render(request, "index.html", context=context)
    else:
        return redirect('/user/')
