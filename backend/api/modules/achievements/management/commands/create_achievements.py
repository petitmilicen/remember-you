from django.core.management.base import BaseCommand
from api.modules.user.models import User
from api.modules.achievements.models import Achievement


class Command(BaseCommand):
    help = 'Create all 12 achievements for all users'

    def handle(self, *args, **options):
        # Define all 12 achievements
        achievements_data = [
            # Memorice
            {
                "category": "memorice",
                "level": 1,
                "title": "Primer Recuerdo",
                "description": "Completa Memorice en dificultad fácil"
            },
            {
                "category": "memorice",
                "level": 2,
                "title": "Memoria Rápida",
                "description": "Completa Memorice en dificultad normal"
            },
            {
                "category": "memorice",
                "level": 3,
                "title": "Maestro del Recuerdo",
                "description": "Completa Memorice en dificultad difícil"
            },
            
            # Puzzle
            {
                "category": "puzzle",
                "level": 1,
                "title": "Pieza en su Lugar",
                "description": "Completa el Rompecabezas en dificultad fácil"
            },
            {
                "category": "puzzle",
                "level": 2,
                "title": "Construcción Perfecta",
                "description": "Completa el Rompecabezas en dificultad normal"
            },
            {
                "category": "puzzle",
                "level": 3,
                "title": "Artesano del Puzzle",
                "description": "Completa el Rompecabezas en dificultad difícil"
            },
            
            # Sudoku
            {
                "category": "sudoku",
                "level": 1,
                "title": "Primer Número",
                "description": "Completa el Sudoku en dificultad fácil"
            },
            {
                "category": "sudoku",
                "level": 2,
                "title": "Mente Lógica",
                "description": "Completa el Sudoku en dificultad normal"
            },
            {
                "category": "sudoku",
                "level": 3,
                "title": "Maestro del Sudoku",
                "description": "Completa el Sudoku en dificultad difícil"
            },
            
            # Camino Correcto
            {
                "category": "camino",
                "level": 1,
                "title": "Primer Camino",
                "description": "Completa Camino Correcto en dificultad fácil"
            },
            {
                "category": "camino",
                "level": 2,
                "title": "Sin Perderse",
                "description": "Completa Camino Correcto en dificultad normal"
            },
            {
                "category": "camino",
                "level": 3,
                "title": "Explorador Total",
                "description": "Completa Camino Correcto en dificultad difícil"
            },
        ]

        # Get all users with user_type "Patient"
        users = User.objects.filter(user_type='Patient')
        
        total_created = 0
        total_skipped = 0
        
        for user in users:
            self.stdout.write(f'\nProcessing user: {user.username}')
            
            for ach_data in achievements_data:
                # Check if achievement already exists for this user
                exists = Achievement.objects.filter(
                    user=user,
                    category=ach_data['category'],
                    level=ach_data['level']
                ).exists()
                
                if not exists:
                    Achievement.objects.create(
                        user=user,
                        **ach_data
                    )
                    total_created += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'  ✓ Created: {ach_data["title"]} (level {ach_data["level"]})'
                        )
                    )
                else:
                    total_skipped += 1
                    self.stdout.write(
                        self.style.WARNING(
                            f'  - Skipped: {ach_data["title"]} (already exists)'
                        )
                    )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Process complete! Created {total_created} achievements, skipped {total_skipped} existing ones.'
            )
        )
