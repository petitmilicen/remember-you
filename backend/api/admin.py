from django.contrib import admin
from .models import Memory, User, MedicalLog

@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    list_display = ('memory_id', 'title', 'user', 'created_at', 'description', 'image' )

admin.site.register(User)
admin.site.register(MedicalLog)