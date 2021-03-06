import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { HomePage } from './screen/homepage/index.js'
import CreateClassroom from './screen/createClassroom/index.js'

const liff = window.liff

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      displayName : '',
      userId : '',
      pictureUrl : '',
      statusMessage : ''
    }
    this.initialize = this.initialize.bind(this)
    this.closeApp = this.closeApp.bind(this)
  }

  componentDidMount() {
    window.addEventListener('load', this.initialize);
  }

  initialize() {
    liff.init(async (data) => {
      let profile = await liff.getProfile()
      this.setState({
        displayName: profile.displayName,
        userId: profile.userId,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage
      })
    })
  }

  closeApp(event) {
    event.preventDefault()
    liff.sendMessages([{
      type: 'text',
      text: 'Thank you, Bye!'
    }]).then(() => {
      liff.closeWindow()
    })
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/" component={HomePage}></Route>
        <Route exact path="/createClassroom" component={CreateClassroom}></Route>
      </div>
    );
  }
}

export default App;
