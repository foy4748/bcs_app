
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
/*
// Username Only [Works]
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL',
});
//-----------------------

/**/

/*
// Grabbed from Documentation
Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes'],
    github: ['user', 'repo']
  },
  requestOfflineToken: {
    google: true
  },
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});
//-----------------------
*/


// Boilerplate from ian-accounts-ui-bootstrap-3 [Now Works!!]
Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'first_name',
        fieldLabel: 'First name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your first name");
            return false;
          } else {
            return true;
          }
        }
    }, {
        fieldName: 'last_name',
        fieldLabel: 'Last name',
        inputType: 'text',
        visible: true,
    }, {
        fieldName: 'gender',
        showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
        fieldLabel: 'Gender',
        inputType: 'radio',
        radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
        data: [{                    // Array of radio options, all properties are required
    		id: 1,                  // id suffix of the radio element
            label: 'Male',          // label for the radio element
            value: 'm',              // value of the radio element, this will be saved.
            checked: 'checked'
          }, {
            id: 2,
            label: 'Female',
            value: 'f',
            
        }],
        visible: true
    }, ] 
});
//-----------------------

/**/
/*
{
  fieldName: 'country',
  fieldLabel: 'Country',
  inputType: 'select',
  showFieldLabel: true,
  empty: 'Select Country',
  data: [
  {
      id: 1,
      label: 'United States',
      value: 'us'
   }, 

  {
      id: 2,
      label: 'Spain',
      value: 'es',
  },

  {
    id: 3,
    label: 'Bangladesh',
    value: 'bn',
  }
    ],
  visible: true
}, */
