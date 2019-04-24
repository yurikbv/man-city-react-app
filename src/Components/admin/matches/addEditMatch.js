import React, {Component} from 'react';
import AdminLayout from "../../../Hoc/AdminLayout";
import FormField from "../../UI/formFileds";

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
          name: 'date-input',
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
          name: 'select-local',
          type: 'select',
          options:[]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: '',
        showLabel: false
      }
    }
  };

  submitForm = (event) => {};

  updateForm = () => {};

  render() {

    const {formData,formError,formSuccess,formType,matchId,teams} = this.state;

    return (
        <AdminLayout>
          <div className="editmatch_dialog_wrapper">{formType}</div>
          <div>
            <form onSubmit={this.submitForm}>
              <FormField
                  id={'date'}
                  formData={formData.date}
                  change={this.updateForm}
              />

              <FormField
                  id={'local'}
                  formData={formData.local}
                  change={this.updateForm}
              />
            </form>
          </div>
        </AdminLayout>
    );
  }
}

export default AddEditMatch;