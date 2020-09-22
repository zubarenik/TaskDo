from django.urls import reverse_lazy
from django.views.generic import CreateView
from .forms import CustomUserCreationForm
from django.contrib.auth.password_validation import password_validators_help_texts


class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    extra_context = {'password1_help': password_validators_help_texts()}
    success_url = reverse_lazy('login')
    template_name = 'registration/signup.html'
