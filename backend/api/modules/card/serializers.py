from rest_framework import serializers
from .models import Card
from ..user.models import User

class CardSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    
    class Meta:
        model = Card
        fields = (
            'card_id',
            'card_type',
            'created_at',
            'message',
            'created_by',
        )
        read_only_fields = ('card_id', 'created_at', 'user', 'created_by')
    
    def get_created_by(self, obj):

        if obj.created_by_user:
            if obj.created_by_user.user_type == User.UserType.CAREGIVER:
                return 'cuidador'
            return 'paciente'
        return 'paciente'