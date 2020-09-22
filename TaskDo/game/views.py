from django.shortcuts import render


def game(request):
    return render(request, "game/game.html")


def snake(request):
    return render(request, "game/snake.html")

