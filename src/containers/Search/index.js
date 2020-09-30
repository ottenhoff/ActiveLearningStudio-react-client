/* eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Accordion,
  Card,
  Tabs,
  Tab,
  Modal,
  Dropdown,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2'
import Pagination from 'react-js-pagination';

import { simpleSearchAction, cloneProject } from 'store/actions/search';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Sidebar from 'components/Sidebar';
import CloneModel from './CloneModel';

import './style.scss';

var paginationStarter =  true

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Please select where you would like
          {' '}
          <b>{props.clone ? props.clone.title : ''}</b>
          {' '}
          {props.clone ? props.clone.model : ''}
          {' '}
          to be cloned
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <CloneModel clone={props} />
      </Modal.Body>
    </Modal>
  );
}

MyVerticallyCenteredModal.propTypes = {
  clone: PropTypes.object,
};

MyVerticallyCenteredModal.defaultProps = {
  clone: null,
};

function SearchInterface() {
  const allState = useSelector((state) => state.search);

  const [modalShow, setModalShow] = useState(false);
  const [search, setSearch] = useState([]);
  const [searchQueries, SetSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [meta, setMeta] = useState({});
  const [clone, setClone] = useState();
  const [activePage, setActivePage] =  useState(1)
  const [totalCount,setTotalCount] = useState(0)
  const [activeModel, setActiveModel] =  useState('')

  useEffect(() => {
    if(!!allState.searchResult){
      if (allState.searchResult.length > 0) {
        setSearch(allState.searchResult);
        SetSearchQuery(allState.searchQuery);
        setMeta(allState.searchMeta);
        localStorage.setItem('loading', 'false');
        Swal.close();
      } else if (allState.searchResult.length === 0) {
        setSearch([]);
        SetSearchQuery(allState.searchQuery);
        setMeta({});
        localStorage.setItem('loading', 'false');
        Swal.close();
      }
    }
  }, [allState.searchMeta, allState.searchQuery, allState.searchResult]);

  useEffect(() => {
    if (!!allState.searchResult) {
      if (allState.searchResult.length > 0 && paginationStarter) {
        paginationStarter = false;
        setTotalCount(allState.searchMeta.total);
      }
    }
  }, [allState.searchMeta]);

  useEffect(() => {
    if (localStorage.getItem('loading') === 'true') {
      Swal.fire({
        html: 'Searching...', // add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      });
    }
  });

  useEffect(() => {
    setTimeout(() => {
      Swal.close();
      localStorage.setItem('loading', 'false');
    }, 5000);
  });

  // useEffect(() => {
  //   console.log(more.current.getBoundingClientRect());
  // }, [window.screenY]);

  const dispatch = useDispatch();

  return (
    <>
      <Header />

      <div className="main-content-wrapper">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>

        <div className="content-wrapper">
          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            className="clone-lti"
            clone={clone}
          />

          <div className="content">
            <div className="search-result-main">
              <div className="total-count">
                {!!search && (
                  <div>
                    Showing
                    {' '}
                    {search ? meta.total : '0'}
                    {' '}
                    results For
                    {' '}
                    <span>{searchQueries}</span>
                  </div>
                )}
              </div>

              <div className="main-content-search">
                <div className="left-search">
                  <div className="search-library">
                    <Accordion defaultActiveKey="0">
                      <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                          Search Library
                          <FontAwesomeIcon className="ml-2" icon="plus" />
                        </Accordion.Toggle>

                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div className="body-search">
                              <input
                                value={searchInput}
                                onChange={(e) => {
                                  setSearchInput(e.target.value);
                                }}
                                type="text"
                                placeholder="Search"
                              />

                              <div
                                className="src-btn"
                                onClick={() => {
                                  if (!searchInput.trim()) {
                                    Swal.fire('Search field is required.');
                                  } else if (searchInput.length > 255) {
                                    Swal.fire('Character limit should be less then 255.');
                                  } else {
                                    Swal.fire({
                                      html: 'Searching...', // add html attribute if you want or remove
                                      allowOutsideClick: false,
                                      onBeforeOpen: () => {
                                        Swal.showLoading();
                                      },
                                    });
                                    dispatch(simpleSearchAction(searchInput.trim(), 0, 20));
                                  }
                                  // setModalShow(true);
                                }}
                              >
                                Search
                              </div>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </div>

                  {/*
                  <div className="refine-search">
                    <div className="headline">Refine your search</div>

                    <Accordion defaultActiveKey="">
                      <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                          Subject
                          <FontAwesomeIcon className="ml-2" icon="plus" />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body></Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                          Education Level
                          <FontAwesomeIcon className="ml-2" icon="plus" />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                          <Card.Body></Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="2">
                          Rating
                          <FontAwesomeIcon className="ml-2" icon="plus" />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="2">
                          <Card.Body></Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="3">
                          Type
                          <FontAwesomeIcon className="ml-2" icon="plus" />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="3">
                          <Card.Body></Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </div>
                  */}
                </div>

                <div className="right-search">
                  <Tabs
                    defaultActiveKey="total"
                    id="uncontrolled-tab-example"
                    onSelect={async e => {
                      if (e === 'total') {
                        const resultModel = await dispatch(simpleSearchAction(searchQueries.trim(), 0, 20));
                        setTotalCount(resultModel.meta[e]);
                        setActiveModel(e);
                        setActivePage(1);
                      } else {
                        const resultModel = await dispatch(simpleSearchAction(searchQueries.trim(), 0, 20, e));
                        setTotalCount(resultModel.meta[e]);
                        setActiveModel(e);
                        setActivePage(1);
                      }
                    }}
                  >
                    <Tab
                      eventKey="total"
                      title={
                        !!search && !!meta.total
                          ? `all (${meta.total})`
                          : 'all (0)'
                      }
                    >
                      <div className="results_search">
                        {!!search && search.length > 0 ? (
                          search.map((res) => (
                            <div className="box">
                              <div className="imgbox">
                                {res.thumb_url ? (
                                  <div
                                    style={{
                                      backgroundImage: res.thumb_url.includes('pexels.com')
                                        ? `url(${res.thumb_url})`
                                        : `url(${global.config.resourceUrl}${res.thumb_url})`,
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      backgroundImage: 'https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;fit=crop&amp;h=200&amp;w=280',
                                    }}
                                  />
                                )}

                                {/* <h5>CALCULUS</h5> */}
                              </div>
                              <div className="content">
                                <div className="search-content">
                                  <a
                                    href={
                                      res.model === 'Activity'
                                        ? `/activity/${res.id}/shared`
                                        : res.model === 'Playlist'
                                          ? `/playlist/${res.id}/preview/lti`
                                          : `/project/${res.id}/shared`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <h2>{res.title || res.name}</h2>
                                  </a>
                                  <ul>
                                    <li>
                                      by
                                      {' '}
                                      <span className="author">
                                        {res.user_name}
                                      </span>
                                    </li>
                                    <li>
                                      Type
                                      {' '}
                                      <span className="type">{res.model}</span>
                                    </li>
                                    {/* <li>
                                      Member Rating{" "}
                                      <span className="type">Project</span>
                                    </li> */}
                                  </ul>
                                  <p>{res.description}</p>
                                </div>
                                <Dropdown>
                                  <Dropdown.Toggle>
                                    <FontAwesomeIcon icon="ellipsis-v" />
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    <div
                                      onClick={() => {
                                        if (res.model === 'Project') {
                                          Swal.fire({
                                            html: `You have selected <strong>${res.title}</strong> ${res.model}<br>Do you want to continue ?`,
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Ok',
                                          })
                                            .then((result) => {
                                              if (result.value) {
                                                cloneProject(res.id);
                                              }
                                            });
                                        } else {
                                          setModalShow(true);
                                          setClone(res);
                                        }
                                      }}
                                    >
                                      <FontAwesomeIcon className="mr-2" icon="clone" />
                                      Clone
                                    </div>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="box">No result found !</div>
                        )}
                      </div>
                    </Tab>

                    <Tab
                      eventKey="projects"
                      title={
                        !!search && !!meta.projects
                          ? `project (${meta.projects})`
                          : 'project (0)'
                      }
                    >
                      <div className="results_search">
                        {!!search && search.length > 0 ? (
                          search.map((res) => (
                            <>
                              {res.model === 'Project' && (
                                <div className="box">
                                  <div className="imgbox">
                                    {res.thumb_url ? (
                                      <div
                                        style={{
                                          backgroundImage: res.thumb_url.includes('pexels.com')
                                            ? `url(${res.thumb_url})`
                                            : `url(${global.config.resourceUrl}${res.thumb_url})`,
                                        }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          backgroundImage: 'https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;fit=crop&amp;h=200&amp;w=280',
                                        }}
                                      />
                                    )}

                                    {/* <h5>CALCULUS</h5> */}
                                  </div>
                                  <div className="content">
                                    <div className="search-content">
                                      <a
                                        href={
                                          res.model === 'Activity'
                                            ? `/activity/${res.id}/shared`
                                            : res.model === 'Playlist'
                                              ? `/playlist/${res.id}/preview/lti`
                                              : `/project/${res.id}/shared`
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <h2>{res.title || res.name}</h2>
                                      </a>
                                      <ul>
                                        <li>
                                          by
                                          {' '}
                                          <span className="author">
                                            {res.user_name}
                                          </span>
                                        </li>
                                        <li>
                                          Type
                                          {' '}
                                          <span className="type">{res.model}</span>
                                        </li>
                                        {/* <li>
                                          Member Rating{" "}
                                          <span className="type">Project</span>
                                        </li> */}
                                      </ul>
                                      <p>{res.description}</p>
                                    </div>
                                    <Dropdown>
                                      <Dropdown.Toggle>
                                        <FontAwesomeIcon icon="ellipsis-v" />
                                      </Dropdown.Toggle>

                                      <Dropdown.Menu>
                                        <div
                                          onClick={() => {
                                            if (res.model === 'Project') {
                                              Swal.fire({
                                                html: `You have selected <strong>${res.title}</strong> ${res.model}<br>Do you want to continue ?`,
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Ok',
                                              })
                                                .then((result) => {
                                                  if (result.value) {
                                                    cloneProject(res.id);
                                                  }
                                                });
                                            } else {
                                              setModalShow(true);
                                              setClone(res);
                                            }
                                          }}
                                        >
                                          <FontAwesomeIcon className="mr-2" icon="clone" />
                                          Clone
                                        </div>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              )}
                            </>
                          ))
                        ) : (
                          <div className="box">No result found !</div>
                        )}
                      </div>
                    </Tab>

                    <Tab
                      eventKey="playlists"
                      title={
                        !!search && !!meta.playlists
                          ? `playlist (${meta.playlists})`
                          : 'playlist (0)'
                      }
                    >
                      <div className="results_search">
                        {!!search && search.length > 0 ? (
                          search.map((res) => (
                            <>
                              {res.model === 'Playlist' && (
                                <div className="box">
                                  <div className="imgbox">
                                    {res.thumb_url ? (
                                      <div
                                        style={{
                                          backgroundImage: res.thumb_url.includes('pexels.com')
                                            ? `url(${res.thumb_url})`
                                            : `url(${global.config.resourceUrl}${res.thumb_url})`,
                                        }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          backgroundImage: 'https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;fit=crop&amp;h=200&amp;w=280',
                                        }}
                                      />
                                    )}

                                    {/* <h5>CALCULUS</h5> */}
                                  </div>

                                  <div className="content">
                                    <div className="search-content">
                                      <a
                                        href={
                                          res.model === 'Activity'
                                            ? `/activity/${res.id}/shared`
                                            : res.model === 'Playlist'
                                              ? `/playlist/${res.id}/preview/lti`
                                              : `/project/${res.id}/shared`
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <h2>{res.title || res.name}</h2>
                                      </a>
                                      <ul>
                                        <li>
                                          by
                                          {' '}
                                          <span className="author">
                                            {res.user_name}
                                          </span>
                                        </li>
                                        <li>
                                          Type
                                          {' '}
                                          <span className="type">{res.model}</span>
                                        </li>
                                        {/* <li>
                                          Member Rating{" "}
                                          <span className="type">Project</span>
                                        </li> */}
                                      </ul>
                                      <p>{res.description}</p>
                                    </div>

                                    <Dropdown>
                                      <Dropdown.Toggle>
                                        <FontAwesomeIcon icon="ellipsis-v" />
                                      </Dropdown.Toggle>

                                      <Dropdown.Menu>
                                        <div
                                          onClick={() => {
                                            if (res.model === 'Project') {
                                              Swal.fire({
                                                html: `You have selected <strong>${res.title}</strong> ${res.model}<br>Do you want to continue ?`,
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Ok',
                                              })
                                                .then((result) => {
                                                  if (result.value) {
                                                    cloneProject(res.id);
                                                  }
                                                });
                                            } else {
                                              setModalShow(true);
                                              setClone(res);
                                            }
                                          }}
                                        >
                                          <FontAwesomeIcon className="mr-2" icon="clone" />
                                          Clone
                                        </div>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              )}
                            </>
                          ))
                        ) : (
                          <div className="box">No result found !</div>
                        )}
                      </div>
                    </Tab>

                    <Tab
                      eventKey="activities"
                      title={
                        !!search && !!meta.activities
                          ? `activity (${meta.activities})`
                          : 'activity (0)'
                      }
                    >
                      <div className="content">
                        <div className="results_search">
                          {!!search && search.length > 0 ? (
                            search.map((res) => (
                              <>
                                {res.model === 'Activity' && (
                                  <div className="box">
                                    <div className="imgbox">
                                      {res.thumb_url ? (
                                        <div
                                          style={{
                                            backgroundImage: res.thumb_url.includes('pexels.com')
                                              ? `url(${res.thumb_url})`
                                              : `url(${global.config.resourceUrl}${res.thumb_url})`,
                                          }}
                                        />
                                      ) : (
                                        <div
                                          style={{
                                            backgroundImage: 'https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;fit=crop&amp;h=200&amp;w=280',
                                          }}
                                        />
                                      )}

                                      {/* <h5>CALCULUS</h5> */}
                                    </div>

                                    <div className="content">
                                      <div className="search-content">
                                        <a
                                          href={
                                            res.model === 'Activity'
                                              ? `/activity/${res.id}/shared`
                                              : res.model === 'Playlist'
                                                ? `/playlist/${res.id}/preview/lti`
                                                : `/project/${res.id}/shared`
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <h2>{res.title || res.name}</h2>
                                        </a>
                                        <ul>
                                          <li>
                                            by
                                            {' '}
                                            <span className="author">
                                              {res.user_name}
                                            </span>
                                          </li>
                                          <li>
                                            Type
                                            {' '}
                                            <span className="type">{res.model}</span>
                                          </li>
                                          {/* <li>
                                            Member Rating{" "}
                                            <span className="type">Project</span>
                                          </li> */}
                                        </ul>
                                        <p>{res.description}</p>
                                      </div>

                                      <Dropdown>
                                        <Dropdown.Toggle>
                                          <FontAwesomeIcon icon="ellipsis-v" />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <div
                                            onClick={() => {
                                              if (res.model === 'Project') {
                                                Swal.fire({
                                                  html: `You have selected <strong>${res.title}</strong> ${res.model}<br>Do you want to continue ?`,
                                                  showCancelButton: true,
                                                  confirmButtonColor: '#3085d6',
                                                  cancelButtonColor: '#d33',
                                                  confirmButtonText: 'Ok',
                                                }).then((result) => {
                                                  if (result.value) {
                                                    cloneProject(res.id);
                                                  }
                                                });
                                              } else {
                                                setModalShow(true);
                                                setClone(res);
                                              }
                                            }}
                                          >
                                            <FontAwesomeIcon className="mr-2" icon="clone" />
                                            Clone
                                          </div>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                )}
                              </>
                            ))
                          ) : (
                            <div className="box">No result found !</div>
                          )}
                        </div>
                      </div>
                    </Tab>
                  </Tabs>

                  {/*
                  <div ref={more} className="">
                    Loading More
                  </div>
                  */}

                  {totalCount > 20 && (
                    <Pagination
                      activePage={activePage}
                      itemsCountPerPage={20}
                      totalItemsCount={totalCount}
                      pageRangeDisplayed={8}
                      onChange={e => {
                        setActivePage(e);
                        if (activeModel === 'total') {
                          dispatch(simpleSearchAction(searchQueries.trim(), e * 20 - 20, 20));
                        } else {
                          dispatch(simpleSearchAction(searchQueries.trim(), e * 20 - 20, 20, activeModel));
                        }
                      }}
                      itemClass="page-item"
                      linkClass="page-link"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SearchInterface;
