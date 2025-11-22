import uuid
from django.db import models
from ..user.models import User  


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
    title = models.CharField(max_length=60)
    description = models.TextField(blank=True)
    unlocked_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"
