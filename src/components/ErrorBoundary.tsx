import { Component, type ErrorInfo, type ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Catches render errors AND failed lazy chunks (e.g. network lost while loading a page).
// Error boundaries must still be class components.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6">
          <ErrorFallback error={this.state.error} onRetry={() => window.location.reload()} />
        </div>
      );
    }
    return this.props.children;
  }
}
