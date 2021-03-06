import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import UserList from './UserList'
import Header from './Header'
import Register from './Register/Register'
import Terms from './Register/Terms.js'
import Profile from './Profile/Profile.js'

import '../styles/Icons.css'

import { withStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'

const styles = theme => ({
  root: {
    margin: 0,
    padding: 60
  }
})

class ReviewerSearch extends Component {

  constructor(props){
    super(props)
    this.state = {
      searchValue: '',
      unoccupied: false,
      labels: []
    }
  }

  handleValueChange = (event) => {
    this.setState({
      searchValue: event.target.value
    })
  }

  handleSwitchChange = (event) => {
    this.setState({
      unoccupied: event.target.checked
    })
  }

  handleLabelClick = (event) => {
    console.log(event.target)
    if(!this.state.labels.includes(event.target.textContent)){
      this.setState({
        labels: this.state.labels.concat(event.target.textContent)
      })
    }
  }

  handleLabelDelete = (labelToDelete) => () => {
    this.setState({
      labels: this.state.labels.filter(label => label !== labelToDelete)
    })
  }


  render() {
    const {classes } = this.props
    return (
      <Paper className={classes.root}>
      <Header
      onChange={this.handleValueChange}
      />
      <UserList
      value={this.state.searchValue}
      key={this.state.searchValue}
      onSwitchChange={this.handleSwitchChange}
      unoccupied={this.state.unoccupied}
      onLabelClick={this.handleLabelClick}
      onLabelDelete={this.handleLabelDelete}
      labels={this.state.labels}
      />
      </Paper>
    )
  }
}

let RS = (withStyles(styles)(ReviewerSearch))

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <RS/>
          </Route>
          <Route exact path="/join">
            <Register />
          </Route>
          <Route exact path="/terms-and-conditions">
            <Terms />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
        </Switch>
      </Router>
    )
  }
}



export { RS as ReviewerSearch}

export default App;
