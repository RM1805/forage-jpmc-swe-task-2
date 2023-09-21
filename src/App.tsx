import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];
  isStreaming: boolean; // Added state to track streaming status
}

/**
 * The parent element of the react app.
 * It renders title, button, and Graph react element.
 */
class App extends Component<{}, IState> {
  // Use a class property for the interval timer
  private dataInterval: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      isStreaming: false, // Initialize streaming status as false
    };
  }

  componentDidMount() {
    // Start streaming data when the component mounts
    this.startStreamingData();
  }

  componentWillUnmount() {
    // Stop streaming data when the component unmounts
    this.stopStreamingData();
  }

  /**
   * Start streaming data from the server
   */
  startStreamingData() {
    if (!this.state.isStreaming) {
      // Use setInterval to repeatedly fetch data from the server every 100ms
      this.dataInterval = setInterval(() => {
        DataStreamer.getData((serverResponds: ServerRespond[]) => {
          // Update the state with new data from the server
          this.setState((prevState) => ({
            data: [...prevState.data, ...serverResponds],
          }));
        });
      }, 100);

      // Set the streaming status to true
      this.setState({ isStreaming: true });
    }
  }

  /**
   * Stop streaming data from the server
   */
  stopStreamingData() {
    if (this.state.isStreaming && this.dataInterval !== null) {
      // Clear the interval timer to stop fetching data
      clearInterval(this.dataInterval);

      // Set the streaming status to false
      this.setState({ isStreaming: false });
    }
  }

  /**
   * Render Graph react component with state.data passed as the data property
   */
  renderGraph() {
    return <Graph data={this.state.data} />;
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">Bank & Merge Co Task 2</header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              // Toggle streaming data on button click
              if (this.state.isStreaming) {
                this.stopStreamingData();
              } else {
                this.startStreamingData();
              }
            }}
          >
            {this.state.isStreaming ? 'Stop Streaming Data' : 'Start Streaming Data'}
          </button>
          <div className="Graph">{this.renderGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
