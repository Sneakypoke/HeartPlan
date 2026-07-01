from django.db import models
from django.conf import settings


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    start = models.DateTimeField()
    end = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True, default='')
    category = models.CharField(max_length=50, blank=True, default='')
    reminder = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ToDoList(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    due_date = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=10, default='medium')
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='todo_lists')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class GiftIdea(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    price_range = models.CharField(max_length=20, blank=True, default='')
    occasion = models.CharField(max_length=50, blank=True, default='')
    category = models.CharField(max_length=50, blank=True, default='')
    image_url = models.CharField(max_length=500, blank=True, default='')
    purchased = models.BooleanField(default=False)
    notes = models.TextField(blank=True, default='')
    link = models.CharField(max_length=500, blank=True, default='')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='gift_ideas')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class JournalEntry(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, default='')
    mood = models.CharField(max_length=50, blank=True, default='')
    tags = models.JSONField(default=list)
    images = models.JSONField(default=list)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='journal_entries')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class TripPlanning(models.Model):
    title = models.CharField(max_length=200)
    destination = models.CharField(max_length=200, blank=True, default='')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default='planning')
    itinerary = models.JSONField(default=list)
    expenses = models.JSONField(default=list)
    packing_list = models.JSONField(default=list)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trip_plans')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
