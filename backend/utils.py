import os
from typing import Dict, Any, List
import json
import pandas as pd
from PIL import Image
import re
import ollama
import PyPDF2
from docx import Document

def extract_text_from_file(file_path: str) -> str:
    """Extract text content from various file types."""
    file_ext = os.path.splitext(file_path)[1].lower()
    text_content = ""
    
    try:
        if file_ext == '.pdf':
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text_content += page.extract_text() + "\n"
                    
        elif file_ext in ['.doc', '.docx']:
            doc = Document(file_path)
            for paragraph in doc.paragraphs:
                text_content += paragraph.text + "\n"
                
        elif file_ext in ['.txt']:
            with open(file_path, 'r', encoding='utf-8') as file:
                text_content = file.read()
                
        else:
            # For image files, return a placeholder - in production you'd use OCR
            text_content = "Medical image file uploaded. OCR analysis would be required for text extraction."
            
    except Exception as e:
        print(f"Error extracting text from {file_path}: {str(e)}")
        text_content = "Unable to extract text from the uploaded file."
    
    return text_content.strip()

def analyze_medical_report_with_ollama(text_content: str, language: str = "en") -> Dict[str, Any]:
    """Analyze medical report using Ollama Llama3.2 model."""
    
    # Create a comprehensive prompt for medical analysis
    prompt = f"""You are an expert medical AI assistant. Analyze the following medical report and provide a comprehensive analysis in {language} language.

Medical Report Content:
{text_content}

Please provide your analysis in the following JSON format:
{{
    "type": "medical_report",
    "summary": "A brief summary of the overall health status based on the report",
    "key_findings": [
        "List of key findings from the report",
        "Include normal and abnormal values",
        "Mention important test results"
    ],
    "abnormalities": [
        {{
            "parameter": "Name of the abnormal parameter",
            "value": "Actual value found",
            "normal_range": "Expected normal range",
            "status": "elevated/reduced/abnormal",
            "explanation": "Simple explanation of what this means for the patient"
        }}
    ],
    "medical_terms": [
        {{
            "term": "Medical term from the report",
            "explanation": "Simple explanation of what this term means"
        }}
    ],
    "recommendations": [
        "Lifestyle recommendations based on the findings",
        "Dietary suggestions if applicable",
        "Follow-up recommendations"
    ]
}}

Important guidelines:
1. Only analyze what is actually present in the report
2. Use simple, patient-friendly language
3. If no abnormalities are found, state that clearly
4. Do not provide medical diagnoses, only explain what the values mean
5. Always recommend consulting with healthcare providers for medical decisions
6. If the text appears to be an image or contains no medical data, mention that clearly

Provide only the JSON response, no additional text."""

    try:
        # Make request to Ollama
        response = ollama.chat(
            model='llama3.2',
            messages=[
                {
                    'role': 'user',
                    'content': prompt
                }
            ]
        )
        
        # Extract the response content
        response_text = response['message']['content'].strip()
        
        # Try to parse the JSON response
        try:
            # Remove any markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
            
            analysis_result = json.loads(response_text)
            
            # Validate the structure and add missing fields if needed
            if not isinstance(analysis_result.get('key_findings'), list):
                analysis_result['key_findings'] = ["Analysis completed successfully"]
            
            if not isinstance(analysis_result.get('abnormalities'), list):
                analysis_result['abnormalities'] = []
                
            if not isinstance(analysis_result.get('medical_terms'), list):
                analysis_result['medical_terms'] = []
                
            if not isinstance(analysis_result.get('recommendations'), list):
                analysis_result['recommendations'] = []
            
            return analysis_result
            
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON from Ollama response: {e}")
            print(f"Raw response: {response_text}")
            
            # Return a structured response with the raw AI output
            return {
                "type": "medical_report",
                "summary": "AI Analysis completed",
                "key_findings": [response_text[:500] + "..." if len(response_text) > 500 else response_text],
                "abnormalities": [],
                "medical_terms": [],
                "recommendations": ["Please consult with healthcare professionals for detailed interpretation"],
                "ai_raw_response": response_text
            }
            
    except Exception as e:
        print(f"Error calling Ollama: {str(e)}")
        
        # Fallback response when Ollama is not available
        return {
            "type": "medical_report", 
            "summary": f"Medical report processed. AI analysis unavailable: {str(e)}",
            "key_findings": [
                "Report uploaded successfully",
                "AI analysis service temporarily unavailable",
                "Please consult healthcare professionals for interpretation"
            ],
            "abnormalities": [],
            "medical_terms": [],
            "recommendations": [
                "Please consult with qualified healthcare professionals",
                "Keep this report for your medical records",
                "Follow up as recommended by your doctor"
            ],
            "error": str(e)
        }

