import React from 'react'

interface Props {
    children: React.ReactNode
}

interface State {
    hasError: boolean;
    error: Error | null;
}
export default class ErrorBoundary extends React.Component<Props,State>{
  constructor(props: Props){
   super(props);
   this.state = { hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error:Error, errorInfo:React.ErrorInfo){
    console.error('Error caught by boundary:',error,errorInfo);
  }

  render() {
    if(this.state.hasError){
        return (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                   <h1 className="text-2xl font-bold mb-4">
                    Something went wrong
                   </h1>
                   <p className ="text-2xl font-bold mb-4">
                        Please try Refreshing the page
                   </p>
                   <button className ="px-4 py-2 bg-blue text-white rounded" onClick={() => window.location.reload()}>
                       Refresh
                   </button>
              </div>
            </div>
        )
    }

    return this.props.children;
  }
}
