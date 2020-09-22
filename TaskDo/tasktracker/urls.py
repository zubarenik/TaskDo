from django.urls import path, include
from tasktracker_project.views import create_project, show_project, show_all_project, ProjectUpdateView
from tasktracker_project.views import ProjectDeleteView, ProjectMemberUpdateView, ProjectMemberDeleteView
from tasktracker_team.views import show_all_teams, create_team, show_team, team_news_get, team_news_add, team_members, team_projects


urlpatterns = [
    path('projects/all', show_all_project, name='show_all_project'),
    path('create/project', create_project, name='create_project'),
    path('project/<int:project_id>', show_project, name='show_project'),
    path('project/<int:project_id>/member/edit/<int:pk>', ProjectMemberUpdateView.as_view(), name='edit_project_member'),
    path('project/<int:project_id>/member/delete/<int:pk>', ProjectMemberDeleteView.as_view(), name='delete_project_member'),
    path('project/<int:project_id>/', include('tasktracker_task.urls')),
    path('project/delete/<int:pk>/', ProjectDeleteView.as_view(), name='delete_project'),
    path('project/edit/<int:pk>', ProjectUpdateView.as_view(), name='edit_project'),
    path('teams/all', show_all_teams, name='show_all_teams'),
    path('create/team', create_team, name='create_team'),
    path('team/<team_id>', show_team, name='show_team'),
    path('teams/news/get', team_news_get, name='team_news_get'),
    path('teams/news/add', team_news_add, name='team_news_add'),
    path('teams/members', team_members, name='team_members'),
    path('teams/projects', team_projects, name='team_projects'),
]
