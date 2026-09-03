import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const NotFound = () => (
  <PageTransition>
    <div className="status-page">
      <p className="status-page__code">404</p>
      <h1 className="status-page__title">Pruned from the timeline</h1>
      <p className="status-page__body">
        This branch does not exist. The TVA has no record of whatever you were looking for.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary btn-sheen">
          Return to the Sacred Timeline
        </Link>
        <Link to="/browse" className="btn btn-ghost btn-sheen">
          Browse the archive
        </Link>
      </div>
    </div>
  </PageTransition>
);

export default NotFound;
