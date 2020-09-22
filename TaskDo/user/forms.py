from django import forms


class CreateNote(forms.Form):
    title = forms.CharField(required=True, max_length=30)
    text = forms.CharField(required=True, widget=forms.Textarea)
    priority = forms.IntegerField(min_value=1, max_value=3)
