from rest_framework import serializers
from .models import SupportRequest
from ..user.models import User


class RequesterSerializer(serializers.ModelSerializer):
    """Serializer for requester basic info"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'phone_number']
        read_only_fields = fields
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class AssignedCaregiverSerializer(serializers.ModelSerializer):
    """Serializer for assigned caregiver basic info"""
    full_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'avatar', 'email', 'phone_number']
        read_only_fields = fields
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    
    def get_avatar(self, obj):
        first_initial = obj.first_name[0].upper() if obj.first_name else ''
        last_initial = obj.last_name[0].upper() if obj.last_name else ''
        return f"{first_initial}{last_initial}" if first_initial or last_initial else obj.username[0].upper()


class SupportRequestSerializer(serializers.ModelSerializer):
    """Main serializer for support requests"""
    requester = RequesterSerializer(read_only=True)
    assigned_caregiver = AssignedCaregiverSerializer(read_only=True)
    assigned_caregiver_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = SupportRequest
        fields = [
            'id', 'requester', 'assigned_caregiver', 'assigned_caregiver_id',
            'reason', 'start_datetime', 'end_datetime', 'notes', 'status',
            'actual_start', 'actual_end', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'requester', 'created_at', 'updated_at']


class CreateSupportRequestSerializer(serializers.ModelSerializer):
    """Serializer for creating support requests"""
    
    class Meta:
        model = SupportRequest
        fields = ['reason', 'start_datetime', 'end_datetime', 'notes']
    
    def validate(self, data):
        if data['start_datetime'] >= data['end_datetime']:
            raise serializers.ValidationError({
                'end_datetime': 'La fecha de fin debe ser posterior a la fecha de inicio.'
            })
        return data


class UpdateStatusSerializer(serializers.Serializer):
    """Serializer for updating support request status"""
    status = serializers.ChoiceField(choices=SupportRequest.Status.choices)
    actual_start = serializers.DateTimeField(required=False, allow_null=True)
    actual_end = serializers.DateTimeField(required=False, allow_null=True)


class AssignCaregiverSerializer(serializers.Serializer):
    """Serializer for assigning a caregiver to a support request"""
    caregiver_id = serializers.IntegerField()
    
    def validate_caregiver_id(self, value):
        try:
            caregiver = User.objects.get(id=value, user_type=User.UserType.CAREGIVER)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Cuidador no encontrado o no es un cuidador válido.")
