"""
Test script for the Phishing Detection API
Tests various endpoints and scenarios
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:5000"

# Test URLs
TEST_URLS = {
    'legitimate': [
        "https://www.google.com",
        "https://github.com",
        "https://www.amazon.com",
        "https://www.stackoverflow.com",
    ],
    'phishing': [
        "http://google.com@attacker.com",
        "http://192.168.1.1/admin",
        "http://verify-paypal.com/login",
        "http://update-amazon-account.com",
    ]
}


def test_health_check():
    """Test health endpoint"""
    print("\n" + "="*60)
    print("TEST: Health Check")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_single_prediction():
    """Test single URL prediction"""
    print("\n" + "="*60)
    print("TEST: Single URL Prediction")
    print("="*60)
    
    try:
        data = {"url": "https://www.google.com"}
        response = requests.post(f"{BASE_URL}/predict", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_multiple_predictions():
    """Test multiple URLs prediction"""
    print("\n" + "="*60)
    print("TEST: Multiple URLs Prediction")
    print("="*60)
    
    try:
        urls = TEST_URLS['legitimate'] + TEST_URLS['phishing']
        data = {"urls": urls}
        response = requests.post(f"{BASE_URL}/predict", json=data)
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Total URLs: {len(result.get('results', []))}")
        
        for res in result.get('results', [])[:3]:
            print(f"\n  URL: {res['url']}")
            print(f"  Phishing: {res['is_phishing']}")
            print(f"  Confidence: {res['confidence']:.2%}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_batch_prediction():
    """Test batch prediction"""
    print("\n" + "="*60)
    print("TEST: Batch Prediction")
    print("="*60)
    
    try:
        urls = TEST_URLS['legitimate'] + TEST_URLS['phishing']
        data = {"urls": urls}
        response = requests.post(f"{BASE_URL}/batch", json=data)
        print(f"Status Code: {response.status_code}")
        result = response.json()
        
        summary = result.get('summary', {})
        print(f"Total URLs: {summary.get('total', 0)}")
        print(f"Phishing: {summary.get('phishing', 0)}")
        print(f"Legitimate: {summary.get('legitimate', 0)}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_legitimate_urls():
    """Test detection of legitimate URLs"""
    print("\n" + "="*60)
    print("TEST: Legitimate URLs Detection")
    print("="*60)
    
    try:
        data = {"urls": TEST_URLS['legitimate']}
        response = requests.post(f"{BASE_URL}/predict", json=data)
        result = response.json()
        
        correct = 0
        for res in result.get('results', []):
            if not res['is_phishing']:
                correct += 1
            print(f"  {res['url']}: {'✅' if not res['is_phishing'] else '❌'}")
        
        accuracy = correct / len(result.get('results', [])) if result.get('results') else 0
        print(f"\nAccuracy on legitimate URLs: {accuracy:.1%}")
        return accuracy > 0.8
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_phishing_urls():
    """Test detection of phishing URLs"""
    print("\n" + "="*60)
    print("TEST: Phishing URLs Detection")
    print("="*60)
    
    try:
        data = {"urls": TEST_URLS['phishing']}
        response = requests.post(f"{BASE_URL}/predict", json=data)
        result = response.json()
        
        correct = 0
        for res in result.get('results', []):
            if res['is_phishing']:
                correct += 1
            print(f"  {res['url']}: {'✅' if res['is_phishing'] else '❌'}")
        
        accuracy = correct / len(result.get('results', [])) if result.get('results') else 0
        print(f"\nAccuracy on phishing URLs: {accuracy:.1%}")
        return accuracy > 0.8
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_error_handling():
    """Test error handling"""
    print("\n" + "="*60)
    print("TEST: Error Handling")
    print("="*60)
    
    try:
        # Test 1: No data
        print("\n1. Empty request:")
        response = requests.post(f"{BASE_URL}/predict", json={})
        print(f"   Status: {response.status_code} - {response.json()['error']}")
        
        # Test 2: Invalid data
        print("\n2. Invalid data:")
        response = requests.post(f"{BASE_URL}/predict", json={"invalid": "field"})
        print(f"   Status: {response.status_code} - {response.json()['error']}")
        
        # Test 3: Too many URLs
        print("\n3. Too many URLs (limit is 100):")
        response = requests.post(f"{BASE_URL}/predict", json={"urls": ["url"] * 101})
        print(f"   Status: {response.status_code} - {response.json()['error']}")
        
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False


def run_all_tests():
    """Run all tests"""
    print("\n" + "="*70)
    print("PHISHING DETECTION API - TEST SUITE")
    print("="*70)
    
    tests = [
        ("Health Check", test_health_check),
        ("Single Prediction", test_single_prediction),
        ("Multiple Predictions", test_multiple_predictions),
        ("Batch Prediction", test_batch_prediction),
        ("Legitimate URLs", test_legitimate_urls),
        ("Phishing URLs", test_phishing_urls),
        ("Error Handling", test_error_handling),
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
            time.sleep(0.5)  # Small delay between requests
        except Exception as e:
            print(f"Test failed with error: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    print("="*70)


if __name__ == "__main__":
    print("\nMake sure the API server is running (python api_server.py)")
    print("Press Enter to start tests...")
    input()
    
    run_all_tests()
