import { useState, useEffect } from 'react'

interface ForkedIdea {
  id: string
  originalIdea: string
  yourPlan: string
  status: 'forked' | 'building' | 'shipped'
  timestamp: number
}

const SAMPLE_IDEAS = [
  "Someone should build an app that tells you if a restaurant is actually good based on local reviews only",
  "What if there was a tool that converts voice memos into structured notes automatically",
  "We need a browser extension that hides all engagement metrics on social media",
  "Imagine an app that matches you with accountability partners for specific goals",
  "There should be a service that sends you physical mail reminders for important digital stuff",
]

export default function App() {
  const [ideaInput, setIdeaInput] = useState('')
  const [planInput, setPlanInput] = useState('')
  const [forkedIdeas, setForkedIdeas] = useState<ForkedIdea[]>(() => {
    const saved = localStorage.getItem('forkedIdeas')
    return saved ? JSON.parse(saved) : []
  })
  const [isClonking, setIsClonking] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'forge' | 'workshop'>('forge')

  useEffect(() => {
    localStorage.setItem('forkedIdeas', JSON.stringify(forkedIdeas))
  }, [forkedIdeas])

  const handleFork = () => {
    if (!ideaInput.trim() || !planInput.trim()) return
    
    setIsClonking(true)
    
    setTimeout(() => {
      const newIdea: ForkedIdea = {
        id: Date.now().toString(),
        originalIdea: ideaInput.trim(),
        yourPlan: planInput.trim(),
        status: 'forked',
        timestamp: Date.now(),
      }
      
      setForkedIdeas(prev => [newIdea, ...prev])
      setIdeaInput('')
      setPlanInput('')
      setIsClonking(false)
      setShowSuccess(true)
      
      setTimeout(() => setShowSuccess(false), 2000)
    }, 300)
  }

  const updateStatus = (id: string, status: ForkedIdea['status']) => {
    setForkedIdeas(prev => 
      prev.map(idea => idea.id === id ? { ...idea, status } : idea)
    )
  }

  const deleteIdea = (id: string) => {
    setForkedIdeas(prev => prev.filter(idea => idea.id !== id))
  }

  const loadSampleIdea = () => {
    const randomIdea = SAMPLE_IDEAS[Math.floor(Math.random() * SAMPLE_IDEAS.length)]
    setIdeaInput(randomIdea)
  }

  const getStatusColor = (status: ForkedIdea['status']) => {
    switch (status) {
      case 'forked': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'building': return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'shipped': return 'bg-[#c8ff00]/20 text-[#c8ff00] border-[#c8ff00]/50'
    }
  }

  return (
    <div className="min-h-screen noise-bg grid-pattern relative">
      <div className="scanline fixed inset-0 pointer-events-none z-50" />
      
      {/* Header */}
      <header className="border-b-2 border-[#333] relative">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔨</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-space">
                  <span className="text-[#c8ff00]">IDEA</span> CLONKER
                </h1>
                <p className="text-xs text-neutral-500 tracking-widest uppercase mt-1">
                  Fork ideas. Zero excuses.
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-xs text-neutral-600">
              <span className="inline-block w-2 h-2 bg-[#c8ff00] rounded-full animate-pulse" />
              <span>SYSTEMS ONLINE</span>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            <button
              onClick={() => setActiveTab('forge')}
              className={`px-4 py-2 text-sm font-bold tracking-wider transition-all ${
                activeTab === 'forge'
                  ? 'bg-[#c8ff00] text-black'
                  : 'bg-[#1a1a1a] text-neutral-400 hover:text-white border border-[#333]'
              }`}
            >
              ⚡ FORGE
            </button>
            <button
              onClick={() => setActiveTab('workshop')}
              className={`px-4 py-2 text-sm font-bold tracking-wider transition-all relative ${
                activeTab === 'workshop'
                  ? 'bg-[#c8ff00] text-black'
                  : 'bg-[#1a1a1a] text-neutral-400 hover:text-white border border-[#333]'
              }`}
            >
              🔧 WORKSHOP
              {forkedIdeas.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff6b35] text-white text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {forkedIdeas.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {activeTab === 'forge' && (
          <div className="space-y-8" style={{ animation: 'slideIn 0.3s ease-out' }}>
            {/* Hero Section */}
            <div className="card-industrial p-6 md:p-8 relative corner-mark">
              <div className="absolute top-4 right-4 text-xs text-neutral-600 font-mono">
                v1.0.0
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Stop talking. Start <span className="text-[#c8ff00]">CLONKING</span>.
              </h2>
              <p className="text-neutral-400 text-sm md:text-base max-w-2xl">
                Grab any "idea guy" post, fork it into your workshop, and actually build it.
                No more "someone should make this" — <span className="text-[#c8ff00]">YOU</span> make it.
              </p>
              
              <button
                onClick={loadSampleIdea}
                className="mt-4 text-xs text-neutral-500 hover:text-[#c8ff00] transition-colors underline underline-offset-4"
              >
                → Load a sample idea to fork
              </button>
            </div>

            {/* Input Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Idea */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-400">
                  <span className="text-[#c8ff00]">01</span>
                  THE IDEA (paste it)
                </label>
                <textarea
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  placeholder='"Someone should build an app that..."'
                  className="w-full h-40 bg-[#0f0f0f] border-2 border-[#333] p-4 text-sm resize-none placeholder:text-neutral-600 transition-all"
                />
              </div>

              {/* Your Plan */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-400">
                  <span className="text-[#c8ff00]">02</span>
                  YOUR PLAN (how you'll build it)
                </label>
                <textarea
                  value={planInput}
                  onChange={(e) => setPlanInput(e.target.value)}
                  placeholder="MVP in 2 weeks: Start with a simple CLI tool, then add web UI..."
                  className="w-full h-40 bg-[#0f0f0f] border-2 border-[#333] p-4 text-sm resize-none placeholder:text-neutral-600 transition-all"
                />
              </div>
            </div>

            {/* Fork Button */}
            <div className="flex justify-center">
              <button
                onClick={handleFork}
                disabled={!ideaInput.trim() || !planInput.trim() || isClonking}
                className={`clonk-btn px-8 py-4 bg-[#c8ff00] text-black font-bold text-lg tracking-wider disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none transition-all ${
                  isClonking ? 'animate-stamp' : ''
                }`}
              >
                {isClonking ? '⚡ CLONKING...' : '🔨 FORK IT + CLONK'}
              </button>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="forked-badge px-8 py-4 text-2xl font-bold">
                  ✓ FORKED
                </div>
              </div>
            )}

            {/* Motivational Banner */}
            <div className="border-2 border-dashed border-[#333] p-6 text-center">
              <p className="text-neutral-500 text-sm">
                "Ideas are worthless. Execution is everything."
              </p>
              <p className="text-[#c8ff00] font-bold mt-2 text-lg">
                ZERO EXCUSES LEFT.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'workshop' && (
          <div className="space-y-6" style={{ animation: 'slideIn 0.3s ease-out' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Your <span className="text-[#c8ff00]">Workshop</span>
                <span className="text-neutral-500 text-sm font-normal ml-2">
                  ({forkedIdeas.length} ideas forked)
                </span>
              </h2>
            </div>

            {forkedIdeas.length === 0 ? (
              <div className="card-industrial p-12 text-center">
                <div className="text-4xl mb-4">🔧</div>
                <p className="text-neutral-500">Workshop is empty.</p>
                <p className="text-neutral-600 text-sm mt-2">
                  Go fork some ideas and get building.
                </p>
                <button
                  onClick={() => setActiveTab('forge')}
                  className="mt-4 text-[#c8ff00] text-sm hover:underline"
                >
                  → Go to Forge
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {forkedIdeas.map((idea, index) => (
                  <div
                    key={idea.id}
                    className="idea-card card-industrial p-5 border-l-4 border-l-[#c8ff00]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(idea.status)}`}>
                            {idea.status.toUpperCase()}
                          </span>
                          <span className="text-neutral-600 text-xs">
                            {new Date(idea.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">ORIGINAL IDEA:</p>
                            <p className="text-sm text-neutral-300 italic">"{idea.originalIdea}"</p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">YOUR PLAN:</p>
                            <p className="text-sm text-white">{idea.yourPlan}</p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="text-neutral-600 hover:text-red-500 transition-colors text-lg"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-[#333]">
                      <button
                        onClick={() => updateStatus(idea.id, 'forked')}
                        className={`px-3 py-1 text-xs font-bold transition-all ${
                          idea.status === 'forked'
                            ? 'bg-yellow-500/30 text-yellow-400'
                            : 'bg-[#1a1a1a] text-neutral-500 hover:text-yellow-400'
                        }`}
                      >
                        📋 FORKED
                      </button>
                      <button
                        onClick={() => updateStatus(idea.id, 'building')}
                        className={`px-3 py-1 text-xs font-bold transition-all ${
                          idea.status === 'building'
                            ? 'bg-orange-500/30 text-orange-400'
                            : 'bg-[#1a1a1a] text-neutral-500 hover:text-orange-400'
                        }`}
                      >
                        🔨 BUILDING
                      </button>
                      <button
                        onClick={() => updateStatus(idea.id, 'shipped')}
                        className={`px-3 py-1 text-xs font-bold transition-all ${
                          idea.status === 'shipped'
                            ? 'bg-[#c8ff00]/30 text-[#c8ff00]'
                            : 'bg-[#1a1a1a] text-neutral-500 hover:text-[#c8ff00]'
                        }`}
                      >
                        🚀 SHIPPED
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {forkedIdeas.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-[#1a1a1a] border border-[#333] p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {forkedIdeas.filter(i => i.status === 'forked').length}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">FORKED</div>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {forkedIdeas.filter(i => i.status === 'building').length}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">BUILDING</div>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] p-4 text-center">
                  <div className="text-2xl font-bold text-[#c8ff00]">
                    {forkedIdeas.filter(i => i.status === 'shipped').length}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">SHIPPED</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222] mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-neutral-600 text-xs tracking-wide">
            Requested by <a href="https://twitter.com/0xPaulius" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-[#c8ff00] transition-colors">@0xPaulius</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-[#c8ff00] transition-colors">@clonkbot</a>
          </p>
        </div>
      </footer>
    </div>
  )
}