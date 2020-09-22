import unittest
from django.test import TestCase, Client
from django.urls import reverse
from user.models import CustomUser
import json


class ProfileTest(TestCase):
    fixtures = ['db.json', ]

    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.get(username='test')

    def test_project_response_unlogged(self):
        response = self.client.get(reverse('show_all_project'))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('login'))

    def test_project_response_logged(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('show_all_project'))
        self.assertEqual(response.status_code, 200)

    def test_create_project_response_logged(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('create_project'))
        self.assertEqual(response.status_code, 200)

    def test_create_project(self):
        self.client.force_login(user=self.user)
        data = {
            'title': 'lol_3',
            'description': 'some text'
        }
        response = self.client.post(reverse('create_project'), data=data)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('show_all_project'))
