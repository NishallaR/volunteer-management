from django.db import models
from accounts.models import User
from opportunities.models import Opportunity

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]

    volunteer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='applications'
    )

    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name='applications'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    hours_worked = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    feedback = models.TextField(blank=True)

    applied_at = models.DateTimeField(auto_now_add=True)
