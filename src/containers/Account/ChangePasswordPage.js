import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

import loader from 'assets/images/loader.svg';
import { updatePasswordAction } from 'store/actions/auth';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Sidebar from 'components/Sidebar';
import Error from '../Auth/Error';

import './style.scss';

function ChangePasswordPage(props) {
  const {
    isLoading,
    updatePassword,
  } = props;

  const [error, setError] = useState(null);
  const [state, setState] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChangeField = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      const message = await updatePassword({
        current_password: state.currentPassword,
        password: state.password,
        password_confirmation: state.confirmPassword,
      });

      Swal.fire({
        icon: 'success',
        title: message,
        showCancelButton: false,
        showConfirmButton: false,
        timer: 1500,
        allowOutsideClick: false,
      });

      setState({
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <Header {...props} />

      <div className="account-page main-content-wrapper">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>

        <div className="content-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <h1 className="pl-0 title">Change Password</h1>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-12">
                <form
                  className="auth-form"
                  onSubmit={onSubmit}
                  autoComplete="off"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="current-password">Current Password</label>
                        <FontAwesomeIcon icon="lock" />
                        <input
                          className="input-box"
                          type="password"
                          id="current-password"
                          name="currentPassword"
                          placeholder="Current Password*"
                          required
                          value={state.currentPassword}
                          onChange={onChangeField}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <FontAwesomeIcon icon="lock" />
                        <input
                          className="input-box"
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Password*"
                          required
                          value={state.password}
                          onChange={onChangeField}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <FontAwesomeIcon icon="lock" />
                        <input
                          className="input-box"
                          type="password"
                          id="confirm-password"
                          name="confirmPassword"
                          placeholder="Confirm Password*"
                          required
                          value={state.confirmPassword}
                          onChange={onChangeField}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <img src={loader} alt="" />
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>

                  <Error error={error} />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

ChangePasswordPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  updatePassword: PropTypes.func.isRequired,
};

ChangePasswordPage.defaultProps = {
  user: null,
};

const mapDispatchToProps = (dispatch) => ({
  updatePassword: (data) => dispatch(updatePasswordAction(data)),
});

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordPage);
