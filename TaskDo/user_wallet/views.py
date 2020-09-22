from django.shortcuts import render


def wallet(request):
    context = dict()
    context["sidebar"] = [{"name": 'Home', "url": 'user'},
                          {"name": 'Profile', "url": 'profile'},
                          {"name": 'Teams', "url": 'show_all_teams'},
                          {"name": 'Wallet', "url": 'wallet'}]
    return render(request, 'user/wallet.html', context=context)
