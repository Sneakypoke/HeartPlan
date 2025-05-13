from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Event, ToDoList, GiftIdea, JournalEntry, TripPlanning
from .serializers import UserSerializer, EventSerializer, ToDoListSerializer, GiftIdeaSerializer, JournalEntrySerializer, TripPlanningSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class ToDoListViewSet(viewsets.ModelViewSet):
    queryset = ToDoList.objects.all()
    serializer_class = ToDoListSerializer

class GiftIdeaViewSet(viewsets.ModelViewSet):
    queryset = GiftIdea.objects.all()
    serializer_class = GiftIdeaSerializer

class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer

class TripPlanningViewSet(viewsets.ModelViewSet):
    queryset = TripPlanning.objects.all()
    serializer_class = TripPlanningSerializer
