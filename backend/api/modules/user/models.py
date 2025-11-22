from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
    
class User(AbstractUser):
    class UserType(models.TextChoices):
        CAREGIVER = 'Caregiver'
        PATIENT = 'Patient'

    class GenderChoices(models.TextChoices):
        MALE = 'Hombre'
        FEMALE = 'Mujer'

    class alzheimerLevelChoices(models.TextChoices):
        NONE = 'Ninguno'
        MILD = 'Leve'
        MODERATE = 'Moderado'
        SEVERE = 'Severo'

    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=20, choices=UserType.choices, null=True)    
    phone_number = models.CharField(max_length=255, null=True)
    patient = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='caregivers')
    profile_picture = models.ImageField(upload_to="src/imgs/", null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GenderChoices.choices, null=True, blank=True)
    alzheimer_level = models.CharField(max_length=10, choices=alzheimerLevelChoices.choices, null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def validate_patient_assignment(self):
        if self.user_type == self.UserType.PATIENT and self.patient is not None:
            raise ValidationError("A patient cannot have another patient assigned.")

        if self.user_type == self.UserType.CAREGIVER and self.patient:
            if self.patient.user_type != self.UserType.PATIENT:
                raise ValidationError("A caregiver can only be assigned to a patient.")
    
    def save(self, *args, **kwargs):
        self.validate_patient_assignment()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
    
    

