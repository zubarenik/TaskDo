from django.views.generic import DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import Notes


sidebar = {'sidebar': [{"name": 'Home', "url": 'user'},
                       {"name": 'Profile', "url": 'profile'},
                       {"name": 'Teams', "url": 'show_all_teams'}]}


class NoteDetailView(DetailView):
    model = Notes
    extra_context = sidebar
    template_name = 'user/note_detail.html'


class NoteUpdateView(UpdateView):
    model = Notes
    fields = ['title', 'text', 'priority', 'date']
    extra_context = sidebar
    template_name = 'user/note_edit.html'

    def get_object(self, queryset=None):
        obj = super(NoteUpdateView, self).get_object(queryset=queryset)
        self.success_url = reverse_lazy('note', kwargs={'pk': obj.pk})
        return obj


class NoteDeleteView(DeleteView):
    model = Notes
    extra_context = sidebar
    success_url = reverse_lazy('user')
    template_name = 'user/note_delete.html'
