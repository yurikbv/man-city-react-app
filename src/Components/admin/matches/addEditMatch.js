import React, {Component} from 'react';
import AdminLayout from "../../../Hoc/AdminLayout";
import FormField from "../../UI/formFileds";
import {validate} from "../../UI/misc";

import {firebaseTeams, firebaseDB, firebaseMatches} from "../../../firebase";
import {firebaseLooper} from "../../UI/misc";

class AddEditMatch extends Component {

  state= {
    matchId: '',
    formType: '',
    formError:false,
    formSuccess:'',
    teams: [],
    formData: {
      date: {
        element: 'input',
        value: '',
        config: {
          label: 'Event date',
          name: 'date_input',
          type: 'date'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: true
      },
      local: {
        element: 'select',
        value: '',
        config: {
          label: 'Select a local team',
          name: 'select_local',
          type: 'select',
          options:[]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: false
      },
      resultLocal: {
        element: 'input',
        value: '',
        config: {
          label: 'Result Local',
          name: 'result_local_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: false
      },
      away: {
        element: 'select',
        value: '',
        config: {
          label: 'Select a away team',
          name: 'select_away',
          type: 'select',
          options:[]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: false
      },
      resultAway: {
        element: 'input',
        value: '',
        config: {
          label: 'Result Away',
          name: 'result_away_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: false
      },
      referee: {
        element: 'input',
        value: '',
        config: {
          label: 'Referee',
          name: 'referee_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: true
      },
      stadium: {
        element: 'input',
        value: '',
        config: {
          label: 'Stadium',
          name: 'stadium_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: true
      },
      result: {
        element: 'select',
        value: '',
        config: {
          label: 'Team result',
          name: 'select_result',
          type: 'select',
          options:[
            {key: 'W', value: 'w'},
            {key: 'L', value: 'l'},
            {key: 'D', value: 'd'},
            {key: 'n/a', value: 'n/a'},
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: true
      },
      final: {
        element: 'select',
        value: '',
        config: {
          label: 'Game played ?',
          name: 'select_played',
          type: 'select',
          options:[
            {key: 'Yes', value: 'Yes'},
            {key: 'No', value: 'No'}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: true
      }
    }
  };

  componentDidMount() {

    const matchId = this.props.match.params.id;

    const getTeams = (match, type) => {

      firebaseTeams.once('value').then(snapshot => {
        const teams = firebaseLooper(snapshot);
        let teamOptions = [];

        snapshot.forEach(childSnapshot =>{
          teamOptions = [...teamOptions,{
            key: childSnapshot.val().shortName,
            value: childSnapshot.val().shortName
          }]
        });

        this.updateFields(match, teamOptions, teams, type, matchId);
      })
    };

    if(!matchId){
      getTeams(false, 'Add Match');
    } else {
      firebaseDB.ref(`matches/${matchId}`).once('value')
          .then(snapshot => {
            const match =snapshot.val();
            getTeams(match, 'Edit Match');
          })
    }
  }

  successForm = (message) => {
    this.setState({formSuccess: message},() => {
      setTimeout(() => this.setState({formSuccess: ''}),3000);
    })
  };

  updateFields = (match, teamOptions, teams, type, matchId) => {
    const newFormData = {
      ...this.state.formData
    };

    for(let key in newFormData){
      if(match){
        newFormData[key].value = match[key];
        newFormData[key].valid = true;
      }
      if(key === 'local' || key === 'away'){
        newFormData[key].config.options = teamOptions;
      }
    }

    this.setState({
      matchId,
      formType: type,
      formData: newFormData,
      teams
    })
  };

  submitForm = (event) => {
    event.preventDefault();
    let dataToSubmit = {};
    let formIsValid = true;

    for(let key in this.state.formData){
      dataToSubmit[key] = this.state.formData[key].value;
      formIsValid = this.state.formData[key].valid && formIsValid;
    }

    this.state.teams.forEach(team => {
      if(team.shortName === dataToSubmit.local.value){
        dataToSubmit['localThmb'] = team.thmb;
      }

      if(team.shortName === dataToSubmit.away.value){
        dataToSubmit['awayThmb'] = team.thmb;
      }
    });

    if(formIsValid){

      if(this.state.formType === 'Edit Match'){
        firebaseDB.ref(`matches/${this.state.matchId}`)
            .update(dataToSubmit).then(() => {
              this.successForm('Updated correctly.')
        }).catch(() => this.setState({formError: true}));
      } else {
        firebaseMatches.push(dataToSubmit).then(() => {
          this.props.history.push('/admin_matches');
        }).catch((error) => {
          console.error(error);
        })
      }

    } else {
      this.setState({
        formError: true
      })
    }
  };

  updateForm = (element) => {
    const newFormData = {...this.state.formData};
    const newElement = {...newFormData[element.id]};
    newElement.value = element.event.target.value;

    let validData = validate(newElement);
    newElement.valid = validData[0];
    newElement.validationMessage = validData[1];
    newFormData[element.id] = newElement;

    this.setState({
      formError: false,
      formData: newFormData
    })
  };

  render() {

    const {formData,formError,formSuccess,formType} = this.state;

    return (
        <AdminLayout>
          <div className="editmatch_dialog_wrapper">
            <h2>{formType}</h2>
            <div>
              <form onSubmit={this.submitForm}>
                <FormField
                    id={'date'}
                    formData={formData.date}
                    change={this.updateForm}
                />

                <div className="select_team_layout">
                  <div className="label_inputs">Local</div>
                  <div className="wrapper">
                    <div className="left">
                      <FormField
                          id={'local'}
                          formData={formData.local}
                          change={this.updateForm}
                      />
                    </div>
                    <div className="right">
                      <FormField
                          id={'resultLocal'}
                          formData={formData.resultLocal}
                          change={this.updateForm}
                      />
                    </div>
                  </div>
                </div>

                <div className="select_team_layout">
                  <div className="label_inputs">Away</div>
                  <div className="wrapper">
                    <div className="left">
                      <FormField
                          id={'away'}
                          formData={formData.away}
                          change={this.updateForm}
                      />
                    </div>
                    <div className="right">
                      <FormField
                          id={'resultAway'}
                          formData={formData.resultAway}
                          change={this.updateForm}
                      />
                    </div>
                  </div>
                </div>

                <div className="split_fields">
                  <FormField
                      id={'referee'}
                      formData={formData.referee}
                      change={this.updateForm}
                  />

                  <FormField
                      id={'stadium'}
                      formData={formData.stadium}
                      change={this.updateForm}
                  />
                </div>

                <div className="split_fields last">
                  <FormField
                      id={'result'}
                      formData={formData.result}
                      change={this.updateForm}
                  />

                  <FormField
                      id={'final'}
                      formData={formData.final}
                      change={this.updateForm}
                  />
                </div>

                <div className="success_label">{formSuccess}</div>
                {formError && <div className="error_label">Something is wrong</div>}
                <div className="admin_submit">
                  <button onClick={this.submitForm}>
                    {formType}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </AdminLayout>
    );
  }
}

export default AddEditMatch;