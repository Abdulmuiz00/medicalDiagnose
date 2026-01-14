import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Brain, Copyright } from 'lucide-react';

const DiagnosisAssistant = () => {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Medical knowledge base
  const knowledgeBase = {
    'covid-19': {
      symptoms: ['fever', 'cough', 'headache', 'fatigue', 'loss of taste', 'loss of smell', 'shortness of breath'],
      evidence: 'Fever and cough are common COVID-19 symptoms. Headache often accompanies viral infections.'
    },
    'influenza': {
      symptoms: ['fever', 'cough', 'headache', 'body aches', 'fatigue', 'chills'],
      evidence: 'High fever with cough and body aches are classic influenza symptoms.'
    },
    'common cold': {
      symptoms: ['cough', 'runny nose', 'sore throat', 'sneezing', 'headache'],
      evidence: 'Runny nose and sneezing are typical cold symptoms without high fever.'
    },
    'migraine': {
      symptoms: ['headache', 'nausea', 'sensitivity to light', 'visual disturbances'],
      evidence: 'Severe headache with sensitivity to light suggests migraine.'
    },
    'allergies': {
      symptoms: ['sneezing', 'runny nose', 'itchy eyes', 'cough'],
      evidence: 'Sneezing with itchy eyes indicates allergic reaction.'
    }
  };

  const calculateMatch = (disease, userSymptoms) => {
    const diseaseSymptoms = knowledgeBase[disease].symptoms;
    const matches = userSymptoms.filter(s => 
      diseaseSymptoms.some(ds => ds.includes(s) || s.includes(ds))
    );
    return (matches.length / diseaseSymptoms.length) * 100;
  };

  const getDiagnosis = () => {
    setLoading(true);
    
    setTimeout(() => {
      const userSymptoms = symptoms.toLowerCase().split(',').map(s => s.trim());
      const diagnoses = [];

      Object.keys(knowledgeBase).forEach(disease => {
        const matchPercentage = calculateMatch(disease, userSymptoms);
        if (matchPercentage > 0) {
          diagnoses.push({
            disease: disease.toUpperCase().replace('-', '-'),
            match: Math.round(matchPercentage),
            evidence: knowledgeBase[disease].evidence
          });
        }
      });

      diagnoses.sort((a, b) => b.match - a.match);
      setResults(diagnoses.slice(0, 5));
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symptoms.trim()) {
      getDiagnosis();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <header className="bg-neutral-900 shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-white">Medical Diagnosis Assistant</h1>
          </div>
          <p className="text-gray-200 mt-2">Enter your symptoms to get possible diagnoses</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Enter Your Symptoms
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Separate multiple symptoms with commas (e.g., fever, cough, headache)
            </p>
            <div className="flex flex-col md:flex-row lg:flex-row gap-3">
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && symptoms.trim() && handleSubmit(e)}
                placeholder="fever, cough, headache"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !symptoms.trim()}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Analyzing...' : 'Get Diagnosis'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Analyzing symptoms...</p>
          </div>
        )}

        {results && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CheckCircle className="w-7 h-7 text-green-600" />
              Diagnosis Suggestions
            </h2>
            
            {results.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No matching diagnoses found. Try different symptoms.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {result.disease}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-3xl font-bold text-blue-600">
                            {result.match}%
                          </span>
                          <p className="text-sm text-gray-500">match</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-linear-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.match}%` }}
                      ></div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Evidence:</p>
                      <p className="text-gray-600">{result.evidence}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This is a demonstration tool for educational purposes only. 
                Always consult with qualified healthcare professionals for medical advice and diagnosis.
              </p>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">How It Works</h3>
            <ol className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Enter your symptoms separated by commas</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Click "Get Diagnosis" to analyze</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Review possible diagnoses with match percentages</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span>See evidence explaining each suggestion</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Behind the Scenes</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <strong>Database:</strong> Knowledge graph storing medical facts and symptom-disease relationships
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <strong>Algorithms:</strong> Code that reasons about symptoms and calculates disease probability matches
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <strong>Interface:</strong> React-based UI that processes requests and displays results instantly
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className='max-w-6xl mx-auto px-4 py-6 '>
        <h1 className='text-white flex items-center gap-3'>Designed by Dev Abdulmuiz <Copyright size={20}/> </h1>
      </footer>
    </div>
  );
};

export default DiagnosisAssistant;