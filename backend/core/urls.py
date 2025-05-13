from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, EventViewSet, ToDoListViewSet, GiftIdeaViewSet, JournalEntryViewSet, TripPlanningViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'events', EventViewSet)
router.register(r'todo-lists', ToDoListViewSet)
router.register(r'gift-ideas', GiftIdeaViewSet)
router.register(r'journal-entries', JournalEntryViewSet)
router.register(r'trip-plans', TripPlanningViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 