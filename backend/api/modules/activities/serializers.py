from rest_framework import serializers
from .models import Activities

class ActivitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activities
        fields = (
            'game',
            'score',
            'played_at'
        )
        read_only_fields = ('Activities_id', 'game', 'played_at', 'played_at')
