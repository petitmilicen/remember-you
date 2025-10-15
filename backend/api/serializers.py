from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import Memory, MedicalLog, User

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

class UserCreateSerializer(BaseUserCreateSerializer):

    phone_number = serializers.CharField(required=True)
    user_type = serializers.ChoiceField(choices=User.UserType,required=True)

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = (
            'id',
            'username',
            'email',
            'password',
            'phone_number',
            'user_type',
        )
        read_only_fields = ('id',)

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = (
            'id',
            'username',
            'email',
            'phone_number',
            'user_type',
        )
        read_only_fields = ('id',)