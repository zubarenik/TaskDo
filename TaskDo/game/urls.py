from django.urls import path
from .views import game, snake


urlpatterns = [
    path('game/', game, name='game'),
    path('game/snake', snake, name='snake'),
]

from django.urls import path
from .views import game, snake


urlpatterns = [
    path('game/', game, name='game'),
    path('game/snake', snake, name='snake'),
]

