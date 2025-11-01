from .models import MedicalLog
from rest_framework import serializers
    
class MedicalLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalLog
        fields = (
            'medical_log_id',
            'user',
            'created_at',
            'description',
        )
        read_only_fields =  ('medical_log_id', 'created_at')

