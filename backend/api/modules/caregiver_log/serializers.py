from .models import CaregiverLog
from rest_framework import serializers
    
class CaregiverLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaregiverLog
        fields = (
            'log_id',
            'user',
            'created_at',
            'category',
            'description',
        )
        read_only_fields =  ('log_id', 'created_at', 'user')


