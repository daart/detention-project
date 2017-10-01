import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import uuid from 'uuid/v4';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

import {addCategory} from '../../actions/categories';
import {add} from '../../actions/flashes';

class CategoryForm extends Component {
  state = {
    fields: {
      id: uuid(),
      type: 'income',
      name: '',
      deleted: false
    },
    errors: {},
    completed: false
    // newId: null
  }

  submitHandler = (e) => {
    e.preventDefault();
    console.log('Submitted')

    if(this.valid()) {
      this.props.addCategory({
        ...this.state.fields
      })

      this.setState({
        errors: {},
        completed: true
      })
    }
  }

  inputHandler = ({target}) => {
    this.setState({
      fields: {
          ...this.state.fields,
          [target.name]: target.value
        }
      },
      () => this.validateField(target.name, true)
    )
  }

  validateField = (field, updateState = false) => {
    console.log('validated')
    const val = this.state.fields[field];
    console.log("Value:  ", val)
    let message = null;

    if (field === 'name') {
      if (val.trim().length === 0) {
        message = 'Field is requried';
      }
    };

    if (updateState) {
      this.setState({
        errors: {
          ...this.state.errors,
          [field]: message
        }
      })
    };
      
    return message;
  }

  fieldBlurHandler = ({target}) => {
    this.validateField(target.name, true);
  }

  handleRadioChange = (event) => {
    console.log(event)
    this.setState({
      fields: {
          ...this.state.fields,
          type: event.target.value
        }
      }
    )
  }

  valid = () => {
    const {name} = this.state.fields;
    let valid = true;
    let errors = {};

    (name) => {
      let err = this.valdateField(name);
      if (err) {
        errors[name] = err;
        valid = false;
      }
    }

    this.setState({errors});

    return valid;
  }

  render() {
    const {fields: {type, name}, errors, deleted, completed} = this.state;

    if (completed) return <Redirect to={`/categories`} />;

    return (
      <div>
        <div>cat form</div>
        <form
          className="form"
          onSubmit={this.submitHandler}
        >
          <div className="form-title">New Category</div>
          <div className="form-group">
            <div className="input-label">Name</div>
            <input
              name="name"
              type="text"
              value={name}
              onChange={this.inputHandler}
              onBlur={this.fieldBlurHandler}
            />
            {errors['name'] && (
              <div className="input-error">{errors['name']}</div>
            )}
          </div>
          <div className="form-group">
            <div className="input-label">Type</div>
            <RadioGroup
              value={type}
              onChange={this.handleRadioChange}
              row
            >
              <FormControlLabel value="income" control={<Radio />} label="Income" />
              <FormControlLabel value="expense" control={<Radio />} label="Expense" />
            </RadioGroup>
          </div>
          <div className="form-group">
            <button className="btn btn-md">
              Save
            </button>
          </div>
        </form>
      </div>
    )
  }
}

const stateToProps = (state, ownProps) => ({

})

const dispatchToProps = dispatch => ({
  addCategory(data) {
    dispatch(addCategory(data));
  },
  addFlash(message) {
    dispatch(add({
      id: uuid(),
      open: true,
      message,
      hideAfter: null
    }))
  }
})

export default connect(stateToProps, dispatchToProps)(CategoryForm);