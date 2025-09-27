import React, { useState, useCallback } from 'react';
import { Upload, FileText, Briefcase, Target, CheckCircle, AlertCircle, Lightbulb, Loader2, X, Zap, Star, TrendingUp } from 'lucide-react';

const App = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setResumeFile(files[0]);
      setError('');
    } else {
      setError('Please upload a PDF file only.');
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError('');
    } else {
      setError('Please select a PDF file.');
      setResumeFile(null);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setResumeFile(null);
    setError('');
  };

  // Analyze resume
  const analyzeResume = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload a resume and enter a job description.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('job_description', jobDescription);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError('Unexpected response format.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please ensure the backend is running on port 8000.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get score color based on percentage
  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-400 via-green-500 to-teal-600';
    if (score >= 60) return 'from-yellow-400 via-amber-500 to-orange-500';
    if (score >= 40) return 'from-orange-400 via-orange-500 to-red-500';
    return 'from-red-400 via-red-500 to-pink-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <Star className="h-6 w-6 text-emerald-600" />;
    if (score >= 60) return <TrendingUp className="h-6 w-6 text-amber-600" />;
    if (score >= 40) return <Zap className="h-6 w-6 text-orange-600" />;
    return <AlertCircle className="h-6 w-6 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Target className="h-16 w-16 text-cyan-400 mr-4 animate-pulse" />
                <div className="absolute inset-0 h-16 w-16 bg-cyan-400/30 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ResuMatch
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 animate-fade-in-up">
              Get AI-powered insights to match your resume with any job description
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload and Input Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* File Upload */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-500 animate-slide-in-left">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-cyan-400 mr-3 animate-pulse" />
              <h2 className="text-2xl font-bold text-white">Upload Resume</h2>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all duration-500 transform hover:scale-105 ${
                dragOver 
                  ? 'border-cyan-400 bg-cyan-400/20 scale-105' 
                  : resumeFile 
                    ? 'border-emerald-400 bg-emerald-400/20' 
                    : 'border-gray-400/50 hover:border-purple-400 hover:bg-purple-400/10'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {resumeFile ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-16 w-16 text-emerald-400 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">{resumeFile.name}</p>
                    <p className="text-gray-300 mt-2">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="inline-flex items-center px-6 py-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-300 transform hover:scale-105 border border-red-500/30"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-xl font-semibold text-white mb-2">
                      Drop your PDF resume here
                    </p>
                    <p className="text-gray-300">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    <Upload className="h-6 w-6 mr-3" />
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-500 animate-slide-in-right">
            <div className="flex items-center mb-6">
              <Briefcase className="h-8 w-8 text-purple-400 mr-3 animate-pulse" />
              <h2 className="text-2xl font-bold text-white">Job Description</h2>
            </div>
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 md:h-64 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-300 hover:bg-white/20"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8 animate-fade-in-up">
          <button
            onClick={analyzeResume}
            disabled={loading || !resumeFile || !jobDescription.trim()}
            className="relative inline-flex items-center px-12 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-full font-bold text-xl hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            {loading ? (
              <>
                <Loader2 className="h-8 w-8 mr-3 animate-spin" />
                <span className="animate-pulse">Analyzing...</span>
              </>
            ) : (
              <>
                <Target className="h-8 w-8 mr-3 group-hover:animate-spin transition-transform duration-300" />
                Analyze Resume
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-xl p-4 mb-8 animate-shake">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-400 mr-3 animate-pulse" />
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Match Score */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20 text-center">
              <div className="flex items-center justify-center mb-8">
                {getScoreIcon(analysis.match_percentage)}
                <h2 className="text-3xl md:text-4xl font-bold text-white ml-3">Match Score</h2>
              </div>
              <div className="flex items-center justify-center mb-8">
                <div className={`relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${getScoreColor(analysis.match_percentage)} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 animate-pulse-slow`}>
                  <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="text-4xl md:text-6xl font-bold text-white animate-number-count">
                      {Math.round(analysis.match_percentage)}%
                    </span>
                  </div>
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getScoreColor(analysis.match_percentage)} animate-spin-slow opacity-30`}></div>
                </div>
              </div>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                {analysis.match_percentage >= 80 
                  ? '🎉 Excellent match! Your resume aligns very well with this job.'
                  : analysis.match_percentage >= 60
                    ? '👍 Good match! Consider the suggestions below to improve.'
                    : analysis.match_percentage >= 40
                      ? '⚠️ Moderate match. Focus on the missing skills and suggestions.'
                      : '🔧 Low match. Significant improvements needed for this role.'}
              </p>
            </div>

            {/* Analysis Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Matching Skills */}
              <div className="bg-emerald-500/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-500 transform hover:scale-105 animate-slide-in-left">
                <div className="flex items-center mb-6">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mr-3 animate-pulse" />
                  <h3 className="text-xl md:text-2xl font-bold text-white">Matching Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.matching_skills && analysis.matching_skills.length > 0 ? (
                    analysis.matching_skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-block bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/30 hover:bg-emerald-500/30 transition-all duration-300 transform hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No matching skills identified</p>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-500 transform hover:scale-105 animate-slide-in-up">
                <div className="flex items-center mb-6">
                  <AlertCircle className="h-8 w-8 text-red-400 mr-3 animate-pulse" />
                  <h3 className="text-xl md:text-2xl font-bold text-white">Missing Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_skills && analysis.missing_skills.length > 0 ? (
                    analysis.missing_skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-block bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-medium border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 transform hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No missing skills identified</p>
                  )}
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="bg-cyan-500/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 transform hover:scale-105 animate-slide-in-right">
                <div className="flex items-center mb-6">
                  <Lightbulb className="h-8 w-8 text-cyan-400 mr-3 animate-pulse" />
                  <h3 className="text-xl md:text-2xl font-bold text-white">Suggestions</h3>
                </div>
                <div className="space-y-4">
                  {analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0 ? (
                    analysis.improvement_suggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="bg-cyan-500/20 backdrop-blur-sm p-4 rounded-xl border-l-4 border-cyan-400 hover:bg-cyan-500/30 transition-all duration-300 transform hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <p className="text-cyan-100 font-medium">{suggestion}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No suggestions available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes number-count {
          from { transform: scale(0.8); }
          to { transform: scale(1); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-number-count {
          animation: number-count 0.5s ease-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default App;