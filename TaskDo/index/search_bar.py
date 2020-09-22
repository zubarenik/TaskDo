from user.models import CustomUser



def check_similarity(input_string, data_string):
    if len(input_string) > len(data_string) or len(input_string) == 0:
        return False
    iterator = 0
    for ch in input_string:
        if ch != data_string[iterator]:
            return False
        else:
            iterator += 1
    return True


def add_search_bar(input_string):
    user_list = list()
    for current_user in CustomUser.objects.all():
        if check_similarity(input_string, current_user.username):
            user = {'username': current_user.username, 'pk': current_user.pk}
            user_list.append(user)
    return user_list
