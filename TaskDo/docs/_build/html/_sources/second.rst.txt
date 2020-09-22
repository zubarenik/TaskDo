Документация разработчика
========================================



***********
View-функции for game.
***********

def game - вывод шаблона игр.

def snake - вывод шаблона змейки.

def bird - вывод шаблона птички.

***********
Search_bar.py.
***********

def check_similarity - проверяет идентичность данных.

def add_search_bar - поисковая строка.

***********
static.
***********

Содержит в себе все использумые стили.

JS, JS for games, css, картинки.


***********
tasktracker.
***********

Тасктрекер.

class TasktrackerConfig(AppConfig) - класс Тасктрекер. Основное приложение.


***********
tasktracker_chat.
***********

Чат.

class TasktrackerChatConfig(AppConfig) - класс чата Тасктрекера. Приложение.


***********
tasktracker_project.
***********

Проекты.

class TasktrackerProjectConfig(AppConfig) - класс проектов в тасктрекере. Приложение.

class ProjectTag(models.Model) - модель для тэга.

class Project(models.Model) - модель для проекта.

class ProjectMember(models.Model) - модель для участника.


***********
tasktracker_task.
***********

Таски.

class TasktrackerTaskConfig(AppConfig) - класс тасков (задач) в тасктрекере. Приложение.

class Task(models.Model) - модель для таска (задачи).


***********
tasktracker_team.
***********

Команда.

class TasktrackerTeamConfig(AppConfig) - класс команды в тасктрекере. Приложение.

class Team(models.Model) - модель команды.

class TeamMember(models.Model) - модель участника команды.


***********
templates.
***********

Шаблоны.

HTML5. Шаблоны для тасктрекера, игр, регистрации, пользователя.

index.html & base.html - основные шаблоны.


***********
user.
***********

Пользователь.

class UserConfig(AppConfig) - класс пользователя в тасктрекере. Приложение.

class CustomUser(AbstractUser) - модель пользователя.

class Invitations(models.Model) - модель приглашения пользователя в команды.


***********
user_auth.
***********

Пользователь. Авторизация.

class UserAuthConfig(AppConfig) - класс авторизации пользователя. Приложение.

class SignUpView(CreateView) - шаблон для авторизации пользователя.


***********
user_notes.
***********

Заметки пользователя.

class UserNotesConfig(AppConfig) - класс заметок пользователя в тасктрекере. Приложение.

class Notes(models.Model) - модель для заметок пользователя.

class NoteDetailView(DetailView) - шаблон (создания) заметок.

class NoteUpdateView(UpdateView) - шаблон обновленных (исправленных) заметок.

class NoteDeleteView(DeleteView) - шаблон удаления заметок.


***********
user_profile.
***********

class ProfileEditForm(UserChangeForm) - форма изменеия в профиле.

def custom_validate_password(password) - функция валидности пароля.

def current_user_profile(request) - функция текущего профиля пользователя.

def add_project_list(input_project_id) - функция (добавления) создания проекта.

def another_user_profile(request, pk)  - функция иного/другого профиля пользователя.

class ProfileEdit(UpdateView) - шаблон изменений в профиле.


