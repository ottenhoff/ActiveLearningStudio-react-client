import React, { useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

import {
  updateOrganizationScreen,
  getsubOrgList,
  updatePreviousScreen,
  editOrganization,
  deleteOrganization,
  updateFeedbackScreen,
  setActiveOrganization,
} from 'store/actions/organization';

const AllOrganizations = () => {
  const dispatch = useDispatch();
  const allListState = useSelector((state) => state.organization);
  useMemo(() => {
    dispatch(updatePreviousScreen('intro'));
  }, []);
  useMemo(() => {
    dispatch(getsubOrgList(allListState.currentOrganization?.id));
  }, [allListState.currentOrganization]);
  const { allSuborgList } = allListState;
  return (
    allSuborgList ? (
      <div className="all-organizations">
        <div className="organizations-create">
          <h3>Organizations</h3>
          <div
            className="button-create"
            onClick={() => {
              dispatch(updateOrganizationScreen('create-org'));
              dispatch(updatePreviousScreen('all-list'));
            }}
          >
            Create Organization
          </div>
        </div>
        {allSuborgList.length > 0 ? (
          <div className="box-all-organization">
            <div className="search-all">
              <div className="input-with-icon">
                <input className="form-search" type="text" placeholder="Search organization" />
                <FontAwesomeIcon icon="search" />
              </div>
              <div className="filter">
                Filter1
              </div>
              <div className="filter">
                Filter2
              </div>
            </div>
            <div className="paginationbox">
              <div className="count-pages">
                1-20 of 100
              </div>
            </div>
            <div className="all-list">
              {allSuborgList.map((org) => (
                <div className="org-block">
                  <div
                    className="sub-org-img"
                    style={{ backgroundImage: `url(${global.config.resourceUrl}${org.image})` }}
                  />
                  <div className="meta-info">
                    <div className="info">
                      <div>
                        <h4>{org.name}</h4>
                        <h5>
                          Admin:
                          &nbsp;
                          {org.admins?.map((adm) => (
                            <span>
                              {adm.first_name}
                              ,&nbsp;
                            </span>
                          ))}
                        </h5>
                        <h5>
                          Domain:
                          &nbsp;
                          {org.domain}
                        </h5>
                      </div>
                      <p>{org.description}</p>
                    </div>
                    <div className="meta">
                      <span className="data-values">
                        {org.users_count || 0}
                        &nbsp;
                        Users
                      </span>
                      <span className="data-values">
                        {org.groups_count || 0}
                        &nbsp;
                        Groups
                      </span>
                      <span className="data-values">
                        {org.teams_count || 0}
                        &nbsp;
                        Teams
                      </span>
                      <span className="data-values">
                        {org.suborganization_count || 0}
                        &nbsp;
                        Projects
                      </span>
                    </div>
                  </div>
                  <div className="crud">
                    <div
                      className="submit"
                      onClick={() => {
                        dispatch(setActiveOrganization(org));
                        dispatch(updateOrganizationScreen('intro'));
                      }}
                    >
                      Manage
                    </div>
                    <div
                      className="submit"
                      onClick={() => {
                        dispatch(setActiveOrganization(org));
                        dispatch(editOrganization(org));
                        dispatch(updateOrganizationScreen('edit-org'));
                      }}
                    >
                      Edit
                    </div>
                    <div
                      className="submit"
                      onClick={() => {
                        Swal.fire({
                          title: 'Are you sure?',
                          text: "You won't be able to revert this!",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#084892',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Yes, delete it!',
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            const resultDel = await dispatch(deleteOrganization(org));
                            if (resultDel) {
                              dispatch(updateOrganizationScreen('feedback'));
                              dispatch(updateFeedbackScreen('delete'));
                            }
                          }
                        });
                      }}
                    >
                      Delete
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <Alert style={{ marginTop: '15px' }} variant="warning">No Organizations Available, kindly create a new one.</Alert>}
      </div>
    ) : <Alert style={{ marginTop: '15px' }} variant="primary">Loading ...</Alert>

  );
};

export default memo(AllOrganizations);
