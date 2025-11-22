from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import User

class UserCreateSerializer(BaseUserCreateSerializer):
    phone_number = serializers.CharField(required=False)
    user_type = serializers.ChoiceField(choices=User.UserType.choices, required=True)
    age = serializers.IntegerField(required=False)
    gender = serializers.ChoiceField(choices=User.GenderChoices.choices, required=False)
    alzheimer_level = serializers.ChoiceField(choices=User.alzheimerLevelChoices.choices, required=False)
    patient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = (
            'id',
            'email',
            'username',
            'password',
            'phone_number',
            'user_type',
            'age',
            'gender',
            'alzheimer_level',
            'patient',
            'first_name',
            'last_name',
        )
        read_only_fields = ('id',)

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = (
            'id',
            'email',
            'username',
            'phone_number',
            'user_type',
        )
        read_only_fields = ('id',)