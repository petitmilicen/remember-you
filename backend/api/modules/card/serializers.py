from rest_framework import serializers
from .models import Card

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = (
            'card_id',
            'card_type',
            'created_at',
            'message',
        )
        read_only_fields =  ('card_id','created_at', 'user')