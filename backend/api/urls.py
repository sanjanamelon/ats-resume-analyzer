from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, health_check, HRViewSet

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume')

urlpatterns = [
    path('', include(router.urls)),
    path('resumes/upload/', ResumeViewSet.as_view({'post': 'upload_resume'}), name='resume-upload'),
    path('resumes/<int:pk>/analysis/', ResumeViewSet.as_view({'get': 'get_analysis'}), name='resume-analysis'),
    path('health/', health_check, name='health-check'),
    path('hr/analyze/', HRViewSet.as_view({'post': 'upload_multiple_resumes'}), name='hr-analyze'),
]
