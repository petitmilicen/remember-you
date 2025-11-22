import uuid
from django.db import models
from ..user.models import User  

class Activities(models.Model):

    ACTIVITY_GAMES = [
        ("memorice", "Memorice"),
        ("puzzle", "Puzzle"),
        ("sudoku", "Sudoku"),
        ("camino", "Camino Correcto"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities")
    game = models.CharField(max_length=20, choices=ACTIVITY_GAMES)
    score = models.IntegerField()
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.game} - {self.user.username} - {self.score}"