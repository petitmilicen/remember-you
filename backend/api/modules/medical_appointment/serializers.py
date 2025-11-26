from .models import MedicalAppointment
from rest_framework import serializers
    
class MedicalAppointmentSerializer(serializers.ModelSerializer):
    status_type = serializers.ChoiceField(
        choices=MedicalAppointment.StatusAppointmentType.choices,
        required=False,
        default='Scheduled'
    )
    
    class Meta:
        model = MedicalAppointment
        fields = (
            'medical_appointment_id',
            'user',
            'created_at',
            'doctor',
            'date',
            'reason',
            'status_type',
        )
        read_only_fields = ('medical_appointment_id', 'created_at', 'user')

