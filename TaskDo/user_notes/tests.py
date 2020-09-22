from django.test import TestCase, Client
from django.urls import reverse
from .models import Notes
from user.models import CustomUser


class TestUserNotesDetailView(TestCase):
    fixtures = ['test.json']

    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.all()[0]
        self.note = Notes.objects.get(user_id=self.user)

    def test_note_detail_response_unauth(self):
        note_id = self.note.pk
        self.response = self.client.get('/note/' + str(note_id))
        self.assertEqual(self.response.status_code, 302)

    def test_note_detail_response_auth(self):
        self.client.force_login(user=self.user)
        note_id = self.note.pk
        self.response = self.client.get('/note/' + str(note_id))
        self.assertEqual(self.response.status_code, 200)


class TestUserNotesDelete(TestCase):
    fixtures = ['test.json']

    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.all()[0]
        self.note = Notes.objects.get(user_id=self.user)

    # def test_auth_protection(self):
    #    unauth_client = Client()
    #    print(reverse('note', kwargs={"pk": 1}))
    #    response = unauth_client.get('/note/1')
    #    self.assertEqual(response.status_code, 302)
    #    self.assertRedirects(response, reverse('registration/login'))

    def test_note_detail_response_unauth(self):
        note_id = self.note.pk
        self.response = self.client.get('/note/delete/' + str(note_id))
        self.assertEqual(self.response.status_code, 302)

    def test_note_detail_response_auth(self):
        self.client.force_login(user=self.user)
        note_id = self.note.pk
        self.response = self.client.get('/note/delete/' + str(note_id))
        self.assertEqual(self.response.status_code, 200)


class TestUserNotesEdit(TestCase):
    fixtures = ['test.json']

    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.all()[0]
        self.note = Notes.objects.get(user_id=self.user)

    # def test_auth_protection(self):
    #    unauth_client = Client()
    #    print(reverse('note', kwargs={"pk": 1}))
    #    response = unauth_client.get('/note/1')
    #    self.assertEqual(response.status_code, 302)
    #    self.assertRedirects(response, reverse('registration/login'))

    def test_note_detail_response_unauth(self):
        note_id = self.note.pk
        self.response = self.client.get('/note/edit/' + str(note_id))
        self.assertEqual(self.response.status_code, 302)

    def test_note_detail_response_auth(self):
        self.client.force_login(user=self.user)
        note_id = self.note.pk
        self.response = self.client.get('/note/edit/' + str(note_id))
        self.assertEqual(self.response.status_code, 200)
