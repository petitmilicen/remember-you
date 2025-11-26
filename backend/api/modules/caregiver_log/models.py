import uuid
from ..user.models import User  
from django.db import models

class CaregiverLog(models.Model):

    log_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=255)
    description = models.CharField(max_length=255)

    def __str__(self):
        return f"Log by {self.user.username}" 
    
