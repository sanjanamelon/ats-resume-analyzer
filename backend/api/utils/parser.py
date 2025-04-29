import os
import docx
import PyPDF2
from pdf2image import convert_from_path
import pytesseract

def parse_resume(file_path):
    """Parse resume content from various file formats"""
    file_extension = os.path.splitext(file_path)[1].lower()
    
    if file_extension == '.pdf':
        return parse_pdf(file_path)
    elif file_extension == '.docx':
        return parse_docx(file_path)
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")

def parse_pdf(file_path):
    """Parse text from PDF file"""
    try:
        # Try to extract text directly
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            if text.strip():
                return text
        
        # If direct extraction fails, try OCR
        images = convert_from_path(file_path)
        text = ""
        for image in images:
            text += pytesseract.image_to_string(image)
        
        return text
    except Exception as e:
        raise Exception(f"Error parsing PDF: {str(e)}")

def parse_docx(file_path):
    """Parse text from DOCX file"""
    try:
        doc = docx.Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise Exception(f"Error parsing DOCX: {str(e)}")
