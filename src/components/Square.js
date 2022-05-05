import React from "react";

export default class Square extends React.Component {
  render() {
    let className = 'square';
    switch (this.props.value) {
      case 'X':
        className += ' square-red';
        break;
        
      case 'O':
        className += '  square-green';
        break;

      default:
        break;
    }

    return (
      <button
        className={className}
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
