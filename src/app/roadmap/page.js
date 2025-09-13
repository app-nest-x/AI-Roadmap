'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const authenticated = localStorage.getItem('authenticated');
    if (!authenticated) {
      router.push('/login');
      return;
    }
    const roadmapData = localStorage.getItem('roadmapData');
    if (roadmapData) {
      try {
        setRoadmap(JSON.parse(roadmapData));
      } catch (error) {
        console.error('Error parsing roadmap data:', error);
        router.push('/chat');
      }
    } else {
      router.push('/chat');
    }
    setLoading(false);
  }, [router]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your roadmap...</p>
        </div>
      </div>
    );
  }
  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Roadmap Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please complete the career conversation first.</p>
          <Link
            href="/chat"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Conversation
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {}
      <header className="relative z-10 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">CareerGuide</span>
            </Link>
            <div className="hidden sm:block w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
            <span className="hidden sm:block text-slate-600 dark:text-slate-400 font-medium">Your Career Roadmap</span>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/chat"
              className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Chat</span>
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Print
            </button>
          </div>
        </div>
      </header>
      {}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Roadmap Generated Successfully
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-slate-200 dark:via-slate-400 dark:to-slate-200 bg-clip-text text-transparent">
              Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {roadmap.career}
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-slate-200 dark:via-slate-400 dark:to-slate-200 bg-clip-text text-transparent text-4xl md:text-5xl">
              Roadmap
            </span>
          </h1>
          {roadmap.summary && (
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8 animate-fade-in">
              {roadmap.summary}
            </p>
          )}
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto mb-8">
            {roadmap.salary && (
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg mb-1 font-bold">$</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Salary</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{roadmap.salary}</div>
              </div>
            )}
            {roadmap.jobMarket && (
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg mb-1 font-bold">%</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Market</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{roadmap.jobMarket}</div>
              </div>
            )}
          </div>
          {}
          {false && roadmap.prerequisites && roadmap.prerequisites.length > 0 && (
            <div className="max-w-4xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Prerequisites</h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.prerequisites.map((prereq, index) => (
                  <span key={index} className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-medium">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}
          {}
          {false && <div className="max-w-md mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span>Progress Overview</span>
              <span>{roadmap.steps.length} Steps</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full w-full transition-all duration-1000"></div>
            </div>
          </div>}
        </div>
        {}
        <div className="space-y-8">
          {roadmap.steps.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
            >
              {}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    {step.title}
                  </h3>
                  {step.timeline && (
                    <div className="flex items-center space-x-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                      <span>Time:</span>
                      <span>{step.timeline}</span>
                    </div>
                  )}
                </div>
              </div>
              {}
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {step.description}
              </p>
              {}
              {step.resources && step.resources.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                    <span className="mr-2">•</span>
                    Resources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {step.resources.map((resource, i) => (
                      <span key={i} className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-md text-sm">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {}
              {step.challenges && step.challenges.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                    <span className="mr-2">•</span>
                    Challenges
                  </h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {step.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {}
              {step.milestones && step.milestones.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                    <span className="mr-2">•</span>
                    Success Milestones
                  </h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {step.milestones.map((milestone, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        {}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-3xl p-12 border border-emerald-200 dark:border-emerald-800">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                You&apos;re All Set!
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Your personalized career roadmap is ready. Each step is designed to build upon the previous one,
                creating a clear path toward your {roadmap.career} goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/chat"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Continue Conversation</span>
                </Link>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl font-semibold border border-slate-300 dark:border-slate-600 transition-all duration-300 transform hover:scale-105"
                >
                  Explore More Careers
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}