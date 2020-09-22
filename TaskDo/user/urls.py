from django.urls import path, include
from user_auth.views import SignUpView
from user_profile.views import profile, ProfileEdit
from user_wallet.views import wallet
from user_notes.views import NoteDetailView, NoteUpdateView, NoteDeleteView
from .views import user


urlpatterns = [
    path('user/', user, name='user'),
    path('', include('django.contrib.auth.urls')),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('profile/', profile, name='profile'),
    path('profile/<int:pk>', profile, name='foreign_profile'),
    path('profile/edit/<int:pk>', ProfileEdit.as_view(), name='profile_edit'),
    path('wallet/', wallet, name='wallet'),
    path('note/<int:pk>', NoteDetailView.as_view(), name='note'),
    path('note/edit/<int:pk>', NoteUpdateView.as_view(), name='note_edit'),
    path('note/delete/<int:pk>', NoteDeleteView.as_view(), name='note_delete'),
]
