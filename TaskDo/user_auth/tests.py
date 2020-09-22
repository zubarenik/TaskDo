from django.test import TestCase, Client
from django.urls import reverse
from user.models import CustomUser


class AuthTest(TestCase):
    fixtures = ['db.json', ]

    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.get(username='test')

    def test_status_code(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)

    def test_invalid_login_or_paswd(self):
        data = {
            'username': 'test',
            'password': 'a'
        }
        response = self.client.post(reverse('login'), data=data)
        self.assertIn('Please enter a correct username and password.', response.content.decode('utf-8'))

    def test_successful_login(self):
        data = {
            'username': 'test',
            'password': 'test'
        }
        response = self.client.post(reverse('login'), data=data)
        self.assertRedirects(response, reverse('home'))

    def test_sign_up_status_code(self):
        response = self.client.get(reverse('signup'))
        self.assertEqual(response.status_code, 200)

    def test_create_common_passwd(self):
        data = {
            'username': 'keker',
            'email': 'keker@kek.er',
            'first_name': 'kek',
            'password1': 'kek',
            'password2': 'kek'
        }
        response = self.client.post(reverse('signup'), data=data)
        warnings = [
            'Your password can&#39;t be too similar to your other personal information.',
            'Your password must contain at least 8 characters.',
            'Your password can&#39;t be a commonly used password.'
        ]
        for warning in warnings:
            self.assertIn(warning, response.content.decode('utf-8'))

    def test_create_different_passwd(self):
        data = {
            'username': 'keker',
            'email': 'keker@kek.er',
            'first_name': 'kek',
            'password1': 'lol',
            'password2': 'aha'
        }
        response = self.client.post(reverse('signup'), data=data)
        self.assertIn('Enter the same password as before, for verification.', response.content.decode('utf-8'))

    def test_create_user(self):
        data = {
            'username': 'keker',
            'email': 'keker@kek.er',
            'first_name': 'kek',
            'password1': 'r00fl_l0l123',
            'password2': 'r00fl_l0l123'
        }
        response = self.client.post(reverse('signup'), data=data)
        self.assertRedirects(response, reverse('login'))
        self.assertEqual(response.status_code, 302)

    def test_logout(self):
        response = self.client.get(reverse('logout'))
        self.assertRedirects(response, reverse('login'))
        self.assertEqual(response.status_code, 302)
