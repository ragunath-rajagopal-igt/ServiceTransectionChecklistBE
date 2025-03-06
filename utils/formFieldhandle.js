'use strict';

//Input Object
let makeInputObj = (label, formCtrlName, value, styleClass, maxLen, validMsg,isDisabled) => {
  const CONTROL_TYPE = "input";
  const INPUT_TYPE = "text";
  let inputVal = {
    label: label,
    controlType: CONTROL_TYPE,
    type: INPUT_TYPE,
    formCtrlName: formCtrlName,
    value: value,
    styleClass: styleClass,
    maxLength: maxLen || 50,
    validate: {
      active: true,
      validMsg: validMsg,
    },
    disabled: isDisabled || false,
  };
  return inputVal;
}

//File Object
let makeFileObj = (label, formCtrlName, value, styleClass, rout, validMsg) => {
  const CONTROL_TYPE = "file";
  const INPUT_TYPE = "file";
  let inputVal = {
    label: label,
    controlType: CONTROL_TYPE,
    type: INPUT_TYPE,
    formCtrlName: formCtrlName,
    value: value,
    styleClass: styleClass,
    routPath:rout,
    validate: {
      active: true,
      validMsg: validMsg,
    },
  };
  return inputVal;
}

//Date Object
let makeDateObj = (label, formCtrlName, value, styleClass, maxLen, validMsg) => {
    const CONTROL_TYPE = "date";
    const INPUT_TYPE = "date";
    let inputVal = {
      label: label,
      controlType: CONTROL_TYPE,
      type: INPUT_TYPE,
      formCtrlName: formCtrlName,
      value: value,
      styleClass: styleClass,
      maxLength: maxLen || 50,
      validate: {
        active: true,
        validMsg: validMsg,
      },
    };
    return inputVal;
  }
  
//Select Object
let makeSelectObj = (label, formCtrlName, value, styleClass, options, validMsg) => {
  const CONTROL_TYPE = "select";
  const INPUT_TYPE = "select";
  let inputVal = {
    label: label,
    controlType: CONTROL_TYPE,
    type: INPUT_TYPE,
    formCtrlName: formCtrlName,
    value: value,
    styleClass: styleClass,
    validate: {
      active: true,
      validMsg: validMsg,
    },
    option: options,
  };
  return inputVal;
}

//TextArea Object
let makeTextAreaObj = (label, formCtrlName, value, styleClass, maxLen, validMsg) => {
  const CONTROL_TYPE = "textarea";
  const INPUT_TYPE = "text";
  let inputVal = {
    label: label,
    controlType: CONTROL_TYPE,
    type: INPUT_TYPE,
    formCtrlName: formCtrlName,
    value: value,
    styleClass: styleClass,
    maxLength: maxLen || 50,
    validate: {
      active: true,
      validMsg: validMsg,
    },
  };
  return inputVal;
}

module.exports = {
  makeInputObj,
  makeSelectObj,
  makeDateObj,
  makeTextAreaObj,
  makeFileObj
};