import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          fontFamily: "'Press Start 2P', cursive",
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#ff6b6b' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ fontSize: '12px', marginBottom: '20px', maxWidth: '600px', lineHeight: '1.8' }}>
            The application encountered an error. Please try refreshing the page.
          </p>
          {this.state.error && (
            <details style={{ fontSize: '10px', maxWidth: '800px', marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Error Details
              </summary>
              <pre style={{ 
                backgroundColor: '#2a2a2a', 
                padding: '10px', 
                borderRadius: '5px',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '30px',
              padding: '15px 30px',
              fontSize: '14px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: "'Press Start 2P', cursive"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
