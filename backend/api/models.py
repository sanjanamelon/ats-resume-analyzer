from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('STUDENT', 'Student'),
        ('HR', 'HR'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    
    # Override the related_name attributes to avoid conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='api_user_set',
        related_query_name='api_user'
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='api_user_set',
        related_query_name='api_user'
    )

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='resumes', null=True, blank=True)
    file = models.FileField(upload_to='resumes/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Resume {self.id} by {self.user.username if self.user else 'Public Upload'}"

class AnalysisResult(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='analysis_results')
    keywords_matched = models.JSONField()
    score = models.FloatField()
    feedback = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis for Resume {self.resume.id}"
