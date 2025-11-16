from rest_framework import serializers
from ..user.models import User

class UserDataSerializer(serializers.ModelSerializer):
    # Campos adicionales (no necesariamente en el modelo)
    nombre_completo = serializers.SerializerMethodField()
    genero = serializers.SerializerMethodField()
    edad = serializers.SerializerMethodField()
    contacto_emergencia = serializers.SerializerMethodField()
    nivel_alzheimer = serializers.SerializerMethodField()
    foto_perfil = serializers.SerializerMethodField()
    cuidador_principal = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'phone_number',
            'user_type',
            'nombre_completo',
            'genero',
            'edad',
            'contacto_emergencia',
            'nivel_alzheimer',
            'foto_perfil',
            'cuidador_principal',
        )

    def get_nombre_completo(self, obj):
        return getattr(obj, "username", None) or getattr(obj, "email", "Sin nombre")

    def get_genero(self, obj):
        return getattr(obj, "genero", "—")

    def get_edad(self, obj):
        return getattr(obj, "edad", "—")

    def get_contacto_emergencia(self, obj):
        return getattr(obj, "phone_number", "No registrado")

    def get_nivel_alzheimer(self, obj):
        return getattr(obj, "nivel_alzheimer", "Desconocido")

    def get_foto_perfil(self, obj):
        # Si tu modelo tiene un campo ImageField llamado "foto"
        if hasattr(obj, "foto") and obj.foto:
            return obj.foto.url
        return None

    def get_cuidador_principal(self, obj):
        # Si el usuario tiene un cuidador asignado mediante una relación
        cuidador = getattr(obj, "cuidador_principal", None)
        if cuidador:
            return {"nombre": getattr(cuidador, "username", "Sin asignar")}
        return None
