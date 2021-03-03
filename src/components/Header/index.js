import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logo from 'assets/images/oracle.svg';
import searchImg from 'assets/images/search.png';
import createProjectIcon from 'assets/images/create-project-icon.png';
import { logoutAction } from 'store/actions/auth';
import { Event } from 'trackers/ga';
import SearchForm from './searchForm';
import HeaderNotification from './notification';

import './style.scss';

function Header(props) {
  const { /* user, */ logout } = props;
  const stateHeader = useSelector((state) => state.organization);
  return (
    <header>
      <div className="top-header flex-div align-items-center">
        <div className="tophd_left">
          <Link to="/" className="top_logo">
            {stateHeader?.logo ? <img src={`${global.config.resourceUrl}${stateHeader.logo}`} alt="logo" title="" /> : <img src={logo} alt="logo" title="" />}
            <span className="logo-text">University</span>
          </Link>
        </div>
        <div className="search-div">
          <SearchForm />
        </div>
        {/* <MultitenancyDropdown /> */}
        <div className="tophd_right flexdiv search-div  d-flex flex-wrap ">
          <div className="navbar-link">
            <ul className="top-info flex-div">
              {/* {(stateHeader.currentOrganization?.organization_role !== 'Course Creator' && stateHeader.currentOrganization?.organization_role !== undefined) && (
                <li>
                  <Link
                    to={`/org/${stateHeader.currentOrganization?.domain}/manage`}
                    onClick={() => {
                      dispatch(setActiveOrganization(stateHeader.currentOrganization));
                      dispatch(updateOrganizationScreen('intro'));
                    }}
                  >
                    <FontAwesomeIcon icon="briefcase" />
                    <p className="header-icon-text">
                      Manage&nbsp;
                      {stateHeader.currentOrganization?.domain}
                    </p>
                  </Link>
                </li>
              )} */}
              <li className="align-items-center">
                <Dropdown className="create-project">
                  <Dropdown.Toggle className="align-items-center">
                    <FontAwesomeIcon icon="plus-circle" />
                    <p className="header-icon-text">Create</p>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown">
                    <Dropdown.Item as={Link} to="/project/create" className="menuLinks">
                      <div className="notify-box">
                        <div className="notify-icon">
                          <img src={createProjectIcon} alt="create" />
                        </div>
                        <div className="notify-description">
                          <div className="nav-title">Create a New Project</div>
                          <p>
                            A project gives you a place to build and organize the
                            amazing learning experiences available in the Active
                            Learning Studio.
                          </p>
                        </div>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              <HeaderNotification />
              <li className="mobile-links">
                <Link to="#">
                  <img src={searchImg} alt="search" />
                </Link>
              </li>

              <li className="menu-user-settings d-flex align-items-center">
                <Dropdown>
                  <Dropdown.Toggle className="align-items-center">
                    <FontAwesomeIcon icon="user" />
                    <p className="header-icon-text">Profile</p>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown">
                    {/* <Dropdown.Item to="#">
                      Welcome &nbsp;
                      <span className="user-name-login">
                        {user && user.displayName}
                      </span>
                    </Dropdown.Item> */}

                    <Dropdown.Item as={Link} to="/dashboard">
                      Dashboard
                    </Dropdown.Item>

                    <Dropdown.Item as={Link} to="/account">
                      My Account
                    </Dropdown.Item>

                    <Dropdown.Item as={Link} to="/change-password">
                      Change Password
                    </Dropdown.Item>

                    <Dropdown.Item
                      href="#"
                      onClick={() => {
                        Event('button click', 'User press Logout button', 'Login Page');
                        logout();
                      }}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
