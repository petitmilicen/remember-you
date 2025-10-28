from django.contrib import admin
from .models import Memory, User, MedicalLog, MedicalAppointment, SafeZone

admin.site.register(Memory)
admin.site.register(User)
admin.site.register(MedicalLog)
admin.site.register(MedicalAppointment)
admin.site.register(SafeZone)

