import { useState } from 'react';
import { Search, X, MessageCircle, Ticket, Clock } from 'lucide-react';

import FAQList     from '../../components/support/FAQList';
import TicketForm  from '../../components/support/TicketForm';
import SupportChat from '../../components/support/SupportChat';
import { QUICK_LINKS } from '../../mocks/supportData';

const HelpSupport = () => {

  // Search query and ticket modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [showTicket,  setShowTicket]  = useState(false);

  // Clear search input
  const clearSearch = () => setSearchQuery('');

  // Set search query from quick link click
  const applyQuickLink = (link) => setSearchQuery(link);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1">

          {/* Hero section with search bar and quick links */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-6 pt-10 pb-10 text-center relative overflow-hidden">
            
            <div className="absolute -top-10 -left-10  w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5  rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              {/* Online status badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-white text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Support team online
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                How can we help you?
              </h1>
              <p className="text-blue-200 mb-6 text-sm md:text-base">
                Search our knowledge base or reach out to our team
              </p>

              {/* Search input with clear button */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full py-3.5 pl-12 pr-12 bg-white rounded-2xl text-sm text-gray-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick link buttons */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {QUICK_LINKS.map(link => (
                  <button
                    key={link}
                    onClick={() => applyQuickLink(link)}
                    className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-full transition-all border border-white/20"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

            {/* FAQ section heading */}
            <div className="text-center py-4">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-gray-400">
                Find quick answers to common questions
              </p>
            </div>

            {/* FAQ list with search and category filter */}
            <FAQList searchQuery={searchQuery} onClearSearch={clearSearch} />

            {/* Still need help section */}
            <div>
              <div className="text-center mb-5">
                <h2 className="text-xl font-black text-gray-900">Still need help?</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Our support team is available Mon–Fri, 8 AM – 6 PM
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Live Chat card */}
                <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 mb-1">Live Chat</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Fastest way to get help. Chat with our support team instantly.
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs font-semibold text-green-600">~2 min wait time</span>
                      </div>
                      {/* Fire custom event to open SupportChat widget */}
                      <button
                        onClick={() => document.dispatchEvent(new CustomEvent('open-support-chat'))}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all"
                      >
                        Start Chat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Ticket card */}
                <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Ticket className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 mb-1">Submit a Ticket</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        For detailed issues that need investigation by our team.
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs font-semibold text-green-600">Responds within 24 hours</span>
                      </div>
                      <button
                        onClick={() => setShowTicket(true)}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all"
                      >
                        Open Ticket
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>

      </div>

      {/* Floating chat widget */}
      <SupportChat />

      {/* Ticket modal — shown when Open Ticket is clicked */}
      {showTicket && <TicketForm onClose={() => setShowTicket(false)} />}
    </div>
  );
};

export default HelpSupport;