'use strict';

/**
 * Expose Object configurations in new user
 */

/*
 * Make Hcl Sap ID
 */
function renderHclSapId(networkSetup) {
    return {
        label: 'HCL SAP No.',
        formCtrlName: 'hclSapNo',
        value:'',
        styleClass: 'col-md-6 mb-3',
        placeholder: '',
        required: true,
        maxLen: 8,
        validMsg: {
            required: 'HCL SAP No is required',
            maxLength: "HCL SAP No. must be 8 digits"
        },
    };
}

/*
 * Make first Name Object
 */
function renderfirstName(users) {
    return {
        label: 'First Name',
        formCtrlName: 'firstName',
        value:users.firstName || '',
        styleClass: 'col-md-6 mb-3',
        placeholder: '',
        required: true,
        maxLen:50,
        validMsg: {
            required: 'Please Enter the First Name.',
        },
    };
}

/*
 * Make Last Name Object
 */
function renderlastName(users) {
    return {
        label: 'Last Name',
        formCtrlName: 'lastname',
        value:users.lastname || '',
        styleClass: 'col-md-6 mb-3',
        placeholder: '',
        required: true,
        maxLen:50,
        validMsg: {
            required: 'Please Enter the Last Name.',
        },
    };
}

/*
 * Make Name Object
 */
function renderName(users) {
    return {
        label: 'Name',
        formCtrlName: 'name',
        value:users.name || '',
        styleClass: 'col-md-6 mb-3',
        placeholder: '',
        required: true,
        maxLen:50,
        validMsg: {
            required: 'Please Enter the Name.',
        },
    };
}

/*
 * Make location Object
 */
function renderlocation(users, locationOpt) {
    return {
        label: 'Location',
        formCtrlName: 'location',
        options: locationOpt,
        placeholder: 'Select location',
        required: true,
        styleClass: 'col-md-6 mb-2',
        value: users.location,
        validMsg: { required: 'Location is required.' }
    };
}

/*
 * Make sub location Object
 */
function renderSubLocation(users, locationOpt) {
    return {
        label: 'Sub-location',
        formCtrlName: 'subLocation',
        options: locationOpt,
        placeholder: 'Select location',
        required: true,
        styleClass: 'col-md-6 mb-2',
        value: users.subLocation,
        validMsg: { required: 'Location is required.' }
    };
}









module.exports = {
    renderHclSapId,
    renderfirstName,
    renderlastName,
    renderName
  };