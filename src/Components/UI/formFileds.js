import React from 'react';

const FormField = ({formData, id, change}) => {

  const showError = () => {
    let errorMessage = <div className="error_label">
      {formData.validation && !formData.valid
        ? formData.validationMessage
        : null
      }
    </div>;

    return errorMessage;
  };

  const renderTemplate = () => {
    let formTemplate = null;
    switch (formData.element) {
      case 'input':
        return formTemplate = (
            <div>
              {formData.showLabel &&
              <div className="label_inputs">
                {formData.config.label}
              </div>}
              <input
                  {...formData.config}
                  value={formData.value}
                  onChange={(event) => change({event,id})}
              />
              { showError()}
            </div>
        );
      default:
        return formTemplate;
    }
  };

  return(
      <div>{renderTemplate()}</div>
  )
};

export default FormField;