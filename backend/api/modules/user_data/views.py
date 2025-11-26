import os
from django.conf import settings
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserDataSerializer, ProfilePictureSerializer


class UserDataView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDataSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UploadProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        serializer = ProfilePictureSerializer(data=request.data)
        
        if serializer.is_valid():
            user = request.user
            
            if user.profile_picture:
                old_picture_path = user.profile_picture.path
                if os.path.exists(old_picture_path):
                    os.remove(old_picture_path)
            
            user.profile_picture = serializer.validated_data['profile_picture']
            user.save()
            
            user_serializer = UserDataSerializer(user)
            return Response({
                'message': 'Foto de perfil actualizada exitosamente.',
                'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        
        if user.profile_picture:
            picture_path = user.profile_picture.path
            if os.path.exists(picture_path):
                os.remove(picture_path)
            
            user.profile_picture = None
            user.save()
            
            return Response({
                'message': 'Foto de perfil eliminada exitosamente.'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'No hay foto de perfil para eliminar.'
        }, status=status.HTTP_404_NOT_FOUND)