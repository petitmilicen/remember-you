import uuid
from ..user.models import User  
from django.db import models

class Memory(models.Model):
 
    memory_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=50, default='')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255)
    image = models.ImageField(upload_to="src/imgs/", blank=True, null=True)

    def __str__(self):
        return f"Memory {self.title} by {self.user.username}" 