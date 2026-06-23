from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Event, ToDoList, GiftIdea, JournalEntry, TripPlanning


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        read_only_fields = ('id',)
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
        }

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class ToDoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToDoList
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class GiftIdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftIdea
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class TripPlanningSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripPlanning
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
