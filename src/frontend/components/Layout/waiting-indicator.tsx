import * as React from 'react';

export interface Props {
  seconds: number;
}

export class WaitingIndicator extends React.Component {
  private interval: NodeJS.Timer;

  constructor(props: Props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState((prevState: Props) => ({
      seconds: prevState.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="waiting-indicator"> {getWaitingIndicator(false, (this.state as Props).seconds)} </div>
    );
  }
}


function getWaitingIndicator(yourTurn: boolean, seconds: number) {
  if (yourTurn) {
    return <span>...</span>;
  } else {
    const num: number = seconds % 3;

    switch (num) {
      case 0:
        return <span>..o</span>;
      case 1:
        return <span>o..</span>;
      case 2:
        return <span>.o.</span>;
      default:
        return <span>...</span>;
    }
  }
}
