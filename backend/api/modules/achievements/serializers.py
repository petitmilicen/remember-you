from rest_framework import serializers
from .models import Achievement

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = (
            'id',
            'category',
            'level',
            'title',
            'description',
            'unlocked',
            'unlocked_at'
        )
        read_only_fields = ('id', 'created_at', 'user')
