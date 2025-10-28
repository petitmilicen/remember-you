import uuid
from .user import User
from django.db import models

class MedicalAppointment(models.Model):
    class StatusAppointmentType(models.TextChoices):
        SCHEDULED = 'Scheduled'
        COMPLETED = 'Completed'
        CANCELLED = 'Cancelled'

    medical_appointment_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    doctor = models.CharField(max_length=255)
    date = models.DateTimeField()
    reason = models.TextField(blank=True, null=True)
    status_type = models.CharField(
        max_length=20,
        choices=StatusAppointmentType.choices,
        null=True,
        default=StatusAppointmentType.SCHEDULED
    ) 

    def __str__(self):
        return f"{self.user} - {self.date}"