def analyze_medical_report(file_path: str, language: str = "en") -> Dict[str, Any]:
    """
    Analyze uploaded medical report using Ollama Llama3.2 model.
    This replaces the previous hardcoded implementation.
    """
    
    # Extract text content from the file
    text_content = extract_text_from_file(file_path)
    
    if not text_content or len(text_content.strip()) < 10:
        return {
            "type": "unknown",
            "summary": "Unable to extract meaningful content from the uploaded file",
            "key_findings": ["File processed but content extraction failed"],
            "abnormalities": [],
            "medical_terms": [],
            "recommendations": ["Please ensure the file contains readable medical report data"]
        }
    
    # Use Ollama for analysis
    return analyze_medical_report_with_ollama(text_content, language)

def generate_health_recommendations(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate health and lifestyle recommendations using Ollama based on analysis results.
    """
    
    # Create a prompt for generating recommendations
    analysis_summary = analysis.get("summary", "No analysis available")
    key_findings = analysis.get("key_findings", [])
    abnormalities = analysis.get("abnormalities", [])
    
    prompt = f"""Based on the following medical report analysis, provide health and lifestyle recommendations.

Analysis Summary: {analysis_summary}

Key Findings: {', '.join(key_findings) if key_findings else 'None specified'}

Abnormalities Found: {json.dumps(abnormalities, indent=2) if abnormalities else 'None'}

Please provide recommendations in the following JSON format:
{{
    "lifestyle": [
        "Specific lifestyle recommendations",
        "Exercise recommendations",
        "Sleep and stress management advice"
    ],
    "dietary": [
        "Specific dietary recommendations",
        "Foods to include or avoid",
        "Nutritional guidance"
    ],
    "follow_up": [
        "Medical follow-up recommendations",
        "Monitoring suggestions",
        "When to see a healthcare provider"
    ],
    "priority": "low/medium/high",
    "next_appointment": "Recommended timeline for follow-up"
}}

Important guidelines:
1. Base recommendations only on the provided analysis
2. Use evidence-based health advice
3. Always emphasize consulting healthcare professionals
4. If no abnormalities found, provide general wellness advice
5. Set appropriate priority levels based on findings

Provide only the JSON response, no additional text."""

    try:
        response = ollama.chat(
            model='llama3.2',
            messages=[
                {
                    'role': 'user',
                    'content': prompt
                }
            ]
        )
        
        response_text = response['message']['content'].strip()
        
        # Try to parse the JSON response
        try:
            # Remove any markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
            
            recommendations = json.loads(response_text)
            
            # Validate and ensure required fields
            if not isinstance(recommendations.get('lifestyle'), list):
                recommendations['lifestyle'] = ["Maintain a healthy lifestyle"]
            if not isinstance(recommendations.get('dietary'), list):
                recommendations['dietary'] = ["Follow a balanced diet"]
            if not isinstance(recommendations.get('follow_up'), list):
                recommendations['follow_up'] = ["Consult with healthcare provider"]
            
            if 'priority' not in recommendations:
                recommendations['priority'] = 'medium'
            if 'next_appointment' not in recommendations:
                recommendations['next_appointment'] = 'As recommended by healthcare provider'
            
            return recommendations
            
        except json.JSONDecodeError:
            print(f"Failed to parse recommendations JSON: {response_text}")
            
    except Exception as e:
        print(f"Error generating recommendations with Ollama: {str(e)}")
    
    # Fallback to basic recommendations if Ollama fails
    fallback_recommendations = {
        "lifestyle": [
            "Maintain a balanced diet rich in fruits and vegetables",
            "Exercise regularly - at least 30 minutes of moderate activity daily", 
            "Stay hydrated by drinking 8-10 glasses of water daily",
            "Get adequate sleep (7-9 hours per night)",
            "Manage stress through relaxation techniques"
        ],
        "dietary": [
            "Include a variety of colorful fruits and vegetables",
            "Choose whole grains over processed foods",
            "Limit processed foods and added sugars",
            "Include lean proteins in your diet"
        ],
        "follow_up": [
            "Schedule regular health check-ups as recommended by your doctor",
            "Keep track of any symptoms or changes",
            "Follow your healthcare provider's advice"
        ],
        "priority": "medium",
        "next_appointment": "Follow your healthcare provider's recommendations"
    }
    
    # Customize recommendations based on analysis
    if abnormalities:
        fallback_recommendations["priority"] = "high"
        fallback_recommendations["next_appointment"] = "Recommend follow-up within 1-3 months"
        fallback_recommendations["follow_up"].insert(0, "Discuss findings with your healthcare provider promptly")
    
    return fallback_recommendations

def get_localized_text(key: str, language: str) -> str:
    """
    Get localized text for different languages.
    This is a simplified implementation - in production, use proper i18n libraries.
    """
    
    translations = {
        "en": {
            "report_analyzed": "Medical report successfully analyzed",
            "blood_pressure_normal": "Blood pressure within normal range",
            "cholesterol_slightly_elevated": "Cholesterol levels slightly elevated",
            "glucose_normal": "Blood glucose levels normal",
            "cholesterol_explanation": "A waxy substance that your body needs but too much can be harmful",
            "hdl_explanation": "High-density lipoprotein - 'good' cholesterol that helps remove other forms of cholesterol from bloodstream",
            "ldl_explanation": "Low-density lipoprotein - 'bad' cholesterol that can build up in artery walls",
            "image_analyzed": "Medical image successfully processed",
            "image_quality_good": "Image quality is sufficient for analysis",
            "preliminary_analysis_complete": "Preliminary analysis completed",
            "consult_professional": "Please consult with a healthcare professional for detailed interpretation",
            "file_processed": "File has been processed",
            "basic_analysis_complete": "Basic analysis completed"
        },
        "es": {
            "report_analyzed": "Informe médico analizado exitosamente",
            "blood_pressure_normal": "Presión arterial dentro del rango normal",
            "cholesterol_slightly_elevated": "Niveles de colesterol ligeramente elevados",
            "glucose_normal": "Niveles de glucosa en sangre normales",
            "cholesterol_explanation": "Una sustancia cerosa que su cuerpo necesita pero demasiada puede ser dañina",
            "hdl_explanation": "Lipoproteína de alta densidad - colesterol 'bueno' que ayuda a eliminar otras formas de colesterol del torrente sanguíneo",
            "ldl_explanation": "Lipoproteína de baja densidad - colesterol 'malo' que puede acumularse en las paredes arteriales"
        },
        "fr": {
            "report_analyzed": "Rapport médical analysé avec succès",
            "blood_pressure_normal": "Tension artérielle dans la plage normale",
            "cholesterol_slightly_elevated": "Taux de cholestérol légèrement élevé",
            "glucose_normal": "Taux de glucose sanguin normal"
        }
    }
    
    return translations.get(language, translations["en"]).get(key, f"[{key}]")