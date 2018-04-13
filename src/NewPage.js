import React from 'react';
import CommentForm from './CommentForm';
import IdentityAvatar from './Avatar';

const PLACEHOLDER = "Your RoboHash"

export default class NewPage extends React.Component {
  state = {
    value: ''
  };

  onSubmit = e => {
    e.preventDefault();
  };

  onInputChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    return (
      <div className="container" style={{ paddingTop: '30px' }}>
        <div className="columns">
          <div className="column is-4 is-offset-4 has-text-centered">
            <IdentityAvatar size="veryLarge" src={`http://robohash.org/${this.state.value || PLACEHOLDER}.png`} style={{display: 'flex', justifyContent: 'center'}} />
            <h2 style={{ fontSize: '2rem', marginTop: '20px' }}>Create your own RoboHash</h2>
            <CommentForm
              style={{
                backgroundColor: 'rgba(246,244,255,0.7)',
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                alignItems: 'center',
                marginTop: '20px'
              }}
              inputStyle={{
                fontSize: '16px',
                fontWeight: 'normal'
              }}
              onChange={this.onInputChange}
              sendMessage={(a, b) => console.log(a)}
              placeholder={PLACEHOLDER}
            />
          </div>
        </div>
      </div>
    );
  }
}