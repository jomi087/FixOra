import React  from "react";
import { toast } from "react-toastify";
import ErrorPage from "../pages/ErrorPage";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error :", error, errorInfo);
    toast.error(error.message);
  }


  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage msg={this.state.error?.message} />
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
