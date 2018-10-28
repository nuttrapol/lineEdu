import React, { Component } from 'react'
import { insertClassroom } from '../../mongoDBFunction'
import { Body } from '../../style'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import MaterialUIForm from 'material-ui-form'
var shortid = require('shortid');

const liff = window.liff
const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        color: '#11336C',
        fontSize: "20px",
        fontWeight: "500",
        '&$focused': {
          color: '#11336C',
        }
      }
    },
    MuiNotchedOutline: {
      root: {
        borderColor: "#11336C"
      },
      focused: {
        borderColor: "#11336C"
      }
    }
  }
});
const themeDesc = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        color: '#11336C',
        fontSize: "20px",
        fontWeight: "500",
        '&$focused': {
          color: '#11336C',
        }
      }
    },
    MuiNotchedOutline: {
      focused: {
        borderColor: "#11336C"
      },
      root: {
        minHeight: "130px",
        borderColor: "#11336C"
      }
    }
  }
});
const themeSubTextField = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        color: 'gray',
        fontSize: "18px",
        fontWeight: "300",
        '&$focused': {
          color: 'gray',
        }
      }
    }
  }
});
const themeButton = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        color: 'white',
        fontSize: "18px",
        fontWeight: "300",
        backgroundColor: "#11336C",
        height: "50px"
      }
    }
  }
});

class CreateClassroom extends Component {

  constructor(props) {
    super(props)
    this.state = {
      className: "",
      classDesc: "",
      scoreSection: [
        {
          sectionName: "",
          score: ""
        }
      ],
      moreInfo: [],
      currentMoreInfo: "",
      userId: ""
    }
    this.initialize = this.initialize.bind(this)
    this.closeApp = this.closeApp.bind(this)
  }

  componentDidMount () {
    window.addEventListener('load', this.initialize);
  }

