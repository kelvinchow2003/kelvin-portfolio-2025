import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer'; // <-- NEW IMPORT for scroll animations
import { Briefcase, Code, Terminal, Send, Menu, X, Sun, Moon, Link, Github, Zap, Loader, Aperture, Volume2, Download } from 'lucide-react';

// --- TTS UTILITIES (for converting PCM audio from API to playable WAV format) ---

// Utility to convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

// Helper function for writing strings to DataView
const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};

// Utility to wrap PCM data in a WAV container
const pcmToWav = (pcm16, sampleRate) => {
    const numChannels = 1;
    const bytesPerSample = 2; // 16-bit PCM
    const buffer = new ArrayBuffer(44 + pcm16.length * bytesPerSample);
    const view = new DataView(buffer);
    
    writeString(view, 0, 'RIFF'); // RIFF identifier
    view.setUint32(4, 36 + pcm16.length * bytesPerSample, true); // File size
    writeString(view, 8, 'WAVE'); // Format
    writeString(view, 12, 'fmt '); // Format sub-chunk identifier
    view.setUint32(16, 16, true); // Format sub-chunk size (16 for PCM)
    view.setUint16(20, 1, true); // Audio Format (1 for PCM)
    view.setUint16(22, numChannels, true); // Number of channels
    view.setUint32(24, sampleRate, true); // Sample Rate
    view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // Byte Rate
    view.setUint16(32, numChannels * bytesPerSample, true); // Block Align
    view.setUint16(34, bytesPerSample * 8, true); // Bits Per Sample (16-bit)
    writeString(view, 36, 'data'); // Data sub-chunk identifier
    view.setUint32(40, pcm16.length * bytesPerSample, true); // Data sub-chunk size

    // Write PCM data
    let offset = 44;
    for (let i = 0; i < pcm16.length; i++) {
        view.setInt16(offset, pcm16[i], true);
        offset += bytesPerSample;
    }

    return new Blob([view], { type: 'audio/wav' });
};


