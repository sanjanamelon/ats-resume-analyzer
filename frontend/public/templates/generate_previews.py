from PIL import Image, ImageDraw, ImageFont
import os

def create_preview(name, style, sections):
    # Create a new image with white background
    img = Image.new('RGB', (800, 1000), 'white')
    draw = ImageDraw.Draw(img)
    
    # Load a font (you might need to adjust the path based on your system)
    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except:
        font = ImageFont.load_default()
    
    # Add header
    draw.text((50, 50), f"{name} Template", font=font, fill=(0, 0, 0))
    
    # Add sections
    y = 100
    for section in sections:
        # Add section title
        draw.text((50, y), section['title'], font=font, fill=(0, 0, 0))
        y += 30
        
        # Add content
        if 'content' in section:
            for item in section['content'][:3]:  # Show only first 3 items
                draw.text((50, y), item, font=font, fill=(0, 0, 0))
                y += 20
        
        # Add skills
        if 'skills' in section:
            draw.text((50, y), "Skills:", font=font, fill=(0, 0, 0))
            y += 20
            for skill in section['skills'][:3]:  # Show only first 3 skills
                draw.text((70, y), f"• {skill}", font=font, fill=(0, 0, 0))
                y += 20
        
        # Add divider
        draw.line([(50, y), (750, y)], fill=(0, 0, 0))
        y += 30
        
        if y > 900:  # If we run out of space, stop
            break
    
    # Save the image
    img.save(f'{name.lower().replace(" ", "-")}-preview.png')

# Modern Professional Template
modern_sections = [
    {
        'title': 'Contact Information',
        'content': [
            'John Doe',
            '123 Main Street',
            'City, State 12345',
            'Phone: (555) 123-4567',
            'Email: john.doe@example.com',
            'LinkedIn: linkedin.com/in/johndoe'
        ]
    },
    {
        'title': 'Professional Summary',
        'content': [
            'Results-driven professional with 5+ years of experience in project management and team leadership. Proven track record of delivering successful projects on time and under budget.'
        ]
    },
    {
        'title': 'Core Competencies',
        'skills': [
            'Project Management', 'Team Leadership', 'Budget Management',
            'Risk Assessment', 'Stakeholder Communication', 'Process Improvement'
        ]
    }
]

# Technical Engineering Template
tech_sections = [
    {
        'title': 'Technical Skills',
        'skills': [
            'Python', 'Java', 'C++', 'SQL', 'AWS', 'Docker',
            'Kubernetes', 'CI/CD', 'REST APIs', 'Microservices'
        ]
    },
    {
        'title': 'Professional Experience',
        'content': [
            'Senior Software Engineer',
            'TechCorp',
            'City, State',
            '2019 - Present',
            '• Led development of microservices architecture',
            '• Implemented CI/CD pipeline using Jenkins',
            '• Optimized database queries for 50% performance improvement'
        ]
    }
]

# Creative Design Template
creative_sections = [
    {
        'title': 'Design Skills',
        'skills': [
            'Adobe Creative Suite', 'UI/UX Design', 'Brand Identity',
            'Illustration', 'Typography', 'Motion Graphics',
            'Print Design', 'Digital Marketing'
        ]
    },
    {
        'title': 'Portfolio Highlights',
        'content': [
            '• Created award-winning brand identity for startup',
            '• Designed responsive websites with modern UX',
            '• Developed comprehensive marketing materials'
        ]
    }
]

# Create previews
create_preview("Modern Professional", "modern", modern_sections)
create_preview("Technical Engineering", "technical", tech_sections)
create_preview("Creative Design", "creative", creative_sections)
