from django import forms
from tasktracker_project.models import Project, ProjectMember


class CreateProject(forms.Form):
    title = forms.CharField(required=True, max_length=40)
    description = forms.CharField(required=True, widget=forms.Textarea)


class UpdateProject(forms.ModelForm):
    title = forms.CharField(required=True, max_length=40)
    description = forms.CharField(required=True, widget=forms.Textarea)

    class Meta:
        model = Project
        fields = ('title', 'description')


class UpdateProjectMember(forms.ModelForm):
    role = forms.CharField(required=True, max_length=256)

    class Meta:
        model = ProjectMember
        fields = ('role',)
