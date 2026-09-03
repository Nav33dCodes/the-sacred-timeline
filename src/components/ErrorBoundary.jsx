import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * Catches render errors so one broken section can't blank the whole site.
 * Class component because React has no hook equivalent.
 */
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[SacredTimeline] render error:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="status-page">
        <p className="status-page__code">ERR</p>
        <h1 className="status-page__title">Timeline Fracture</h1>
        <p className="status-page__body">
          Something broke while rendering this branch of the timeline. Reloading usually
          resolves it.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button type="button" className="btn btn-primary btn-sheen" onClick={() => window.location.reload()}>
            Reload
          </button>
          <Link to="/" className="btn btn-ghost">
            Back to safety
          </Link>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
