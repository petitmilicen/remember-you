import uuid
from django.db import models
from ..user.models import User  
from django.db.models.signals import post_save
from django.dispatch import receiver

class Achievement(models.Model):

    ACHIEVEMENT_GAMES = [
        ("memorice", "Memorice"),
        ("puzzle", "Puzzle"),
        ("sudoku", "Sudoku"),
        ("camino", "Camino Correcto"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="achievements")
    category = models.CharField(max_length=20, choices=ACHIEVEMENT_GAMES)
    level = models.IntegerField(default=1, help_text="1=easy, 2=normal, 3=hard")
    title = models.CharField(max_length=60)
    description = models.TextField(blank=True)
    unlocked = models.BooleanField(default=False)
    unlocked_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"


# Signal to auto-create achievements for new patients
@receiver(post_save, sender=User)
def create_achievements_for_new_patient(sender, instance, created, **kwargs):
    """Auto-create all 12 achievements when a new Patient user is created."""
    if created and instance.user_type == 'Patient':
        achievements_data = [
            {"category": "memorice", "level": 1, "title": "Primer Recuerdo", "description": "Completa Memorice en dificultad fácil"},
            {"category": "memorice", "level": 2, "title": "Memoria Rápida", "description": "Completa Memorice en dificultad normal"},
            {"category": "memorice", "level": 3, "title": "Maestro del Recuerdo", "description": "Completa Memorice en dificultad difícil"},
            {"category": "puzzle", "level": 1, "title": "Pieza en su Lugar", "description": "Completa el Rompecabezas en dificultad fácil"},
            {"category": "puzzle", "level": 2, "title": "Construcción Perfecta", "description": "Completa el Rompecabezas en dificultad normal"},
            {"category": "puzzle", "level": 3, "title": "Artesano del Puzzle", "description": "Completa el Rompecabezas en dificultad difícil"},
            {"category": "sudoku", "level": 1, "title": "Primer Número", "description": "Completa el Sudoku en dificultad fácil"},
            {"category": "sudoku", "level": 2, "title": "Mente Lógica", "description": "Completa el Sudoku en dificultad normal"},
            {"category": "sudoku", "level": 3, "title": "Maestro del Sudoku", "description": "Completa el Sudoku en dificultad difícil"},
            {"category": "camino", "level": 1, "title": "Primer Camino", "description": "Completa Camino Correcto en dificultad fácil"},
            {"category": "camino", "level": 2, "title": "Sin Perderse", "description": "Completa Camino Correcto en dificultad normal"},
            {"category": "camino", "level": 3, "title": "Explorador Total", "description": "Completa Camino Correcto en dificultad difícil"},
        ]
        
        for ach_data in achievements_data:
            Achievement.objects.create(user=instance, **ach_data)
