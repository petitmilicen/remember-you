from rest_framework import serializers
from api.models import MedicalLog
    
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

