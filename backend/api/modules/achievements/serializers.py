from rest_framework import serializers
from .models import Achievement

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = (
            'category',
            'title',
            'description',
            'unlocked_at'
        )
        read_only_fields =  ('achievment_id', 'created_at', 'user')
