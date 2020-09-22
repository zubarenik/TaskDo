from django.urls import path
from .views import task_creation, TaskDetailView, TaskUpdateView, TaskDeleteView

urlpatterns = [
    path('create/task', task_creation, name='create_task'),
    path('task/delete/<int:pk>', TaskDeleteView.as_view(), name='delete_task'),
    path('task/edit/<int:pk>', TaskUpdateView.as_view(), name='edit_task'),
    path('task/<int:pk>', TaskDetailView.as_view(), name='show_task'),
]