from django.shortcuts import render, redirect
from .models import Team, TeamMember, TeamNews
from tasktracker_project.models import ProjectTeamMembership, Project, ProjectMember
from user.models import CustomUser
import datetime
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from user.models import Invitations
from index.search_bar import check_similarity


def add_new_team_member(input_string, team_id):
    user_list = list()
    for current_user in CustomUser.objects.all():
        if check_similarity(input_string, current_user.username):
            is_in_team = False
            for current_member in TeamMember.objects.filter(team=Team.objects.get(pk=team_id)):
                if current_member.member.username == current_user.username:
                    is_in_team = True
                    break
            is_invited = False
            for current_invite in Invitations.objects.filter(user=CustomUser.objects.get(username=current_user.username)):
                if current_invite.team_id is not None and current_invite.team_id.pk == team_id and not current_invite.is_read:
                    is_invited = True
            user = {'username': current_user.username, 'is_in_team': is_in_team, 'is_invited': is_invited}
            user_list.append(user)
    return user_list


def show_all_teams(request):
    memberships = TeamMember.objects.filter(member_id=request.user)
    teams = list()
    for membership in memberships:
        teams.append(membership.team)
    users = CustomUser.objects.exclude(pk=request.user.pk)
    context = {"teams": teams, "users": users}
    return render(request, "tasktracker/show_all_teams.html", context=context)


def create_team(request):
    if request.method == 'POST':
        if not request.user.is_anonymous:
            new_team = Team(name=request.POST["teamname"],
                            description=request.POST["teamdes"]
                            )
            new_team.save()
            user = CustomUser.objects.get(pk=request.POST["teamleader"])
            team_member = TeamMember(member=user,
                                     team=new_team,
                                     role="maintainer"
                                     )
            team_member.save()
    return redirect('/teams/all')


def show_team(request, team_id):
    if request.method == 'GET':
        team_name = Team.objects.get(pk=team_id).name
        context = {"team_name": team_name, "team_id": team_id}
        return render(request, "tasktracker/show_team.html", context=context)
    else:
        context = dict()
        if request.POST['type'] == 'invite':
            try:
                CustomUser.objects.get(username=request.POST['username'])
            except ObjectDoesNotExist:
                context['success'] = False
                context['errors'] = 'Not found such user'
                return JsonResponse(context)
            for current_member in TeamMember.objects.filter(team=Team.objects.get(pk=team_id)):
                if current_member.member.username == request.POST['username']:
                    context['success'] = False
                    return JsonResponse(context)
            error_text = request.POST['text'].split('\n')
            text = ''
            for line in error_text:
                text += line + ' '
            invitation = Invitations(user=CustomUser.objects.get(username=request.POST['username']),
                                     text=text,
                                     inviter_id=request.user.pk,
                                     team_id=Team.objects.get(pk=team_id),
                                     role=request.POST['role'],
                                     is_read=False,
                                     title='Invitation to team')
            invitation.save()
            context['success'] = True
        else:
            context['user_list'] = add_new_team_member(request.POST['username'], team_id)
        return JsonResponse(context)


def team_news_get(request):
    if request.method == 'POST':
        team = Team.objects.get(pk=request.POST['team_id'])
        news = TeamNews.objects.filter(team=team)
        data = list()
        for new in news:
            new_list = dict()
            author = CustomUser.objects.get(pk=TeamMember.objects.get(pk=new.author_id).member_id)
            new_list["author"] = {'name': author.username, 'id': author.pk}
            new_list["title"] = new.title
            new_list["description"] = new.description
            new_list["date"] = new.creation_data.strftime("%Y-%m-%d %H:%M:%S")
            data.append(new_list)
        return JsonResponse(data, safe=False)


def team_news_add(request):
    if request.method == 'POST':
        team = Team.objects.get(pk=request.POST['team_id'])
        teammember = TeamMember.objects.get(member=request.user,
                                            team=team)
        news = TeamNews(team=team,
                        author=teammember,
                        title=request.POST["news_title"],
                        description=request.POST["news_description"],
                        creation_data=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        )
        news.save()
        return redirect('/team/' + request.POST['team_id'])


def team_members(request):
    if request.method == 'POST':
        if request.POST['type'] == "get":
            team = Team.objects.get(pk=request.POST['team_id'])
            members = TeamMember.objects.filter(team=team)
            data = list()
            for member in members:
                member_list = dict()
                role = member.role
                member = CustomUser.objects.get(pk=member.member_id)
                member_list["member"] = {'name': member.username,
                                         'id': member.pk,
                                         'role': role}
                data.append(member_list)
            return JsonResponse(data, safe=False)
        if request.POST['type'] == "change":
            teammember = TeamMember.objects.get(member=CustomUser.objects.get(pk=request.POST['member_id']),
                                                team=Team.objects.get(pk=request.POST['team_id']))
            teammember.role = request.POST['new_role']
            teammember.save()
            return JsonResponse(None, safe=False)


def team_projects(request):
    if request.method == "POST":

        if request.POST['type'] == "show":
            projects_flags = ProjectTeamMembership.objects.filter(team_id=Team.objects.get(pk=request.POST['team_id']))
            data = list()
            for project_flag in projects_flags:
                project_list = dict()
                project = Project.objects.get(pk=project_flag.project_flag.pk)
                project_list["project"] = {'id': project.pk, 'title': project.title, 'desc': project.description}
                data.append(project_list)
            return JsonResponse(data, safe=False)

        if request.POST['type'] == "create":
            new_project = Project(owner_id=request.user,
                                  title=request.POST["project_title"],
                                  description=request.POST["project_desc"])
            new_project.save()

            teammates = TeamMember.objects.filter(team=Team.objects.get(pk=request.POST['team_id'])).exclude(member=request.user)

            for teammate in teammates:
                new_member = ProjectMember(user_id=teammate.member,
                                           project_id=new_project,
                                           role="Guest")
                new_member.save()

            owner_member = ProjectMember(user_id=request.user,
                                         project_id=new_project,
                                         role="Owner")
            owner_member.save()

            new_project_team_flag = ProjectTeamMembership(team_id=Team.objects.get(pk=request.POST['team_id']),
                                                          project_flag=new_project)
            new_project_team_flag.save()

            return JsonResponse(None, safe=False)
