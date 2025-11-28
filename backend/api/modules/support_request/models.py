import uuid
from django.db import models
from ..user.models import User


class SupportRequest(models.Model):
    class Status(models.TextChoices):
        EN_ESPERA = 'En espera'
        ASIGNADA = 'Asignada'
        EN_CURSO = 'En curso'
        FINALIZADA = 'Finalizada'
        CANCELADA = 'Cancelada'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requester = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='support_requests',
        help_text="Cuidador que solicita el apoyo"
    )
    assigned_caregiver = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_support_requests',
        limit_choices_to={'user_type': User.UserType.CAREGIVER},
        help_text="Cuidador asignado para dar el apoyo"
    )
    
    # Patient to be temporarily assigned to the caregiver
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='support_requests_as_patient',
        null=True,
        blank=True,
        limit_choices_to={'user_type': User.UserType.PATIENT},
        help_text="Paciente que será asignado temporalmente al cuidador suplente"
    )
    
    reason = models.CharField(max_length=255, help_text="Motivo de la solicitud")
    start_datetime = models.DateTimeField(help_text="Fecha y hora de inicio del apoyo")
    end_datetime = models.DateTimeField(help_text="Fecha y hora de fin del apoyo")
    notes = models.TextField(blank=True, help_text="Notas adicionales para el cuidador suplente")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.EN_ESPERA,
        help_text="Estado actual de la solicitud"
    )
    actual_start = models.DateTimeField(null=True, blank=True, help_text="Hora real de inicio")
    actual_end = models.DateTimeField(null=True, blank=True, help_text="Hora real de finalización")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Solicitud de Apoyo'
        verbose_name_plural = 'Solicitudes de Apoyo'
    
    def __str__(self):
        return f"{self.requester.username} - {self.reason} ({self.status})"
