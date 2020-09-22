import unittest
from django.test import TestCase, Client
from django.urls import reverse
from user.models import CustomUser


class GameTest(TestCase):
    fixtures = ['db.json', ]

    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.get(username='test')

    def test_game_response_not_logged(self):
        response = self.client.get(reverse('game'))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('login'))

    def test_game_response_logged(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('game'))
        self.assertEqual(response.status_code, 200)

    @unittest.skip
    def test_game_template(self):
        response = self.client.get(reverse('game'))
        print(response.templates)
        print(response.status_code)
        self.assertTemplateUsed(response, 'game.html')
