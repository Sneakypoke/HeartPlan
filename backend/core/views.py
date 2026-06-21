from rest_framework import viewsets, generics, permissions
from .models import Event, ToDoList, GiftIdea, JournalEntry, TripPlanning
from .serializers import RegisterSerializer, EventSerializer, ToDoListSerializer, GiftIdeaSerializer, JournalEntrySerializer, TripPlanningSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    # No queryset — CreateAPIView only creates; list/retrieve/update/delete not exposed


class OwnedModelViewSet(viewsets.ModelViewSet):
    """Base ViewSet that scopes every object to the requesting user.

    `queryset` is retained on each subclass so the router can infer the
    basename, but `get_queryset()` filters it to the authenticated user so
    one user can never read/update/delete another user's rows. `perform_create`
    binds ownership server-side; combined with `read_only_fields = ('user',)`
    on the serializers, the client can never forge the owner.
    """

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EventViewSet(OwnedModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class ToDoListViewSet(OwnedModelViewSet):
    queryset = ToDoList.objects.all()
    serializer_class = ToDoListSerializer

class GiftIdeaViewSet(OwnedModelViewSet):
    queryset = GiftIdea.objects.all()
    serializer_class = GiftIdeaSerializer

class JournalEntryViewSet(OwnedModelViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer

class TripPlanningViewSet(OwnedModelViewSet):
    queryset = TripPlanning.objects.all()
    serializer_class = TripPlanningSerializer
