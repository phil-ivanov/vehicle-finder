import React, {Component} from 'react'
import {connect} from 'react-redux'
import Form from './common/Form'
import RegisterForm from './common/RegisterForm'

import {registerRequest} from '../actions'

class Register extends Component {
  constructor (props) {
    super(props)

    this._register = this._register.bind(this)
  }

  render () {
    let {dispatch} = this.props
    let {currentlySending, error} = this.props.data

    return (
        <div className='form-page__wrapper'>
            <div className='form-page__form-wrapper'>
                <div className='form-page__form-header'>
                <h2 className='form-page__form-heading'>Register</h2>
        </div>
        <RegisterForm data={this.props.data}
            dispatch={dispatch}
            history={this.props.history}
            onSubmit={this._register}
            btnText={'Register'}
            error={error}
            currentlySending={currentlySending} />
        </div>
      </div>
    )
  }

    _register (username, password, email) {
        this.props.dispatch(registerRequest({username, password, email}))
    }
}

Register.propTypes = {
  data: React.PropTypes.object,
  history: React.PropTypes.object,
  dispatch: React.PropTypes.func
}

function select (state) {
  return {
    data: state
  }
}

export default connect(select)(Register)