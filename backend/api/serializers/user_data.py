from rest_framework import serializers
from api.models import User

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'password',
            'phone_number',
            'user_type',
        )
        read_only_fields =  ('memory_id', 'created_at')
