import { useState, useEffect } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp,
  AlertCircle, User, CreditCard, Briefcase,
} from 'lucide-react';

import { MOCK_FAQS, FAQ_CATEGORIES } from '../../mocks/supportData';


const CAT_ICON = {
  account:  <User       className="w-4 h-4" />,
  payments: <CreditCard className="w-4 h-4" />,
  jobs:     <Briefcase  className="w-4 h-4" />,
  workers:  <User       className="w-4 h-4" />,
  general:  <HelpCircle className="w-4 h-4" />,
};

// Single expandable FAQ row
const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${
    isOpen ? 'border-blue-200 bg-blue-50/40' : 'border-gray-200 bg-white'
  }`}>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
    >
      <div className="flex items-center gap-3 min-w-0">
        <HelpCircle className={`w-4 h-4 flex-shrink-0 ${isOpen ? 'text-blue-600' : 'text-gray-400'}`} />
        <span className={`text-sm font-semibold ${isOpen ? 'text-blue-700' : 'text-gray-800'}`}>
          {faq.question}
        </span>
      </div>
      {/* Toggle chevron */}
      {isOpen
        ? <ChevronUp   className="w-4 h-4 text-blue-600 flex-shrink-0" />
        : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
      }
    </button>
    {/* Answer — shown when open */}
    {isOpen && (
      <div className="px-5 pb-5 pl-12">
        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
      </div>
    )}
  </div>
);

const FAQList = ({ searchQuery = '', onClearSearch }) => {
  const [activeCategory, setCategory] = useState('all');
  const [openFAQ,        setOpenFAQ]  = useState(null);

  // Reset category and open item when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setCategory('all');
      setOpenFAQ(null);
    }
  }, [searchQuery]);

  // Switch category and collapse any open FAQ
  const handleCategory = (id) => { setCategory(id); setOpenFAQ(null); };

  // Toggle open/close for a single FAQ item
  const toggleFAQ = (id) => setOpenFAQ(prev => prev === id ? null : id);

  // Filter by category and search query including tags
  const filtered = MOCK_FAQS.filter(faq => {
    const matchCat = activeCategory === 'all' || faq.category === activeCategory;
    if (!searchQuery.trim()) return matchCat;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)   ||
      (faq.tags || []).some(tag => tag.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

      {/* Header with result count */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-400">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-1 px-4 py-3 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {FAQ_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.id !== 'all' && CAT_ICON[cat.id]}
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ items or empty state */}
      <div className="p-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No results found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search term or category</p>
            {/* Clear filters button */}
            {onClearSearch && (
              <button
                onClick={() => { onClearSearch(); setCategory('all'); }}
                className="mt-4 text-xs text-blue-600 font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filtered.map(faq => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openFAQ === faq.id}
              onToggle={() => toggleFAQ(faq.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FAQList;