// --- MOCK DATA ---
const projectsData = [
  {
    id: 1,
    title: "Income Prediction Model",
    description: "Built income classification models using the Adult Income dataset with 5 ML algorithms (SVM, Logistic Regression, etc.). Handled data cleaning, scaling, and feature selection (RFE). Achieved 84% accuracy with SVM.",
    tags: ["Machine Learning", "Python", "Scikit-learn", "Pandas", "Data Mining"],
    githubUrl: "https://kelvinchow2003.github.io/Kelvin/", 
    liveUrl: "#"
  },
  {
    id: 2,
    title: "Laptop Configuration Automation",
    description: "Developed a PowerShell-based solution to streamline pre-domain setup for Windows 11 desktops and laptops. Automated critical tasks like system configuration, updates, firewall management, and application deployment, reducing manual setup time.",
    tags: ["PowerShell", "Automation", "Windows", "IT Operations"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 3,
    title: "AI-Powered Financial Modeler (Mock)",
    description: "Mock project showcasing full-stack application leveraging a powerful LLM API for real-time market analysis and structured data generation. Demonstrates skills in modern full-stack development and cloud integration.",
    tags: ["React", "TypeScript", "LLM API", "Firestore", "Tailwind CSS"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 4,
    title: "Real-Time Collaborative Editor (Mock)",
    description: "Mock project demonstrating CRDT implementation using WebSockets for real-time collaboration across multiple users without data loss, highlighting proficiency in backend concurrency and data structures.",
    tags: ["Node.js", "WebSockets", "CRDT", "MongoDB", "React"],
    githubUrl: "#",
    liveUrl: "#"
  }
];

const experienceData = [
  {
    id: 1,
    year: "May 2025 - Present",
    title: "System Support Engineer",
    company: "Toronto Parking Authority (GreenP)",
    details: "Delivered L1, L2, and L3 technical support, assisted with cybersecurity (CrowdStrike, Symantec), and developed automation scripts (Intune, PowerShell) to streamline system configuration and improve operational efficiency. Participated in AI-driven customer support solutions (Co-pilot, Power Apps).",
    logoUrl: "https://placehold.co/60x60/10b981/ffffff?text=TPA" // Placeholder URL for TPA
  },
  {
    id: 2,
    year: "Sept 2023 - Sept 2024",
    title: "Junior Developer",
    company: "Green and Spiegel LLP",
    details: "Designed and implemented a secure client intake web portal (AWS, Rest API) and automated dynamic PDF generation using SQL, Python, and Java, which reduced manual workload by 53%. Contributed to code optimization through thorough code reviews.",
    logoUrl: "https://placehold.co/60x60/10b981/ffffff?text=G&S" // Placeholder URL for Green and Spiegel
  },
  {
    id: 3,
    year: "May 2023 - Sept 2023",
    title: "Information Technology Co-op",
    company: "Bothwell Accurate Co. Inc.",
    details: "Provided comprehensive technical support (resolving over 200 issues) and automated onboarding processes for new employees by developing and deploying robust shell scripts, significantly streamlining IT operations.",
    logoUrl: "https://placehold.co/60x60/10b981/ffffff?text=BA" // Placeholder URL for Bothwell Accurate
  },
  {
    id: 4,
    year: "April 2021 - Present",
    title: "Bachelors of Science Computer Science Co-op",
    company: "Toronto Metropolitan University",
    details: "Engaged in advanced coursework and projects in algorithms, data structures, machine learning, and software development. Collaborated on team projects using Agile methodologies and version control (Git).",
    logoUrl: "https://placehold.co/60x60/10b981/ffffff?text=BA" // Placeholder URL for TMU
  },
  {
    id: 5,
    year: "Sept 2019 - Present",
    title: "Aquatic Supervisor II",
    company: "City Of Markham",
    details: "Managed aquatic safety operations, supervised staff, and ensured compliance with health and safety regulations at community pools. Developed leadership and crisis management skills in a dynamic environment.",
    logoUrl: "https://placehold.co/60x60/10b981/ffffff?text=BA" // Placeholder URL for City of Markham
  },
];

const skillGroups = {
    "Languages & Core": ["Python", "Java", "C", "SQL", "Javascript", "HTML", "CSS"],
    "Frameworks & Data": ["React", "Scikit-learn", "Pandas", "Jupyter", "Django/Flask (Mock)"],
    "DevOps & Automation": ["PowerShell", "Bash", "GIT", "Active Directory", "Intune", "Docker (Mock)"], 
    "Cloud & Tools": ["AWS Cloud Practitioner", "Azure AI (In-progress)", "Firestore (Mock)", "Office 365", "Co-pilot", "Power Apps"],
};

// --- Custom Components ---

/**
 * LinkedIn Icon Component (Custom SVG) - MEMOIZED
 */
const LinkedIn = React.memo(({ size = 24, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        {/* The path defines the shape of the LinkedIn icon */}
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.565-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
));


/**
 * Reusable Section Wrapper - MEMOIZED
 */
const Section = React.memo(({ id, children, title }) => {
  // Setup intersection observer hook
  const { ref, inView } = useInView({
    triggerOnce: true, // Animation plays only once
    threshold: 0.1,    // Starts when 10% of the section is visible
  });

  // Base animation classes: Fade in and slide up slightly
  const animationClasses = `transition-all duration-1000 ease-out 
    ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;

  return (
    // Border changes from gray (light) to emerald (dark)
    <section 
      id={id} 
      ref={ref} // Attach the ref to the section
      className="min-h-screen py-20 px-6 sm:px-10 lg:px-20 border-t border-gray-200/50 dark:border-gray-700/30 flex flex-col justify-center"
    >
      {/* Apply animation to the content wrapper */}
      <div className={`max-w-7xl mx-auto w-full ${animationClasses}`}> 
        {/* Header gradient flips from Purple (light) to Emerald (dark) */}
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-600 dark:from-emerald-400 dark:to-cyan-500 tracking-tight transition-colors duration-500">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
});


/**
 * Project Detail Modal Component (Not Memoized due to state and complex props)
 */
const ProjectModal = ({ project, onClose, isDark }) => {
// ... (Component logic remains the same)
  const [insightText, setInsightText] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState(null);

  if (!project) return null;

  // Define color classes based on the current mode
  const tagClasses = isDark
    ? "px-3 py-1 text-sm font-medium text-emerald-300 bg-emerald-900/40 rounded-full border border-emerald-700/50"
    : "px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100/80 rounded-full border border-indigo-500/50";
    
  const buttonDark = "flex items-center space-x-2 px-6 py-3 bg-gray-700/50 text-white rounded-full hover:bg-gray-600/70 transition duration-200 border border-gray-600/50 backdrop-blur-sm";
  const buttonLight = "flex items-center space-x-2 px-6 py-3 bg-gray-900/80 text-white rounded-full hover:bg-gray-800/90 transition duration-200 border border-gray-800/50 backdrop-blur-sm";
  const llmButtonClass = `flex items-center space-x-2 px-6 py-3 font-semibold rounded-full transition duration-300 transform hover:scale-[1.02] active:scale-95 backdrop-blur-sm 
    ${isDark 
      ? 'bg-cyan-700/70 text-white hover:bg-cyan-600/80 shadow-cyan-500/30 border border-cyan-500/50' 
      : 'bg-indigo-700/70 text-white hover:bg-indigo-600/80 shadow-indigo-500/30 border border-indigo-500/50'}`;


  const generateProjectInsight = async () => {
    setInsightLoading(true);
    setInsightText('');
    setInsightError(null);
    
    const userPrompt = `Based on the following project title and description, generate a one-paragraph, high-impact summary focusing on the strategic business value, future scalability, or innovative aspects.

    Title: ${project.title}
    Description: ${project.description}
    `;

    const systemPrompt = "You are a senior technology writer. Provide a persuasive, professional summary (1 paragraph, max 6 sentences) without mentioning the original title or description. Use sophisticated, business-oriented language.";
    
    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    let response = null;
    let success = false;
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries && !success) {
        try {
            const delay = Math.pow(2, attempt) * 1000;
            if (attempt > 0) { await new Promise(resolve => setTimeout(resolve, delay)); }
            
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                success = true;
                break;
            } else if (response.status === 429 || response.status >= 500) {
                attempt++;
                if (attempt >= maxRetries) throw new Error("API failed after multiple retries.");
            } else {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

        } catch (err) {
            console.error(err);
            setInsightError(`Error generating insight: ${err.message}`);
            break; 
        }
    }

    if (success && response) {
        try {
            const resultJson = await response.json();
            const text = resultJson.candidates?.[0]?.content?.parts?.[0]?.text || "Generation failed. Please try again.";
            setInsightText(text);

        } catch (parseError) {
            setInsightError(`Failed to process API response: ${parseError.message}`);
        }
    } else if (!success) {
        setInsightError("The API request failed.");
    }
    
    setInsightLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 dark:bg-white/70 backdrop-blur-lg transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        // UPDATED: More pronounced backdrop blur for the modal
        className="relative w-full max-w-4xl p-8 bg-white/10 dark:bg-gray-800/90 rounded-2xl shadow-2xl transform scale-95 md:scale-100 transition-transform duration-300 border border-violet-500/30 dark:border-emerald-500/30 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white dark:text-gray-900 hover:text-emerald-400 dark:hover:text-indigo-600 transition"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h3 className="text-3xl font-bold text-white dark:text-gray-900 mb-4">{project.title}</h3>
        <p className="text-lg text-gray-200 dark:text-gray-800 mb-6">{project.description}</p> 

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map(tag => (
            <span key={tag} className={tagClasses}>
              {tag}
            </span>
          ))}
        </div>

        {/* LLM Insight Generator */}
        <div className="p-4 bg-gray-700/20 dark:bg-gray-700/50 rounded-lg mb-6 border border-gray-600/30 dark:border-gray-600/70">
            <h4 className="text-xl font-semibold text-white mb-3">Project Insight (LLM Demo)</h4>
            
            <div className="min-h-[50px]">
                {insightLoading && (
                    <div className="flex items-center text-white/80">
                        <Loader size={16} className="animate-spin mr-2" />
                        Generating professional insight...
                    </div>
                )}
                {insightError && <p className="text-red-300 text-sm">{insightError}</p>}
                {insightText && <p className="text-gray-100 text-sm italic">{insightText}</p>}
                {!insightLoading && !insightText && !insightError && (
                    <button onClick={generateProjectInsight} className={llmButtonClass} disabled={insightLoading}>
                        <Aperture size={20} className="mr-1" />
                        ✨ Generate Strategic Insight
                    </button>
                )}
            </div>
        </div>

        <div className="flex space-x-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={isDark ? buttonDark : buttonLight}
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-violet-600/80 dark:bg-emerald-600/70 text-white font-semibold rounded-full hover:bg-violet-500/90 dark:hover:bg-emerald-500/80 transition duration-200 border border-violet-500/50 dark:border-emerald-500/50 backdrop-blur-sm"
          >
            <Link size={20} />
            <span>View Live</span>
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * TTS Player Component - MEMOIZED
 */
const TtsPlayer = React.memo(({ text, voice, isDark }) => {
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [error, setError] = useState(null);
    const audioRef = useRef(null);
    
    const accentColor = isDark ? 'emerald' : 'violet';

    const playAudio = async () => {
        if (audioUrl) {
            audioRef.current.play();
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            contents: [{
                parts: [{ text: text }]
            }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voice }
                    }
                }
            },
            model: "gemini-2.5-flash-preview-tts"
        };
        
        const apiKey = "AIzaSyDEJ_43E-5MxHXo52KhSM66g6ieHcZd0_A";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`TTS API failed with status ${response.status}`);
            }

            const result = await response.json();
            const part = result?.candidates?.[0]?.content?.parts?.[0];
            const audioData = part?.inlineData?.data;
            const mimeType = part?.inlineData?.mimeType;

            if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
                const match = mimeType.match(/rate=(\d+)/);
                const sampleRate = match ? parseInt(match[1], 10) : 24000;
                
                const pcmData = base64ToArrayBuffer(audioData);
                const pcm16 = new Int16Array(pcmData);
                
                const wavBlob = pcmToWav(pcm16, sampleRate);
                const url = URL.createObjectURL(wavBlob);
                
                setAudioUrl(url);
                if (audioRef.current) {
                    audioRef.current.src = url;
                    audioRef.current.play();
                }
            } else {
                setError("Invalid audio format received from API.");
            }
        } catch (err) {
            console.error("TTS Error:", err);
            setError(`Failed to generate audio: ${err.message}.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inline-block">
            <button
                onClick={playAudio}
                className={`flex items-center space-x-2 px-4 py-3 text-lg font-semibold bg-gray-600/50 dark:bg-gray-700/50 text-white rounded-full transition duration-300 transform hover:scale-[1.02] active:scale-95 border border-gray-500/50 backdrop-blur-sm shadow-md shadow-gray-700/50
                    ${loading ? 'opacity-70 cursor-not-allowed' : `hover:bg-${accentColor}-600/70`}`}
                disabled={loading}
            >
                {loading ? (
                    <Loader size={20} className="animate-spin" />
                ) : (
                    <Volume2 size={20} />
                )}
                <span>{audioUrl ? 'Replay' : 'Read Aloud'}</span>
            </button>
            <audio ref={audioRef} onEnded={() => { /* Optional: Reset state */ }} style={{ display: 'none' }} />
            {error && <p className="text-red-500 dark:text-red-300 text-xs mt-2">{error}</p>}
        </div>
    );
});

// --- AI ASSISTANT COMPONENT (Uses Gemini API) (Not Memoized) ---
const AiAssistantDemo = ({ isDark }) => {
// ... (Component logic remains the same)
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "AIzaSyDEJ_43E-5MxHXo52KhSM66g6ieHcZd0_A";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    const systemPrompt = "You are a professional technical assistant. Answer the user's question concisely and professionally. Focus on technology, data, or career advice. If asked a general knowledge question, use the search tool to ground your response.";
    
    const payload = {
        contents: [{ parts: [{ text: query }] }],
        // Enable Google Search grounding
        tools: [{ "google_search": {} }], 
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    let response = null;
    let success = false;
    let attempt = 0;
    const maxRetries = 5;

    // Exponential Backoff implementation
    while (attempt < maxRetries && !success) {
        try {
            const delay = Math.pow(2, attempt) * 1000;
            if (attempt > 0) { await new Promise(resolve => setTimeout(resolve, delay)); }
            
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                success = true;
                break;
            } else if (response.status === 429 || response.status >= 500) {
                // Retry for rate limiting (429) or server errors (5xx)
                attempt++;
                if (attempt >= maxRetries) throw new Error(`API failed after ${maxRetries} attempts.`);
            } else {
                // Don't retry for client errors (4xx) other than 429
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

        } catch (err) {
            setError(`Failed to fetch response: ${err.message}`);
            break; 
        }
    }

    if (success && response) {
        try {
            const resultJson = await response.json();
            const text = resultJson.candidates?.[0]?.content?.parts?.[0]?.text || "No meaningful response received.";
            
            let sources = [];
            const groundingMetadata = resultJson.candidates?.[0]?.groundingMetadata;
            if (groundingMetadata && groundingMetadata.groundingAttributions) {
                sources = groundingMetadata.groundingAttributions
                    .map(attr => ({ uri: attr.web?.uri, title: attr.web?.title }))
                    .filter(source => source.uri && source.title);
            }
            
            setResult({ text, sources });

        } catch (parseError) {
            setError(`Failed to process API response: ${parseError.message}`);
        }
    } else if (!success) {
        setError("The API failed to return a valid response after multiple attempts.");
    }
    
    setLoading(false);
  };

  const accentColor = isDark ? 'emerald' : 'violet';

  return (
    // UPDATED: Increased Blur/Transparency for Glassmorphism
    <div className="p-8 **bg-white/50** dark:bg-gray-900/40 rounded-xl shadow-xl space-y-6 border border-gray-200 dark:border-gray-700/20 **backdrop-blur-xl**">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <Aperture className={`mr-3 text-${accentColor}-600`} size={24} />
        LLM Assistant Demo
      </h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a technical question (e.g., 'What is CRDT?')" 
          className={`w-full p-3 border border-gray-300 dark:border-gray-600/30 rounded-lg bg-white dark:bg-gray-900/90 text-gray-900 dark:text-white focus:ring-${accentColor}-500 focus:border-${accentColor}-500 transition backdrop-blur-sm`} 
          disabled={loading}
        />
        <button
          type="submit"
          className={`w-full px-6 py-3 font-semibold bg-${accentColor}-600/90 text-white rounded-lg hover:bg-${accentColor}-500/80 transition duration-200 shadow-md shadow-${accentColor}-500/40 border border-${accentColor}-500/50 backdrop-blur-sm flex items-center justify-center`}
          disabled={loading}
        >
          {loading ? (
            <Loader size={20} className="animate-spin mr-2" />
          ) : (
            <Send size={20} className="mr-2" />
          )}
          {loading ? 'Generating...' : 'Get Answer'}
        </button>
      </form>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700/50">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Response:</h4>
        {error && <p className="text-sm text-red-500">{error}</p>}
        
        {result ? (
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{result.text}</p>
            {result.sources.length > 0 && (
                <div className="pt-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sources:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
                        {result.sources.slice(0, 3).map((source, index) => (
                            <li key={index} className={`truncate text-${accentColor}-600 hover:underline dark:text-${accentColor}-400`}>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer">
                                    {source.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Results will appear here.</p>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  // Start in dark mode as requested
  const [isDark, setIsDark] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Apply dark/light class to body
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // STABILIZE HANDLERS WITH useCallback
  const toggleDark = useCallback(() => setIsDark(prev => !prev), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  // Smooth scroll handler - STABILIZED WITH useCallback
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Use stable setter form
    setIsMenuOpen(false); 
  }, []);

  // --- HEADER & NAVIGATION - MEMOIZED ---
  const Header = React.memo(() => (
    // Header background is light/dark, border is light/dark
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/50 dark:bg-gray-900/10 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-4 flex justify-between items-center">
        {/* Logo text color flips */}
        <a href="#" className="text-2xl font-black text-gray-900 dark:text-white transition-colors duration-200">
          <span className="text-violet-600 dark:text-emerald-500">K.</span> CHOW
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              // Text color flips from dark gray (light) to light gray (dark)
              // Hover color flips from indigo (light) to emerald (dark)
              className="text-gray-600 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-emerald-400 transition-colors duration-200 text-sm tracking-wide uppercase"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={toggleDark}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-emerald-400 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
           <button
            onClick={toggleDark}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-emerald-400 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/20 transition"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900/10 backdrop-blur-lg transition-all duration-300 border-t border-gray-200 dark:border-gray-800/20">
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-500/10 dark:hover:bg-emerald-500/10 hover:text-indigo-600 dark:hover:text-emerald-400 rounded-lg font-medium transition duration-200"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  ));

  // --- HERO SECTION - MEMOIZED ---
  const Hero = React.memo(() => (
    <Section id="hero" title="Hi, I'm Kelvin Chow.">
      <div className="flex flex-col lg:flex-row items-center justify-between mt-10 space-y-10 lg:space-y-0 lg:space-x-12">
        <div className="lg:w-3/5">
          {/* Main title text and accent color flip */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
            Driving <span className="text-violet-600 dark:text-emerald-400">Efficiency</span> through Automation & Data.
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 dark:text-white mb-10 max-w-lg"> 
            A Computer Science Co-op student at Toronto Metropolitan University specializing in **IT Support, Software Development, and Machine Learning**.
          </p>
          {/* Button color flips */}
          <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('#projects')}
                className="flex items-center space-x-2 px-8 py-3 text-lg font-semibold bg-violet-600/90 dark:bg-emerald-600/80 text-white rounded-full shadow-lg hover:bg-violet-500/90 dark:hover:bg-emerald-500/90 transition duration-300 transform hover:scale-[1.02] active:scale-95 shadow-violet-500/50 dark:shadow-emerald-500/50 border border-violet-500/50 dark:border-emerald-500/50 backdrop-blur-sm"
              >
                <Zap size={20} />
                <span>View My Work</span>
              </button>
              
              {/* TTS API FEATURE */}
              <TtsPlayer 
                  text="This is Kelvin Chow, a Computer Science Co-op student specializing in IT Support, Software Development, and Machine Learning. I drive efficiency through automation and data."
                  voice="Kore"
                  isDark={isDark}
              />
          </div>
        </div>
        <div className="lg:w-2/5 flex justify-center">
          {/* Circle border and shadow flip */}
<div
  className="group w-64 h-64 sm:w-80 sm:h-80
             bg-gray-200/50 dark:bg-gray-700/20
             rounded-full flex items-center justify-center
             border-8 border-violet-500/30 dark:border-emerald-500/30
             shadow-[0_0_80px_-15px_rgba(109,40,217,0.5)]
             dark:shadow-[0_0_80px_-15px_rgba(16,185,129,0.5)]
             backdrop-blur-md overflow-hidden relative
             transition-transform duration-500 ease-in-out hover:scale-[1.03]" // <-- ADDED HOVER ANIMATION
>
  <img 
    src="./profile.jpg" 
    alt="Profile Picture" 
    className="rounded-full w-full h-full object-cover" 
  />

  {/* This will now align perfectly with the inner edge of the border-8 */}
  <span
    className="pointer-events-none absolute inset-0 rounded-full
               ring-0 group-hover:ring-8
               ring-violet-500/10 dark:ring-emerald-400/10
               transition-all duration-500"
  />

</div>
        </div>
      </div>
    </Section>
  ));

// --- ABOUT SECTION - MEMOIZED ---
const About = React.memo(() => (
    <Section id="about" title="About Me">
      <div className="grid lg:grid-cols-2 gap-12 text-lg">
        
        {/* UPDATED: Added hover effects to the first card */}
        <div className="p-6 bg-white/50 dark:bg-gray-900/40 rounded-xl 
             border border-gray-200 dark:border-gray-700/20 
             shadow-xl dark:shadow-2xl backdrop-blur-xl 
             transition duration-300 
             hover:shadow-violet-500/30 dark:hover:shadow-emerald-500/30 
             hover:border-violet-500/30 dark:hover:border-emerald-500/30"> {/* <-- NEW CLASSES ADDED */}
          
          <p className="mb-6 text-gray-700 dark:text-white"> 
            I am a highly motivated BSc. in Computer Science Co-op student with experience across **System Support, full-stack development, and data-driven projects**. My core expertise lies in developing robust automation scripts (PowerShell, Bash) and leveraging languages like **Python, Java, and SQL** to solve real-world operational challenges.
          </p>
          <p className="text-gray-700 dark:text-white"> 
            I excel in environments that demand both technical troubleshooting and strategic software implementation, demonstrated by my work in automating PDF generation (reducing workload by 53%) and implementing secure web portals. I am dedicated to continuous learning, currently pursuing the AWS Data Engineer and Azure AI Engineer certifications.
          </p>
        </div>

        {/* UPDATED: Added hover effects to the second card */}
        <div className="p-6 bg-white/50 dark:bg-gray-900/40 rounded-xl 
             border border-gray-200 dark:border-gray-700/20 
             shadow-xl dark:shadow-2xl backdrop-blur-xl 
             transition duration-300
             hover:shadow-violet-500/30 dark:hover:shadow-emerald-500/30 
             hover:border-violet-500/30 dark:hover:border-emerald-500/30"> {/* <-- NEW CLASSES ADDED */}
          
          <h4 className="text-2xl font-bold mb-4 text-violet-600 dark:text-emerald-400">Key Qualifications</h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-white space-y-2">
            <li>Bachelor Honours BSc. in Computer Science Co-op, Toronto Metropolitan University (Dean's List).</li>
            <li>Certifications: AWS Cloud Practitioner, Azure AI Engineer (In-progress).</li>
            <li>Relevant Courses: Data Structures, AI, ML, Algorithms, Data Science and Mining, Statistics, Computer Networks.</li>
          </ul>
        </div>
      </div>
    </Section>
  ));

  // --- SKILLS SECTION - MEMOIZED ---
  const Skills = React.memo(() => (
    <Section id="skills" title="Technical Arsenal">
      <div className="space-y-12">
        {Object.entries(skillGroups).map(([group, skills]) => (
          <div key={group}>
            {/* Group header icon/text color flip */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center space-x-3">
                <Terminal size={24} className="text-violet-600 dark:text-emerald-400" />
                <span>{group}</span>
            </h3>
            <div className="flex flex-wrap gap-4">
              {skills.map(skill => (
                <span
                  key={skill}
                  // ADDED: hover:shadow-2xl for depth, enhanced pill background opacity
                  className="px-5 py-2.5 **bg-gray-100/70** dark:bg-gray-800/90 text-gray-800 dark:text-white font-medium rounded-lg shadow-inner border border-gray-300 dark:border-gray-700/20 backdrop-blur-sm transition duration-300 hover:bg-violet-500/30 dark:hover:bg-emerald-500/30 hover:text-gray-900 dark:hover:text-white hover:scale-105 **hover:shadow-2xl**"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  ));

  // --- EXPERIENCE SECTION (Timeline) - MEMOIZED ---
const Experience = React.memo(() => (
    <Section id="experience" title="Professional History">
      {/* Container for the new split timeline layout */}
      <div className="relative"> 
        {/* Central Vertical Line (Darker, more pronounced) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 dark:bg-gray-700/30 h-full hidden md:block" aria-hidden="true"></div>
        
        {/* Use a simple line on mobile, since the split layout won't work */}
        <div className="absolute left-3 w-1 bg-gray-300 dark:bg-gray-700/30 h-full md:hidden" aria-hidden="true"></div>
        
        {experienceData.map((item, index) => {
          // Determine side for split layout (left for even index, right for odd)
          const isLeft = index % 2 === 0;
          const containerClasses = isLeft 
            ? "md:pr-10 md:text-right" 
            : "md:pl-10 md:text-left";
          const cardClasses = isLeft 
            ? "md:ml-auto md:w-[calc(50%-2rem)]" // Left side, pushed to the right boundary
            : "md:mr-auto md:w-[calc(50%-2rem)]"; // Right side, pushed to the left boundary

          return (
            <div key={item.id} className="relative mb-12 md:flex items-center">
                
                {/* Timeline Dot (Visible on all screens) */}
                <div 
                    className={`absolute z-10 flex items-center justify-center w-8 h-8 rounded-full bg-violet-600 dark:bg-emerald-500 
                                ring-8 ring-white dark:ring-gray-900/50 backdrop-blur-sm shadow-lg
                                ${isLeft ? 'md:left-1/2 md:-translate-x-1/2 md:-ml-4 left-0 -translate-x-1/2 ml-4' : 'md:left-1/2 md:-translate-x-1/2 md:ml-4 left-0 -translate-x-1/2 ml-4'}`}
                >
                    <Briefcase size={18} className="text-white" />
                </div>

                {/* Content Container */}
                <div className={`w-full ${containerClasses}`}>
                    {/* The main card with Glassmorphism and Hover Effects */}
                    <div 
                        className={`mt-4 md:mt-0 ${cardClasses} 
                                   p-6 rounded-lg shadow-xl dark:shadow-2xl backdrop-blur-xl 
                                   bg-white/50 dark:bg-gray-900/40 
                                   border border-gray-200 dark:border-gray-700/20 
                                   transition duration-300 hover:shadow-violet-500/30 dark:hover:shadow-emerald-500/30 
                                   hover:border-violet-500/30 dark:hover:border-emerald-500/30`}
                    >
                        <time className={`block mb-2 text-sm font-normal leading-none text-indigo-600/80 dark:text-emerald-400/80 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                            {item.year}
                        </time>
                        
                        <div className={`flex items-start ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                            
                            {/* Company Logo Section */}
                            {item.logoUrl && (
                                <img 
                                    src={item.logoUrl} 
                                    alt={`${item.company} logo`}
                                    className={`w-12 h-12 object-contain rounded-lg flex-shrink-0 
                                                border border-violet-500/30 dark:border-emerald-500/30
                                                ${isLeft ? 'md:ml-4 mr-4' : 'md:mr-4 mr-4'}`}
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src="https://placehold.co/48x48/34D399/000000?text=Logo"; 
                                    }}
                                />
                            )}
                            
                            {/* Text Details */}
                            <div className="flex-grow"> 
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {item.title} at {item.company}
                                </h3>
                                <p className="text-base font-normal text-gray-700 dark:text-white mt-1"> 
                                    {item.details}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </Section>
));

  // --- PROJECTS SECTION - MEMOIZED ---
  const Projects = React.memo(() => (
    <Section id="projects" title="Showcase">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projectsData.map(project => (
          <div
            key={project.id}
            // UPDATED: Increased Blur/Transparency for Glassmorphism
            className="**bg-white/50** dark:bg-gray-900/40 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/20 transition duration-300 hover:shadow-violet-500/30 dark:hover:shadow-emerald-500/30 hover:border-violet-500/30 dark:hover:border-emerald-500/30 cursor-pointer flex flex-col justify-between **backdrop-blur-xl**"
            onClick={() => setSelectedProject(project)}
          >
            <div>
                {/* Text color flip */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                <p className="text-gray-700 dark:text-white mb-4 line-clamp-3">{project.description}</p> 
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs font-semibold px-3 py-1 bg-violet-100/70 text-violet-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full border border-violet-700/50 dark:border-emerald-700/50">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4">
                {/* Button link color flip */}
                <button className="text-violet-600 dark:text-emerald-400 hover:text-violet-500 dark:hover:text-emerald-300 font-semibold flex items-center space-x-1">
                    <span>View Details</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  ));

  // --- CONTACT / AI DEMO SECTION - MEMOIZED ---
  const Contact = React.memo(({ isDark }) => (
    <Section id="contact" title="Get In Touch & API Demo">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-lg text-gray-700 dark:text-white"> 
            I'm currently seeking new opportunities in Software Development or IT/System Engineering for my next co-op term. Feel free to reach out via email or connect on LinkedIn!
          </p>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 border-l-4 pl-3 border-violet-500 dark:border-emerald-500">
            Below is a functional demonstration of API integration using the Gemini LLM for real-time, grounded technical assistance.
          </p>
          <div className="space-y-4">
            {/* UPDATED: Added mailto: to open default mail app */}
            <a href="mailto:kelvinchow2014@gmail.com" className="flex items-center space-x-3 text-gray-700 dark:text-white hover:text-violet-600 dark:hover:text-emerald-400 transition">
              <Send size={20} className="text-violet-600 dark:text-emerald-400" />
              <span>kelvinchow2014@gmail.com</span>
            </a>
            
            <div className="flex flex-wrap gap-4 items-center">
                {/* Social Links */}
                <a href="https://github.com/kelvinchow2003" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-violet-600 dark:hover:text-emerald-400 transition">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/kelchow/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-violet-600 dark:hover:text-emerald-400 transition">
                  <LinkedIn size={24} /> 
                </a>
                
                {/* NEW: Download Resume Button */}
                <a
                  href="./Resume - Kelvin Chow.pdf" 
                  download="Resume - Kelvin Chow.pdf"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-violet-600/90 dark:bg-emerald-600/80 text-white rounded-full shadow-lg hover:bg-violet-500/90 dark:hover:bg-emerald-500/90 transition duration-300 transform hover:scale-[1.02] active:scale-95 shadow-violet-500/50 dark:shadow-emerald-500/50 border border-violet-500/50 dark:border-emerald-500/50 backdrop-blur-sm"
                >
                  <Download size={18} />
                  <span>Download Resume</span>
                </a>
            </div>
          </div>
        </div>
        
        {/* API Integration Demo Component */}
        <AiAssistantDemo isDark={isDark} />
      </div>
    </Section>
  ));

  // --- FOOTER - MEMOIZED ---
  const Footer = React.memo(() => (
    <footer className="bg-white/50 dark:bg-gray-900/10 border-t border-gray-200 dark:border-gray-800/20 py-8 px-6 sm:px-10 lg:px-20 backdrop-blur-md">
      {/* Footer text color flip */}
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-500">
        <p>&copy; {new Date().getFullYear()} Kelvin Chow. Built with React and Tailwind CSS. All rights reserved.</p>
      </div>
    </footer>
  ));

  return (
    // Main container background gradient flips. Default (no dark:) is light.
    <div className={`min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-500 font-sans relative`}>
        {/* Background color overlay flips from Indigo/Violet (light) to Emerald/Cyan (dark) */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://source.unsplash.com/random/1600x900/?abstract,geometric')] bg-cover bg-center"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-900/10 to-indigo-900/10 dark:from-emerald-900/20 dark:to-cyan-900/20 transition-colors duration-500"></div>

        <Header />
        <main className="pt-20 relative z-10">
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Contact isDark={isDark} /> {/* PASSED PROP isDark */}
        </main>
        <Footer />

        {/* Complex Modal Renders Here */}
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} isDark={isDark} />
    </div>
  );
};

export default App;