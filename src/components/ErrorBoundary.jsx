import { Component } from 'react';

/**
 * ErrorBoundary — catches render/lifecycle errors anywhere below it and shows
 * a styled fallback instead of a blank white screen, so the site can never be
 * "crashed" into an unresponsive state by a runtime error.
 *
 * Security note: the fallback is intentionally plain (no error text or stack
 * traces rendered to the DOM) to avoid leaking internal details to visitors.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to the console for debugging, but never render the details.
    console.error('[ErrorBoundary] A runtime error was caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            gap: '1.25rem',
            background: 'var(--color-bg, #0a0a0a)',
            color: '#fff',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ fontSize: '3rem', lineHeight: 1 }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ maxWidth: '420px', margin: 0, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            An unexpected error interrupted this page. Reloading usually fixes it right away.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              border: 'none',
              background: '#ef4444',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'filter 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none';
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
