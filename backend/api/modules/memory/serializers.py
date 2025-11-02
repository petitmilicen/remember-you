from rest_framework import serializers
from .models import Memory

class MemorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Memory
        fields = (
            'memory_id',
            'title',
            'user',
            'created_at',
            'description',
            'image',
        )
        read_only_fields =  ('memory_id', 'created_at')
    
    def validate_title(self, value):
        if len(value.strip()) <= 3:
            raise serializers.ValidationError(
                "The title must be longer than 3 characters."
            )
        return value 