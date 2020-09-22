from django import forms
from .models import Task


class TaskCreation(forms.Form):
    title = forms.CharField(required=True, max_length=40)
    description = forms.CharField(required=True, widget=forms.Textarea)


class UpdateTask(forms.ModelForm):
    title = forms.CharField(required=True, max_length=40)
    description = forms.CharField(required=True, widget=forms.Textarea)

    class Meta:
        model = Task
        fields = ('title', 'description')
