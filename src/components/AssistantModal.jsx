import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  MessageCircle,
  BookOpen,
  Code2,
  GraduationCap,
  Award,
  User,
  ExternalLink,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { usePortfolioSearch } from '../hooks/usePortfolioSearch';

// ---------------------------------------------------------------------------
// Suggested questions
// ---------------------------------------------------------------------------

const SUGGESTED_QUESTIONS = [
  'What projects use React?',
  'Which project uses Docker?',
  'What is your strongest backend project?',
  'Explain your architecture.',
  'What technologies do you work with?',
  'What did you learn building your projects?',
  'Tell me about your skills',
  'What is your background?',
];

// ---------------------------------------------------------------------------
// Type icons
// ---------------------------------------------------------------------------

const TYPE_ICONS = {
  project: Code2,
  skill: Code2,
  profile: User,
  education: GraduationCap,
  certification: Award,
};

const TYPE_LABELS = {
  project: 'Project',
  skill: 'Skill',
  profile: 'Profile',
  education: 'Education',
  certification: 'Certification',
};

// ---------------------------------------------------------------------------
// Result highlight (bold matching tokens)
// ---------------------------------------------------------------------------

const HighlightedText = ({ text, query }) => {
  if (!query || query.length < 2) return <>{text}</>;

  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) return <>{text}</>;

  // Create a regex that matches any token
  const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) =>
        tokens.includes(part.toLowerCase()) ? (
          <strong key={i} style={{ color: 'var(--color-neon-blue)', fontWeight: 600 }}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// Focus trap hook
// ---------------------------------------------------------------------------

function useFocusTrap(modalRef, isOpen) {
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;

    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length > 0) {
      // Focus the search input
      const input = modal.querySelector('input');
      if (input) input.focus();
      else focusable[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleKeyDown);
    return () => modal.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
}

// ---------------------------------------------------------------------------
// Assistant Modal
// ---------------------------------------------------------------------------

const AssistantModal = ({ isOpen, onClose, onOpenProject }) => {
  const { query, results, total, loading, error, search, clear } = usePortfolioSearch();

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const modalContentRef = useRef(null);

  // Focus trap
  useFocusTrap(modalContentRef, isOpen);

  // Escape to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Debounced search: update the hook query 250ms after the user stops typing
  const debounceRef = useRef(null);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        search(value);
      }, 250);
    },
    [search],
  );

  // Clear input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      clear();
    }
  }, [isOpen, clear]);

  const handleSuggestedQuestion = useCallback(
    (question) => {
      setInputValue(question);
      search(question);
      if (inputRef.current) inputRef.current.focus();
    },
    [search],
  );

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  // Empty state suggestions
  const showSuggestions = query.length < 2 && !loading;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="asst-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio assistant"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9997,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '80px 1rem 1rem',
            overflowY: 'auto',
          }}
        >
          <motion.div
            ref={modalContentRef}
            key="asst-content"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: 'rgba(12, 12, 12, 0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              position: 'relative',
              backdropFilter: 'blur(24px)',
              outline: 'none',
            }}
          >
            {/* --- Header --- */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={18} color="white" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>
                    Portfolio Assistant
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    Ask me anything about my work
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close assistant"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* --- Search input --- */}
            <div style={{ padding: '1rem 1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0 14px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'border-color 0.2s',
                }}
              >
                <Search size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Ask a question..."
                  aria-label="Search portfolio"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                  }}
                />
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <Loader2 size={16} style={{ color: 'var(--color-text-muted)' }} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* --- Content area --- */}
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              {/* --- Suggested questions (when no query) --- */}
              {showSuggestions && (
                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      color: 'var(--color-text-muted)',
                      marginBottom: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Suggested questions
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {SUGGESTED_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => handleSuggestedQuestion(question)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.06)',
                          cursor: 'pointer',
                          color: 'var(--color-text-muted)',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s',
                          fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                          e.currentTarget.style.color = 'var(--color-text-muted)';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MessageCircle size={14} style={{ flexShrink: 0 }} />
                          {question}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* --- Results (when query is active) --- */}
              {!showSuggestions && (
                <>
                  {/* Results header */}
                  {!loading && query.length >= 2 && (
                    <p
                      style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        color: 'var(--color-text-muted)',
                        marginBottom: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {results.length > 0
                        ? `${total} result${total !== 1 ? 's' : ''} for "${query}"`
                        : `No results for "${query}"`}
                    </p>
                  )}

                  {/* Loading */}
                  {loading && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '2rem',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <Loader2 size={16} />
                      </motion.div>
                      Searching...
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <p
                      style={{
                        padding: '1rem',
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                      }}
                    >
                      Search failed. Please try again.
                    </p>
                  )}

                  {/* Result list */}
                  {!loading && !error && results.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {results.map((doc) => {
                        const Icon = TYPE_ICONS[doc.type] || BookOpen;
                        const typeLabel = TYPE_LABELS[doc.type] || 'Document';

                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => {
                              if (doc.type === 'project' && onOpenProject) {
                                onOpenProject(doc.metadata?.repoName);
                              }
                            }}
                            style={{
                              textAlign: 'left',
                              width: '100%',
                              padding: '12px 14px',
                              borderRadius: '12px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              cursor: doc.type === 'project' && onOpenProject ? 'pointer' : 'default',
                              transition: 'all 0.2s',
                              fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => {
                              if (doc.type === 'project' && onOpenProject) {
                                e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            }}
                          >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                              {/* Type icon */}
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  background: `${doc.metadata?.color || '#ef4444'}15`,
                                  border: `1px solid ${doc.metadata?.color || '#ef4444'}30`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <Icon
                                  size={14}
                                  color={doc.metadata?.color || '#ef4444'}
                                />
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Title row */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginBottom: '2px',
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: '0.85rem',
                                      fontWeight: 600,
                                      color: 'white',
                                    }}
                                  >
                                    <HighlightedText text={doc.title} query={query} />
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.65rem',
                                      padding: '1px 6px',
                                      borderRadius: '6px',
                                      background: 'rgba(255,255,255,0.06)',
                                      color: 'var(--color-text-muted)',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {typeLabel}
                                  </span>
                                </div>

                                {/* Summary */}
                                <p
                                  style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--color-text-muted)',
                                    lineHeight: '1.4',
                                    margin: 0,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <HighlightedText text={doc.summary} query={query} />
                                </p>

                                {/* Tag chips */}
                                {doc.tags.length > 0 && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: '4px',
                                      marginTop: '6px',
                                    }}
                                  >
                                    {doc.tags.slice(0, 4).map((tag) => (
                                      <span
                                        key={tag}
                                        style={{
                                          fontSize: '0.65rem',
                                          padding: '1px 6px',
                                          borderRadius: '6px',
                                          background: 'rgba(255,255,255,0.04)',
                                          color: 'rgba(255,255,255,0.5)',
                                        }}
                                      >
                                        <HighlightedText text={tag} query={query} />
                                      </span>
                                    ))}
                                    {doc.tags.length > 4 && (
                                      <span
                                        style={{
                                          fontSize: '0.65rem',
                                          color: 'var(--color-text-muted)',
                                        }}
                                      >
                                        +{doc.tags.length - 4}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* External link indicator for projects */}
                              {doc.type === 'project' && (
                                <ExternalLink
                                  size={14}
                                  style={{
                                    color: 'var(--color-text-muted)',
                                    flexShrink: 0,
                                    marginTop: '8px',
                                  }}
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Empty results */}
                  {!loading && !error && query.length >= 2 && results.length === 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '2rem',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                      }}
                    >
                      <BookOpen size={32} style={{ opacity: 0.3 }} />
                      <p>Try a different question or browse the sections above.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssistantModal;
