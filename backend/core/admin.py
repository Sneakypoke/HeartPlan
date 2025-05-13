from django.contrib import admin
from .models import User, Event, ToDoList, GiftIdea, JournalEntry, TripPlanning

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'created_at')
    search_fields = ('username', 'email')
    list_filter = ('created_at',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'user', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('date', 'created_at', 'user')

@admin.register(ToDoList)
class ToDoListAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    search_fields = ('title',)
    list_filter = ('created_at', 'user')

@admin.register(GiftIdea)
class GiftIdeaAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('created_at', 'user')

@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    search_fields = ('title', 'content')
    list_filter = ('created_at', 'user')

@admin.register(TripPlanning)
class TripPlanningAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_date', 'end_date', 'user', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('start_date', 'end_date', 'created_at', 'user')
