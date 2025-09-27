from google import genai
from fastapi import FastAPI, UploadFile, Form
from PyPDF2 import PdfReader
from io import BytesIO
from typing import Optional
import os
from dotenv import load_dotenv
import json # Added import for handling structured JSON response
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from a .env file if present
load_dotenv()

# Initialize FastAPI
app = FastAPI()


# Add this after creating your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- Gemini Client Configuration ---

# NOTE: For security in production, always use environment variables
# (os.environ.get("GEMINI_API_KEY")) instead of hardcoding the key.
# I am using the key you provided previously.


try:
    # Initialize the Gemini client using the modern SDK
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
except Exception as e:
    # This try/except block is useful to debug initialization issues
    print(f"Warning: Gemini client initialization failed. Please ensure 'google-genai' is installed. Error: {e}")
    client = None

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text from uploaded PDF file (bytes content)."""
    # Wrap the raw bytes in a BytesIO object so PdfReader can treat it like a file
    pdf_file = BytesIO(pdf_bytes)
    try:
        pdf_reader = PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            # Safely extract and accumulate text, adding a newline for separation
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error during PDF extraction: {e}")
        return "Could not extract text from PDF."

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile,
    job_description: str = Form(...),
):
    """
    Endpoint to analyze resume against job description
    """
    if not client:
         return {"error": "Gemini client is not initialized. Check server logs."}
         
    # Read and extract text from PDF
    pdf_content = await resume.read()
    resume_text = extract_text_from_pdf(pdf_content)
    
    if resume_text == "Could not extract text from PDF.":
        return {"error": "Failed to read or extract text from the PDF file."}

    # Prepare prompt for Gemini
    # Simplified prompt as the structure is now defined by the JSON schema
    prompt = f"""
    Analyze the RESUME against the JOB DESCRIPTION. Focus strictly on professional skills, experience, and keywords.
    
    RESUME:
    {resume_text}
    
    JOB DESCRIPTION:
    {job_description}
    
    Generate a JSON object containing the match analysis.
    """

    # --- JSON Schema Definition ---
    # Defines the required structure for the model's output
    analysis_schema = {
        "type": "OBJECT",
        "properties": {
            "match_percentage": { 
                "type": "NUMBER", 
                "description": "The estimated match percentage between the resume and job description (e.g., 75)." 
            },
            "matching_skills": { 
                "type": "ARRAY", 
                "items": { "type": "STRING" },
                "description": "List the key skills and experiences that directly match the job description."
            },
            "missing_skills": { 
                "type": "ARRAY", 
                "items": { "type": "STRING" },
                "description": "List the essential skills or keywords from the JD that are missing from the resume."
            },
            "improvement_suggestions": { 
                "type": "ARRAY", 
                "items": { "type": "STRING" },
                "description": "Provide actionable, concise suggestions for tailoring the resume for this specific role."
            }
        },
        "required": ["match_percentage", "matching_skills", "missing_skills", "improvement_suggestions"]
    }
    
    # --- Configuration for Structured Output ---
    gemini_config = {
        "max_output_tokens": 2048,
        "temperature": 0.3,
        "response_mime_type": "application/json",
        "response_schema": analysis_schema,
    }
    
    try:
        # Generate analysis using Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=gemini_config, # Pass the configuration dictionary here
        )

        print(f"Raw Gemini response: {response}")
        
        # Check if response text is present and parse the JSON
        if response.text:
            # The model is forced to return a JSON string, which we parse
            analysis_data = json.loads(response.text)
            print(f"Gemini response data: {analysis_data}")
            return {"analysis": analysis_data}
        else:
            print("Gemini API returned an empty response.")
            # If text is empty despite the JSON schema, something is fundamentally wrong (e.g., API key revoked)
            return {"error": "Gemini API returned an empty response.", "debug_info": "Model failed to generate non-empty text (even in JSON format). Check API key status."}

    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON response: {response.text[:100]}... Error: {e}")
        return {"error": "Gemini API returned unparseable output.", "raw_response_preview": response.text[:100]}
    except Exception as e:
        print(f"Gemini API call failed: {e}")
        return {"error": f"An error occurred during the analysis: {e}"}


if __name__ == "__main__":
    import uvicorn
    # The command to run the application using uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
