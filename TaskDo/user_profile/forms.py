from django.contrib.auth.forms import UserChangeForm
from user.models import CustomUser


class ProfileEditForm(UserChangeForm):

    def __init__(self, *args, **kwargs):
        super(ProfileEditForm, self).__init__(*args, **kwargs)
        self.fields['first_name'].required = True
        self.fields['email'].required = True

    class Meta:
        model = CustomUser
        fields = ('first_name', 'email', 'age', 'gender', 'description', 'avatar')


class UsernameEditForm(UserChangeForm):

    def __init__(self, *args, **kwargs):
        super(UsernameEditForm, self).__init__(*args, **kwargs)
        del self.fields['password']

    class Meta:
        model = CustomUser
        fields = ('username',)
