from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ToDoList(models.Model):
    title = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todo_lists')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class GiftIdea(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gift_ideas')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class JournalEntry(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class TripPlanning(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trip_plans')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
