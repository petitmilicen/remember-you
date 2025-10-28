from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from api.models import User

class UserCreateSerializer(BaseUserCreateSerializer):

    phone_number = serializers.CharField(required=True)
    user_type = serializers.ChoiceField(choices=User.UserType,required=True)

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = (
            'id',
            'email',
            'username',
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
            'email',
            'username',
            'phone_number',
            'user_type',
        )
        read_only_fields = ('id',)