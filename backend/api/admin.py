from django.contrib import admin
from .modules.card.models import Card
from .modules.memory.models import Memory
from .modules.user.models import User
from .modules.medical_log.models import MedicalLog
from .modules.medical_appointment.models import MedicalAppointment
from .modules.safe_zone.models import SafeZone
from .modules.caregiver_log.models import CaregiverLog

admin.site.register(Memory)
admin.site.register(User)
admin.site.register(MedicalLog)
admin.site.register(MedicalAppointment)
admin.site.register(SafeZone)
admin.site.register(Card) 
admin.site.register(CaregiverLog)
 
