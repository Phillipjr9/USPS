import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time crashes so a single broken component
 * doesn't blank the entire application.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-md w-full p-8 text-center">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <h1 className="text-xl font-black text-usps-darker">Something went wrong</h1>
          <p className="text-sm text-slate-600 mt-2">
            This page ran into an unexpected error. Reloading usually fixes it.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-usps-blue hover:bg-usps-dark text-white font-bold py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Reload
            </button>
            <a
              href="#/"
              onClick={() => this.setState({ hasError: false })}
              className="flex-1 border-2 border-slate-200 hover:border-slate-400 text-slate-700 font-bold py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" /> Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
