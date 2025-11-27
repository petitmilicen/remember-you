from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Achievement
from .serializers import AchievementSerializer
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

class AchievementListCreateView(generics.ListCreateAPIView):
    """List all achievements for the authenticated user or create a new one"""
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Achievement.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AchievementRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a specific achievement"""
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Achievement.objects.filter(user=self.request.user)

class UnlockAchievementView(APIView):
    """Unlock an achievement for the authenticated user"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        category = request.data.get('category')
        level = request.data.get('level')
        
        if not category or not level:
            return Response(
                {'error': 'Both category and level are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            achievement = Achievement.objects.get(
                user=request.user,
                category=category,
                level=level
            )
            
            # Only unlock if not already unlocked
            if not achievement.unlocked:
                achievement.unlocked = True
                achievement.unlocked_at = timezone.now()
                achievement.save()
                return Response(
                    AchievementSerializer(achievement).data,
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'message': 'Achievement already unlocked'},
                    status=status.HTTP_200_OK
                )
                
        except Achievement.DoesNotExist:
            return Response(
                {'error': 'Achievement not found'},
                status=status.HTTP_404_NOT_FOUND
            )