import requests
import os

def test_resume_analysis():
    # Create a sample text file as a test resume
    test_resume_content = """
    John Doe
    Software Engineer
    
    Experience:
    - Senior Developer at TechCorp
    - Python, Django, React
    - AWS, Docker, CI/CD
    """
    
    # Create a temporary file
    with open('test_resume.txt', 'w') as f:
        f.write(test_resume_content)
    
    try:
        # Open the file in binary mode
        with open('test_resume.txt', 'rb') as resume_file:
            # Prepare the files and data
            files = {'resume': resume_file}
            data = {
                'job_description': """
                Senior Software Engineer
                
                Requirements:
                - 5+ years experience in software development
                - Strong Python and Django experience
                - Experience with cloud platforms
                - Knowledge of CI/CD pipelines
                """
            }
            
            try:
                # Make the API request
                response = requests.post('http://127.0.0.1:8000/api/resumes/', files=files, data=data)
                print("Response status code:", response.status_code)
                print("Response content:")
                print(response.json())
            except Exception as e:
                print("Error making API request:", str(e))
    finally:
        # Clean up the temporary file
        if os.path.exists('test_resume.txt'):
            try:
                os.remove('test_resume.txt')
            except Exception as e:
                print("Error removing file:", str(e))

if __name__ == '__main__':
    test_resume_analysis()
