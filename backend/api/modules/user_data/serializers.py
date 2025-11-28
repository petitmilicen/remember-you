from rest_framework import serializers
from ..user.models import User


class ProfilePictureSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField(required=True)
    
    def validate_profile_picture(self, value):
        max_size = 5 * 1024 * 1024  
        if value.size > max_size:
            raise serializers.ValidationError("El tamaño de la imagen no puede exceder 5MB.")
        
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Solo se permiten imágenes JPG, PNG o WebP.")
        
        return value


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
            'profile_picture',
            'main_caregiver',
            'patient',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')

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


class PatientInfoSerializer(serializers.ModelSerializer):
    """Serializer for patient information to be shared via QR code"""
    full_name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'full_name', 'age', 'gender',
            'alzheimer_level', 'phone_number', 'profile_picture'
        ]
        read_only_fields = fields
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    
    def get_profile_picture(self, obj):
        if obj.profile_picture and hasattr(obj.profile_picture, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None


class CaregiverSerializer(serializers.ModelSerializer):
    """Serializer for caregiver information for Red de Apoyo"""
    full_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    disponible = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'full_name', 'avatar', 'phone_number', 
            'email', 'disponible'
        ]
        read_only_fields = fields
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    
    def get_avatar(self, obj):
        # Generate initials from first and last name
        first_initial = obj.first_name[0].upper() if obj.first_name else ''
        last_initial = obj.last_name[0].upper() if obj.last_name else ''
        return f"{first_initial}{last_initial}" if first_initial or last_initial else obj.username[0].upper()
    
    def get_disponible(self, obj):
        # A caregiver is available if they don't have a patient assigned
        return obj.patient is None
