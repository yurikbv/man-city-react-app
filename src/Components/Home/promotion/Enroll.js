import React, {Component} from 'react';
import Fade from 'react-reveal/Fade';
import FormField from "../../UI/formFileds";
import {validate} from "../../UI/misc";
import { firebasePromotions } from "../../../firebase";

class Enroll extends Component {

  state = {
    formError: false,
    formSuccess: '',
    formData: {
      email:{
        element: 'input',
        value: '',
        config: {
          name: 'email-input',
          type: 'email',
          placeholder: 'Enter your email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        validationMessage: ''
      }
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

  resetFormSuccess = (type) => {
    const newFormData = {...this.state.formData};
    for (let key in newFormData){
      newFormData[key].value = '';
      newFormData[key].valid = false;
      newFormData[key].validationMessage = '';
    }

    this.setState({
      formError: false,
      formData: newFormData,
      formSuccess: type ? 'Congratulations!' : 'This email is exist already',
    },() => {
      setTimeout(() => {
        this.setState({formSuccess: ''})
      },2000)
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

      firebasePromotions.orderByChild('email').equalTo(dataToSubmit.email).once('value')
          .then(snapshot => {
            if(snapshot.val() === null){
              firebasePromotions.push(dataToSubmit);
              this.resetFormSuccess(true);
            }else {
              this.resetFormSuccess(false);
            }
          })

      // this.resetFormSuccess();
    } else {
      this.setState({
        formError: true
      })
    }
  };

  render() {

    const {formData, formError, formSuccess} = this.state;

    return (
        <Fade>
          <div className="enroll_wrapper">
            <form onSubmit={this.submitForm}>
              <div className="enroll_title">
                Enter your email
              </div>
              <div className="enroll_input">
                <FormField
                  id={'email'}
                  formData={formData.email}
                  change={this.updateForm}
                />
                {formError && <div className="error_label">Something is wrong, try again.</div>}
                <div className="success_label">{formSuccess}</div>
                <button onSubmit={this.submitForm}>Enroll</button>
                <div className="enroll_discl">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi aperiam consequatur, cum ea ex incidunt ipsum labore porro rem, repellendus tempore vel veniam voluptate?
                </div>
              </div>
            </form>
          </div>
        </Fade>
    );
  }
}

export default Enroll;