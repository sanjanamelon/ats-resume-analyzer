from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Resume, AnalysisResult
from .utils.parser import parse_resume
from .utils.analyzer import analyze_resume
import os
import json
from django.db.models import Q
from django.utils import timezone

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(['GET', 'OPTIONS'])
def health_check(request):
    """Check if the backend is running and healthy"""
    if request.method == 'OPTIONS':
        response = JsonResponse({})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, X-Frontend-Request'
        return response
    
    return JsonResponse({
        'status': 'healthy',
        'version': '1.0.0',
        'timestamp': timezone.now().isoformat()
    })

class ResumeViewSet(viewsets.ViewSet):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = []  # Remove authentication requirement
    
    def upload_resume(self, request):
        """Upload a resume file and analyze it against a job description"""
        file = request.FILES.get('file')
        job_description = request.data.get('job_description', '')
        
        if not file:
            return Response({'error': 'No resume file uploaded'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Save the resume file without user association
        resume = Resume.objects.create(
            file=file
        )
        resume_text = parse_resume(resume.file.path)
        
        # Analyze the resume
        analysis_result = analyze_resume(resume_text, job_description)
        
        # Save analysis result
        analysis = AnalysisResult.objects.create(
            resume=resume,
            keywords_matched=analysis_result['keyword_match']['matched_keywords'],
            score=analysis_result['keyword_match']['score'] / 100,
            feedback=json.dumps(analysis_result)
        )
        
        return Response({
            'id': resume.id,
            'file': resume.file.url,
            'analysis': analysis_result,
            'analysis_id': analysis.id
        }, status=status.HTTP_201_CREATED)

    def get_analysis(self, request, pk=None):
        """Get analysis results for a specific resume"""
        try:
            analysis = AnalysisResult.objects.get(id=pk)
            feedback = json.loads(analysis.feedback)
            return Response({
                'id': analysis.id,
                'resume_id': analysis.resume.id,
                'analysis': feedback
            })
        except AnalysisResult.DoesNotExist:
            return Response(
                {'error': 'Analysis result not found'},
                status=status.HTTP_404_NOT_FOUND
            )

@method_decorator(csrf_exempt, name='dispatch')
class HRViewSet(viewsets.ViewSet):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = []  # Remove authentication requirement
    
    @csrf_exempt
    def upload_multiple_resumes(self, request):
        """Upload multiple resumes and get ranked analysis"""
        files = request.FILES.getlist('resumes')  # Changed from 'files' to 'resumes'
        job_description = request.data.get('job_description', '')
        
        if not files:
            return Response({'error': 'No files uploaded'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        results = []
        for file in files:
            resume = Resume.objects.create(
                file=file
            )
            resume_text = parse_resume(resume.file.path)
            
            analysis_result = analyze_resume(resume_text, job_description)
            
            analysis = AnalysisResult.objects.create(
                resume=resume,
                keywords_matched=analysis_result['keyword_match']['matched_keywords'],
                score=analysis_result['keyword_match']['score'] / 100,
                feedback=json.dumps(analysis_result)
            )
            
            results.append({
                'id': resume.id,
                'file': resume.file.url,
                'analysis': analysis_result,
                'analysis_id': analysis.id
            })
        
        # Sort results by score in descending order
        results.sort(key=lambda x: x['analysis']['keyword_match']['score'], reverse=True)
        
        response = Response({
            'results': [
                {
                    'ats_score': int(result['analysis']['keyword_match']['score']),
                    'keyword_match': int(result['analysis']['keyword_match']['score']),
                    'skill_match': int(result['analysis']['skill_match']['score'] if 'skill_match' in result['analysis'] else 0),
                    'suggestions': result['analysis']['feedback']['suggestions'] if 'suggestions' in result['analysis']['feedback'] else [],
                    'file': result['file']
                }
                for result in results
            ],
            'total_count': len(results)
        }, status=status.HTTP_201_CREATED)
        
        # Add CORS headers
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, X-Frontend-Request'
        
        return response

    def get_ranked_resumes(self, request):
        """Get all uploaded resumes with their analysis results, sorted by score"""
        resumes = Resume.objects.all()
        results = []
        
        for resume in resumes:
            try:
                analysis = AnalysisResult.objects.get(resume=resume)
                feedback = json.loads(analysis.feedback)
                results.append({
                    'id': resume.id,
                    'file': resume.file.url,
                    'analysis': feedback,
                    'analysis_id': analysis.id
                })
            except AnalysisResult.DoesNotExist:
                continue
        
        # Sort by ATS score
        results.sort(key=lambda x: x['analysis']['ats_score']['score'], reverse=True)
        
        return Response({
            'total_resumes': len(results),
            'ranked_results': results
        })