  initialize() {
    liff.init(async (data) => {
      let profile = await liff.getProfile();
      this.setState({
        userId: profile.userId
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

  handleClassNameChange = (event) => {
    this.setState({
      className: event.target.value,
    });
  };

  handleClassDescChange = (event) => {
    this.setState({
      classDesc: event.target.value,
    });
  };

  handleSectionNameChange = (key, event) => {
    let { scoreSection } = this.state
    scoreSection[key].sectionName = event.target.value
    this.setState({
      scoreSection: scoreSection
    });
  };

  handleSectionScoreChange = (key, event) => {
    let { scoreSection } = this.state
    scoreSection[key].score = event.target.value
    this.setState({
      scoreSection: scoreSection
    });
  };

  handleMoreInfoChange = (event) => {
    this.setState({
      currentMoreInfo: event.target.value
    });
  };

  addScoreSection = (event) => {
    let { scoreSection } = this.state
    this.setState({
      scoreSection: [...scoreSection,
        {
          sectionName: "",
          score: ""
        }]
    })
  }

  addMoreInfo = (event) => {
    let { moreInfo,currentMoreInfo } = this.state
    console.log("call add info");
    if (currentMoreInfo !== "") {
      this.setState({
        moreInfo: [...moreInfo,
          currentMoreInfo
        ],
        currentMoreInfo: ""
      })
    }
  }

  deleteScoreSection = async (key) => {
    let { scoreSection } = this.state
    scoreSection.splice(key,1)
    this.setState({
      scoreSection: scoreSection
    })
  }

  handleDeleteChip = (name) => {
    let { moreInfo } = this.state
    const chipToDelete = moreInfo.indexOf(name);
    moreInfo.splice(chipToDelete, 1);
    this.setState({
      moreInfo: moreInfo
    });
  };

  submitForm = (values, pristineValues) => {
    let { className,classDesc,moreInfo,scoreSection,userId } = this.state
    let insertData = {
      className: className,
      classDesc: classDesc,
      classScore: scoreSection,
      classMoreDetailList: moreInfo,
      classStatus: "active",
      classOwner: userId,
      classPublicKey: shortid.generate(),
      classPrivateKey: [shortid.generate()]
    }
    console.log("before send ",insertData);
    insertClassroom(insertData, (result) => {
      console.log(result);
    })
    this.props.history.push({
      pathname: '/successCreateClass',
      state: {
        classPublicKey: insertData.classPublicKey,
        classPrivateKey: insertData.classPrivateKey[0]
      }  
    })
  }

  renderChipMoreInfo = () => {
    let { moreInfo } = this.state
    if (moreInfo.length !== 0) {
      return (
        moreInfo.map((data,key) => {
          return (
            <Chip
              key={key}
              label={data}
              onDelete={() => this.handleDeleteChip(data)}
            />
          )
        })
      )
    } else {
      return ( <p>No more information is reqiured</p> )
    }
  }

  renderScoreSection = () => {
    let { scoreSection } = this.state
    return (
      scoreSection.map((data,key) => {
        return (
          <div key={key} style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "10px"}}>
            <TextField
              label="Section Name"
              id="simple-start-adornment"
              margin="normal"
              style={{width: "50%", marginTop: "0px", marginBottom: "0px"}}
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              required
              value={data.sectionName}
              onChange={this.handleSectionNameChange.bind(this, key)}
            />
            <TextField
              label="Score"
              id="simple-start-adornment"
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">Point</InputAdornment>,
              }}
              style={{width: "30%", marginLeft: "20px", marginTop: "0px", marginBottom: "0px"}}
              InputLabelProps={{
                shrink: true,
              }}
              value={data.score}
              onChange={this.handleSectionScoreChange.bind(this, key)}
              type="number"
              required
            />
            <Icon style={{color: "gray", fontSize: "25px", paddingLeft: "15px", display: (key === 0 ? "none" : "initial")}}
              onClick={() => this.deleteScoreSection(key)}  
            >
              clear
            </Icon>
          </div>
        )
      })
    )
  }

  render() {
    return (
      <Body>
        <Grid item xs={12}>
          <h3><p style={{color:"#11336C"}}> Create new classroom </p></h3>
          <MaterialUIForm onSubmit={this.submitForm} style={{display: 'flex', flexWrap: 'wrap'}}>
            <Grid item xs={12}>
              <MuiThemeProvider theme={theme}>
                <TextField 
                  id="outlined-name"
                  label="Class Name"
                  onChange={this.handleClassNameChange}
                  margin="normal"
                  variant="outlined"
                  value={this.state.className}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <MuiThemeProvider theme={themeDesc}>
                  <div style={{minHeight: "150px"}}>
                    <TextField 
                      id="outlined-name"
                      label="Description"
                      onChange={this.handleClassDescChange}
                      margin="normal"
                      variant="outlined"
                      value={this.state.classDesc}
                      fullWidth
                      multiline
                      placeholder="(Optional)"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </MuiThemeProvider>
                <div style={{paddingLeft: "17px"}}>
                  <FormControl required>
                    <p style={{color: "#11336C", fontSize: "16px", fontWeight: "500"}}>Score Section</p>
                    <MuiThemeProvider theme={themeSubTextField}>
                      <div style={{display: "flex", flexDirection: "column", paddingLeft: "15px"}}>
                        {this.renderScoreSection()}
                      </div>
                    </MuiThemeProvider>
                    <div style={{display: "flex", justifyContent: "center", paddingRight: "30px", paddingTop: "10px"}}>
                      <Icon style={{color: "#11336C", fontSize: "35px"}} onClick={this.addScoreSection}>
                        add_circle_outline
                      </Icon>
                    </div>
                  </FormControl>
                </div>
                <div style={{paddingLeft: "17px",paddingRight: "17px"}}>
                  <p style={{color: "#11336C", fontSize: "16px", fontWeight: "500"}}>More required information from students</p>
                  <MuiThemeProvider theme={themeSubTextField}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                      <Paper style={{padding: "10px"}}>
                        {this.renderChipMoreInfo()}
                      </Paper>
                    </div>
                  </MuiThemeProvider>
                  <div style={{display: "flex", justifyContent: "center", paddingRight: "30px", paddingTop: "10px"}}>
                    <MuiThemeProvider theme={themeSubTextField}>
                      <TextField
                        label="Require for: "
                        id="simple-start-adornment"
                        margin="normal"
                        style={{width: "70%", marginTop: "0px", marginBottom: "0px"}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={this.state.currentMoreInfo}
                        onChange={this.handleMoreInfoChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end" onClick={this.addMoreInfo}>
                              <Icon style={{fontSize: "25px"}}>
                                add
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </MuiThemeProvider>
                  </div>
                </div>
              </MuiThemeProvider>
            </Grid>
            <Grid item xs={12} style={{display: "flex", flexDirection: "column", marginTop: "20px"}}>
              <MuiThemeProvider theme={themeButton}>
                <Button type="submit">
                  Submit
                </Button>
              </MuiThemeProvider>
            </Grid>
          </MaterialUIForm>
        </Grid>
      </Body>
    );
  }
}

export default CreateClassroom;
