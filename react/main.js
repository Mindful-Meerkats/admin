// App 

var Baobab = require('baobab');
var React = require('react');
var ReactAddons = require('react/addons');

var stateTree = new Baobab({
  notifications: []
}, {
  mixins: [ReactAddons.PureRenderMixin],
  shiftReferences: true
});

window.pizza = stateTree.get();
console.log( stateTree.get() )

var listCursor = stateTree.select('admin', 'notifications', 'list');
var MyComponent = React.createClass({
  mixins: [listCursor.mixin],
  renderNotification: function (notification) {
    return (
      <li>{notification.title}</li>
    );
  },
  render: function () {
  	console.log( this.props.state );
    return (
      <ul>

        {this.props.state.cursor.map(this.renderNofication)}
      </ul>
    );
  }
});

React.render(<MyComponent state={stateTree.get()}/>, document.body);