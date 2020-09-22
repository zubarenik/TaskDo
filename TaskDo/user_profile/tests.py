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

    def test_profile_response_unlogged(self):
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('login'))

    def test_profile_response_logged(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 200)

    def test_edit_response(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('profile_edit', args=[self.user.pk]))
        self.assertEqual(response.status_code, 200)

    def test_check_redirects_if_cur_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('foreign_profile', args=[self.user.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('profile'))

    def test_change_password_wrong_passw(self):
        self.client.force_login(user=self.user)
        data = {
            'old_password': '12',
            'type': 'password',
        }
        response = self.client.post(reverse('profile'), data=data)
        msg = json.loads(response.content)
        self.assertEqual(msg['error_text'], 'Incorrect password')
        self.assertFalse(msg['error_cur'])

    def test_change_password_not_match(self):
        self.client.force_login(user=self.user)
        data = {
            'old_password': 'test',
            'new_password': 'keke',
            'type': 'password',
            'confirm': 'kekeke',
        }
        response = self.client.post(reverse('profile'), data=data)
        msg = json.loads(response.content)
        self.assertEqual(msg['error_text'][0], 'Passwords do not match')
        self.assertTrue(msg['error_cur'])
        self.assertFalse(msg['error_new'])

    def test_change_password_bad_paswd(self):
        self.client.force_login(user=self.user)
        data = {
            'old_password': 'test',
            'new_password': 'keke',
            'type': 'password',
            'confirm': 'keke',
        }
        response = self.client.post(reverse('profile'), data=data)
        msg = json.loads(response.content)
        self.assertEqual(msg['error_text'][0][0], 'This password is too short. It must contain at least 8 characters.')
        self.assertTrue(msg['error_cur'])
        self.assertFalse(msg['error_new'])

    def test_change_password_good_paswd(self):
        self.client.force_login(user=self.user)
        data = {
            'old_password': 'test',
            'new_password': 'keke8l0l',
            'type': 'password',
            'confirm': 'keke8l0l',
        }
        response = self.client.post(reverse('profile'), data=data)
        msg = json.loads(response.content)
        self.assertTrue(msg['error_cur'])
        self.assertTrue(msg['error_new'])

    def test_change_username_to_correct(self):
        self.client.force_login(user=self.user)
        data = {
            'type': 'username',
            'username': 'haha_nope',
        }
        response = self.client.post(reverse('profile'), data=data)
        msg = json.loads(response.content)
        self.assertTrue(msg['success'])

    def test_change_username_without_username(self):
        self.client.force_login(user=self.user)
        data = {
            'type': 'username',
        }
        response = self.client.post(reverse('profile'), data=data)
        msg = json.loads(response.content)
        self.assertFalse(msg['success'])
        self.assertEqual(msg['error_text'][0], 'This field is required.')

