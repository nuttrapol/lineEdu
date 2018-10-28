import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { HomePage } from './screen/homepage/index.js'
import CreateClassroom from './screen/createClassroom/index.js'
import SuccessCreateClass from './screen/successCreateClass/index.js'
import AddUser from './screen/addUser/index.js'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/" component={HomePage}></Route>
        <Route exact path="/createClassroom" component={CreateClassroom}></Route>
        <Route exact path="/successCreateClass" component={SuccessCreateClass}></Route>
        <Route exact path="/addUser" component={AddUser}></Route>
      </div>
    );
  }
}

export default App;