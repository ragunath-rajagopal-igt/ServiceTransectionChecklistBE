'use strict';

/**
 * Creates a configuration object for an input field.
 *
 * @param {Object} params - Configuration parameters for the input field.
 * @param {string} params.label - The label for the input field.
 * @param {string} params.formCtrlName - The name of the form control.
 * @param {string} params.placeholder - Placeholder text for the input.
 * @param {number} params.maxLen - Maximum length of the input.
 * @param {boolean} params.required - Indicates if the field is required.
 * @param {string} params.styleClass - CSS class for styling.
 * @param {Object} params.validMsg - Validation messages for the field.
 * @param {boolean} params.disabled - Indicates if the field is disabled.
 * @param {boolean} params.hidden - Indicates if the field is hidden.
 * @param {string} params.value - Initial value of the input field.
 * @returns {Object} Configuration object for the input field.
 */
let makeInputObj = ({
    label = '',
    formCtrlName = '',
    placeholder = '',
    maxLen = '',
    required = false,
    styleClass = '',
    validMsg = {},
    disabled = false,
    hidden = false,
    value = '',
    readOnly = false,
    type = 'text',
    minLen = '',
  }) => {
    const CONTROL_TYPE = "input"; // Type of control
    const INPUT_TYPE = type; // Default input type
  
    // Create the input field object
    let inputVal = {
      label: label,
      controlType: CONTROL_TYPE,
      attributes: {
        type: INPUT_TYPE,
        formControlName: formCtrlName,
        maxLength: maxLen,
        minLength: minLen,
        placeholder: placeholder,
        required: required,
        class: styleClass,
        disabled: disabled,
        hidden: hidden,
        value: value,
        readOnly: readOnly,
      },
      validationMessages: validMsg,
    };
  
    return inputVal; // Return the constructed input object
  };
  
let makeDateObj = ({
    label = '',
    formCtrlName = '',
    placeholder = '',
    required = false,
    styleClass = '',
    validMsg = {},
    disabled = false,
    hidden = false,
    value = '',
    readOnly = false,
  }) => {
    const CONTROL_TYPE = "date"; // Type of control
    const INPUT_TYPE = "date"; // Input type for date fields
  
    // Create the date field object
    let inputVal = {
      label: label,
      controlType: CONTROL_TYPE,
      attributes: {
        type: INPUT_TYPE,
        formControlName: formCtrlName,
        placeholder: placeholder,
        required: required,
        class: styleClass,
        disabled: disabled,
        hidden: hidden,
        value: value,
        readOnly: readOnly,
      },
      validationMessages: validMsg,
    };
  
    return inputVal; // Return the constructed date object
  };
  
let makeSelectObj = ({
    label = '',
    formCtrlName = '',
    options = [],
    placeholder = '',
    required = false,
    styleClass = '',
    validMsg = {},
    disabled = false,
    hidden = false,
    value = ''
  }) => {
    const CONTROL_TYPE = "select"; // Type of control
  
    // Create the select field object
    let inputVal = {
      label: label,
      controlType: CONTROL_TYPE,
      attributes: {
        formControlName: formCtrlName,
        placeholder: placeholder,
        required: required,
        class: styleClass,
        disabled: disabled,
        hidden: hidden,
        value: value,
      },
      options: options, // Store available options for the select dropdown
      validationMessages: validMsg,
    };
  
    return inputVal; // Return the constructed select object
  };
  
let makeTextareaObj = ({
    label = '',
    formCtrlName = '',
    rows = 4,
    maxLen = 200,
    placeholder = '',
    styleClass = '',
    validMsg = {},
    disabled = false,
    hidden = false,
    value = '',
    readOnly = false,
  }) => {
    const CONTROL_TYPE = "textarea"; // Type of control
  
    // Create the textarea field object
    let inputVal = {
      label: label,
      controlType: CONTROL_TYPE,
      attributes: {
        formControlName: formCtrlName,
        rows: rows,
        maxLength: maxLen,
        placeholder: placeholder,
        class: styleClass,
        disabled: disabled,
        hidden: hidden,
        value: value,
        readOnly: readOnly,
      },
      validationMessages: validMsg,
    };
  
    return inputVal; // Return the constructed textarea object
  };

  
let makeFileObj = ({
  label = '',
  formCtrlName = '',
  placeholder = '',
  styleClass = '',
  validMsg = {},
  disabled = false,
  hidden = false,
  value = '',
  readOnly = false,
}) => {
  const CONTROL_TYPE = "file";
  const INPUT_TYPE = "file";
  let inputVal = {
    label: label,
    controlType: CONTROL_TYPE,
    attributes: {
      type: INPUT_TYPE,
      formControlName: formCtrlName,
      rows: rows,
      maxLength: maxLen,
      placeholder: placeholder,
      class: styleClass,
      disabled: disabled,
      hidden: hidden,
      value: value,
      readOnly: readOnly,
    },
    validationMessages: validMsg,
  };
  return inputVal;
}


  // Function to generate form fields based on the JSON config
const createFormFieldFromJSON = (formConfig, dynamicOptions, formData, attributeFields) => {
  const { disabledFields, readOnlyFields } = attributeFields || {};
  return formConfig.map(field => {
    // Dynamically bind values from formData, falling back to default if no value exists
    let fieldValue = formData[field.attributes.formControlName] || field.attributes.value;
    
    if (field.controlType === 'date' && (!fieldValue || fieldValue === '' || fieldValue === null)) {
      fieldValue = new Date();
    }
    field.attributes.value = fieldValue;

    // Replace any placeholders with dynamic data if needed
    if ((field.controlType === 'select' || field.controlType === 'select-search') && dynamicOptions[`${field.attributes.formControlName}`]) {
      field.options = dynamicOptions[`${field.attributes.formControlName}`];
    }

    if (readOnlyFields && readOnlyFields.includes(field.attributes.formControlName)) {
      field.attributes.readonly = true;
    }

    if (disabledFields && disabledFields.includes(field.attributes.formControlName)) {
      field.attributes.disabled = true;
    }
    return field; // Return the updated field object
  });
};

// formFieldHelper.js
const generateFormFields = (fieldConfig, dynamicData, defaultValues) => {
  const config = { ...fieldConfig };

  // Replace any placeholders with dynamic data if needed
  if (config.controlType === 'select' && dynamicData[`${fieldConfig.attributes.formControlName}Options`]) {
      config.options = dynamicData[`${fieldConfig.attributes.formControlName}Options`];
  }

  // Set default value if specified in defaultValues
  config.value = defaultValues[config.formCtrlName] || config.value;

  switch (config.type) {
      case 'input':
          return makeInputObj({
              ...config,
              type: config.inputType || 'text',
          });
      case 'date':
          return makeDateObj(config);
      case 'select':
          return makeSelectObj(config);
      case 'textarea':
          return makeTextareaObj(config);
      case 'file':
        return makeFileObj(config);
      default:
        return '';
          // throw new Error(`Unsupported field type: ${config.type}`);
  }
};

module.exports = {
  makeInputObj,
  makeDateObj,
  makeSelectObj,
  makeTextareaObj,
  makeFileObj,
  createFormFieldFromJSON,
};
