from rest_framework import serializers
from ..user.models import User

class UserDataSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    main_caregiver = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'phone_number',
            'user_type',
            'full_name',
            'gender',
            'age',
            'alzheimer_level',
            'main_caregiver',
            'profile_picture',
        )

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or "Sin nombre"

    def get_main_caregiver(self, obj):
        if obj.user_type == User.UserType.PATIENT:
            caregiver = obj.caregivers.first()
            if caregiver:
                return {
                    "id": caregiver.id,
                    "full_name": f"{caregiver.first_name} {caregiver.last_name}".strip() or "Sin nombre",
                    "email": caregiver.email,
                    "phone_number": caregiver.phone_number or "No registrado",
                }
        return None
