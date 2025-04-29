import spacy
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

nltk.download('punkt')
nltk.download('stopwords')

# Load English model for spaCy
nlp = spacy.load('en_core_web_sm')

STOP_WORDS = set(stopwords.words('english'))

def extract_keywords(text):
    """Extract keywords from text using spaCy"""
    doc = nlp(text)
    keywords = []
    
    for token in doc:
        # Keep nouns, verbs, and adjectives
        if token.pos_ in ['NOUN', 'VERB', 'ADJ'] and not token.is_stop:
            keywords.append(token.text.lower())
    
    return keywords

def analyze_resume(resume_text, job_description):
    """Analyze resume against job description and return feedback"""
    # Extract keywords from both documents
    resume_keywords = extract_keywords(resume_text)
    job_keywords = extract_keywords(job_description)
    
    # Calculate keyword match score
    common_keywords = set(resume_keywords) & set(job_keywords)
    keyword_match_score = len(common_keywords) / len(job_keywords) if job_keywords else 0
    
    # Calculate semantic similarity
    vectorizer = TfidfVectorizer()
    documents = [resume_text, job_description]
    tfidf_matrix = vectorizer.fit_transform(documents)
    similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    # Calculate ATS Score as a weighted average of keyword match and semantic similarity
    ats_score = round((0.6 * keyword_match_score + 0.4 * similarity_score) * 100, 2)
    
    # Generate suggestions based on analysis
    suggestions = []
    if len(common_keywords) < len(job_keywords) * 0.6:
        suggestions.append("Add more relevant keywords from the job description")
    if similarity_score < 0.6:
        suggestions.append("Improve semantic similarity by using more relevant terminology")
    if len(common_keywords) < 5:
        suggestions.append("Include more specific industry-related terms")
    
    # Generate feedback
    feedback = {
        'ats_score': {
            'score': ats_score,
            'rating': 'Good' if ats_score >= 70 else ('Fair' if ats_score >= 50 else 'Needs Improvement')
        },
        'keyword_match': {
            'score': round(keyword_match_score * 100, 2),
            'matched_keywords': list(common_keywords),
            'missing_keywords': list(set(job_keywords) - set(resume_keywords))
        },
        'semantic_similarity': {
            'score': round(similarity_score * 100, 2),
            'description': 'High similarity indicates good match between resume and job description'
        },
        'suggestions': suggestions,
        'missing_keywords': list(set(job_keywords) - set(resume_keywords))
    }
    
    return feedback
