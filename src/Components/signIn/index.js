import React, {Component} from 'react';

import {validate } from "../UI/misc";
import FormField from "../UI/formFileds";
import {firebase} from "../../firebase";

class SignIn extends Component {

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
          placeholder: 'Your email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        validationMessage: ''
      },
      password: {
        element: 'input',
        value: '',
        config: {
          name: 'password-input',
          type: 'password',
          placeholder: 'Your password'
        },
        validation: {
          required: true
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

  submitForm = (event) => {
    event.preventDefault();
    let dataToSubmit = {};
    let formIsValid = true;

    for(let key in this.state.formData){
      dataToSubmit[key] = this.state.formData[key].value;
      formIsValid = this.state.formData[key].valid && formIsValid;
    }

    if(formIsValid){
      firebase.auth().signInWithEmailAndPassword(dataToSubmit.email, dataToSubmit.password)
          .then(() => {
            this.props.history.push('/dashboard')
          })
          .catch(err => {
            this.setState({formError: true})
          })
    } else {
      this.setState({
        formError: true
      })
    }
  };

  render() {

    const {formData, formError} = this.state;

    return (
        <div className="container">
          <div className="signin_wrapper" style={{margin: '100px'}}>
            <form onSubmit={this.submitForm}>
              <h2>Please Login</h2>
              <FormField
                  id={'email'}
                  formData={formData.email}
                  change={this.updateForm}
              />
              <FormField
                  id={'password'}
                  formData={formData.password}
                  change={this.updateForm}
              />
              {formError && <div className="error_label">Something is wrong, try again.</div>}
              <button onSubmit={this.submitForm}>Log in</button>
            </form>
          </div>
        </div>
    );
  }
}

export default SignIn;