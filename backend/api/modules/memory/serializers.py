from rest_framework import serializers
from .models import Memory

class MemorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Memory
        fields = (
            'memory_id',
            'title',
            'created_at',
            'description',
            'image',
            'user',
        )
        read_only_fields =  ('memory_id', 'created_at', 'user',)

    def validate_title(self, value):
        if len(value.strip()) <= 2:
            raise serializers.ValidationError(
                "The title must be longer than 2 characters."
            )
        return value