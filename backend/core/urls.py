from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, EventViewSet, ToDoListViewSet, GiftIdeaViewSet, \
    JournalEntryViewSet, TripPlanningViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'todo-lists', ToDoListViewSet)
router.register(r'gift-ideas', GiftIdeaViewSet)
router.register(r'journal-entries', JournalEntryViewSet)
router.register(r'trip-plans', TripPlanningViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]
