import React from 'react';

const FormField = ({formData, id, change}) => {

  const showError = () => {
    return <div className="error_label">
      {formData.validation && !formData.valid
        ? formData.validationMessage
        : null
      }
    </div>;
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
      case 'select':
        return formTemplate = (
          <div>
            {formData.showLabel &&
            <div className="label_inputs">
              {formData.config.label}
            </div>}
            <select
                value={formData.value}
                onChange={(event) => change({event,id})}
            >
              <option value="">Select One</option>
              {formData.config.options.map(item => (
                  <option key={item.key} value={item.key}>{item.value}</option>
              ))}
            </select>
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