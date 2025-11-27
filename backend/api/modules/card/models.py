import uuid
from ..user.models import User  
from django.db import models

class Card(models.Model):
    class CardType(models.TextChoices):
        MESSAGE = 'Message'
        OTHER = 'Other'
        EMERGENCY = 'Emergency'

    card_type = models.CharField(
        max_length=20,
        choices=CardType.choices,
        null=True
    )   

    card_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_by_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_cards')
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=255)

    def __str__(self):
        return f"Card {self.card_type} by {self.created_by_user.username if self.created_by_user else 'Unknown'}"