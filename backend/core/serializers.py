from rest_framework import serializers
from .models import User, Event, ToDoList, GiftIdea, JournalEntry, TripPlanning

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class ToDoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToDoList
        fields = '__all__'

class GiftIdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftIdea
        fields = '__all__'

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = '__all__'

class TripPlanningSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripPlanning
        fields = '__all__' 