#!/usr/bin/env python3

import sys
sys.path.append('/root/MedicalAI/backend')

from utils import analyze_medical_report
import json

# Test the analysis function
print("Testing Ollama integration for medical report analysis...")
print("="*50)

try:
    # Test with our sample report
    result = analyze_medical_report('/root/MedicalAI/backend/test_report.txt', 'en')
    
    print("Analysis Result:")
    print(json.dumps(result, indent=2))
    
except Exception as e:
    print(f"Error during analysis: {str(e)}")
    import traceback
    traceback.print_exc()