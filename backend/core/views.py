from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from django.contrib.auth.models import User
from .models import Event, ToDoList, GiftIdea, JournalEntry, TripPlanning
from .serializers import RegisterSerializer, EventSerializer, ToDoListSerializer, GiftIdeaSerializer, JournalEntrySerializer, TripPlanningSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    # No queryset — CreateAPIView only creates; list/retrieve/update/delete not exposed


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
