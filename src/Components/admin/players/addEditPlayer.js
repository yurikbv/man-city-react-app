import React, {Component} from 'react';

import AdminLayout from "../../../Hoc/AdminLayout";
import FormField from "../../UI/formFileds";
import {validate} from "../../UI/misc";

import {firebasePlayers, firebase} from "../../../firebase";
import Fileuploader from "../../UI/fileuploader";

class AddEditPlayer extends Component {

  state = {
    playerId: '',
    formType: '',
    formError:false,
    formSuccess:'',
    defaultImage:'',
    formData: {
      name: {
        element: 'input',
        value: '',
        config: {
          label: 'Player Name',
          name: 'name_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: true
      },
      lastname: {
        element: 'input',
        value: '',
        config: {
          label: 'Player Last name',
          name: 'lastname_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: true
      },
      number: {
        element: 'input',
        value: '',
        config: {
          label: 'Player number',
          name: 'number_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: true
      },
      position: {
        element: 'select',
        value: '',
        config: {
          label: 'Select a position',
          name: 'select_position',
          type: 'select',
          options:[
            {key:'Keeper', value:'Keeper'},
            {key:'Defence', value:'Defence'},
            {key:'Midfield', value:'Midfield'},
            {key:'Striker', value:'Striker'}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: true
      },
      image: {
        element: 'image',
        value: '',
        validation: {
          required: true
        },
        valid: false
      }
    }
  };

  componentDidMount() {
    const playerId = this.props.match.params.id;

    if(!playerId){
      this.setState({formType:'Add player'})
    } else {
      firebasePlayers.child(playerId).once('value')
          .then(snapshot => {
            const playerData = snapshot.val();
            firebase.storage().ref('players')
                .child(playerData.image).getDownloadURL()
                .then(url => {
                  this.updateFields(playerData, playerId, 'Edit player', url)
                }).catch(() => {
                    this.updateFields(
                        {...playerData,image:''},
                        playerId, 'Edit player', '')
            })
          })
    }
  }

  updateFields = (playerData, playerId, formType, defaultImage) => {
    const newFormData = {...this.state.formData};

    for(let key in newFormData){
      newFormData[key].value = playerData[key];
      newFormData[key].valid = true;
    }

    this.setState({
      playerId,
      formType,
      defaultImage,
      formData: newFormData
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

    if(formIsValid){

      if(this.state.formType === 'Edit player'){
        firebasePlayers.child(this.state.playerId).update(dataToSubmit).then(() => {
              this.setState({formSuccess: 'Updated correctly'},() => {
                setTimeout(() => this.setState({formSuccess: ''}),2000);
              });
              this.props.history.push('/admin_players');
        }).catch(() => {
          this.setState({formError: true})
        })
      }else {
        firebasePlayers.push(dataToSubmit).then(() => {
          this.props.history.push('/admin_players');
        }).catch(() => {
          this.setState({formError: true})
        })
      }

    } else {
      this.setState({
        formError: true
      })
    }
  };

  updateForm = (element, content = '') => {
    const newFormData = {...this.state.formData};
    const newElement = {...newFormData[element.id]};

    if(content === ''){
      newElement.value = element.event.target.value;
    } else {
      newElement.value = content;
    }

    let validData = validate(newElement);
    newElement.valid = validData[0];
    newElement.validationMessage = validData[1];
    newFormData[element.id] = newElement;

    this.setState({
      formError: false,
      formData: newFormData
    })
  };

  resetImage = () => {
    const newFormData = {...this.state.formData};
    newFormData['image'].value = '';
    newFormData['image'].valid = false;
    this.setState({
      defaultImage: '',
      formData: newFormData
    })
  };

  storeFilename = (filename) => {
    this.updateForm({id: 'image'},filename)
  };

  render() {

    const {formType, formError, formSuccess, formData, defaultImage} = this.state;

    return (
        <AdminLayout>
          <div className="editplayers_dialog_wrapper">
            <h2>{formType}</h2>

            <form onSubmit={this.submitForm}>

              <Fileuploader
                dir="players"
                tag={"Player image"}
                defaultImage={defaultImage}
                defaultImageName={formData.image.value}
                resetImage={this.resetImage}
                filename={this.storeFilename}
              />

              <FormField
                  id={'name'}
                  formData={formData.name}
                  change={this.updateForm}
              />

              <FormField
                  id={'lastname'}
                  formData={formData.lastname}
                  change={this.updateForm}
              />

              <FormField
                  id={'number'}
                  formData={formData.number}
                  change={this.updateForm}
              />

              <FormField
                  id={'position'}
                  formData={formData.position}
                  change={this.updateForm}
              />

              <div className="success_label">{formSuccess}</div>

              {formError && <div className="error_label">Something is wrong</div>}

              <div className="admin_submit">
                <button onClick={this.submitForm}>
                  {formType}
                </button>
              </div>

            </form>
          </div>
        </AdminLayout>
    );
  }
}

export default AddEditPlayer;