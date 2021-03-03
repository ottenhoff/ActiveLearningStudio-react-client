import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import foldericon from 'assets/images/sidebar/folder-icon.png';
// // import teamicon from 'assets/images/sidebar/team-icon.png';
// import dashboardicon from 'assets/images/sidebar/dashboard-icon.png';
import backgroundimg from 'assets/images/sidebar/background.png';

import {
  allSidebarProjects,
} from 'store/actions/project';
import { loadTeamsAction } from 'store/actions/team';

import './style.scss';

const PROJECTS = 'projects';
const CHANNEL = 'channel';
const TEAM = 'team';

function Sidebar(props) {
  const { history, location } = props;

  const dispatch = useDispatch();

  const allState = useSelector((state) => state);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (location.pathname.includes('teams/')) {
      const teamId = parseInt(location.pathname.split('teams/')[1], 10);
      if (teamId) {
        setSelectedTeam(teamId);

        if (location.pathname.includes(PROJECTS)) {
          setSelectedCategory(PROJECTS);
        } else if (location.pathname.includes(CHANNEL)) {
          setSelectedCategory(CHANNEL);
        } else {
          setSelectedCategory(TEAM);
        }
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!allState.sidebar.isLoaded) {
      dispatch(allSidebarProjects());
      dispatch(loadTeamsAction());
    }
  }, [allState.sidebar.isLoaded, dispatch]);

  const handleClickTeam = useCallback((team) => {
    history.push(`/teams/${team.id}`);
  }, [history]);

  return (
    <aside className="sidebar-all">
      <Link to="/">
        <div className="menu-title">
          <FontAwesomeIcon icon="folder" className="mr-2" />
          My Projects
        </div>
      </Link>

      <ul className="all-project">
        {allState.sidebar.allProject.slice(0, 5).map((data) => (
          <li key={data.id}>
            <Link to={`/project/${data.id}`}>
              <FontAwesomeIcon icon="angle-right" className="mr-2" />
              {data.name}
            </Link>
          </li>
        ))}

        <Link className="expand" to="/projects">
          Explore All
          <FontAwesomeIcon icon="arrow-right" className="ml-2" />
        </Link>
      </ul>

      <Link to="/dashboard">
        <div className="menu-title">
          <FontAwesomeIcon icon="tachometer-alt" className="mr-2" />
          Dashboard & Stats
        </div>
      </Link>

      {/* <Link to="/teams">
        <div className="menu-title">
          <img src={teamicon} alt="" />
          Teams
        </div>
      </Link>
      <div className="menu-title create-button">
        <Link to="/teams/create-team">
          <div>
            <FontAwesomeIcon width="7px" icon="plus" className="mr-2" />
            Create Team
          </div>
        </Link>
      </div>
      <Link to="/groups">
        <div className="menu-title">
          <FontAwesomeIcon icon="users" className="mr-2" />
          Groups
        </div>
      </Link>
      <div className="menu-title create-button">
        <Link to="/groups/create-group">
          <div>
            <FontAwesomeIcon width="7px" icon="plus" className="mr-2" />
            Create Group
          </div>
        </Link>
      </div> */}
      {false && allState.team.teams.map((team) => (
        <div key={team.id} className={`team-item${selectedTeam === team.id ? '' : ' collapsed'}`}>
          <div className="team-label" onClick={() => handleClickTeam(team)}>
            {team.name}
            <FontAwesomeIcon
              icon={selectedTeam === team.id ? 'angle-up' : 'angle-down'}
              className="ml-2 mt-1"
            />
          </div>

          <div className="team-detail-labels">
            <Link
              to={`/teams/${team.id}`}
              className={selectedCategory === TEAM ? 'active-label' : ''}
            >
              <FontAwesomeIcon icon="user-friends" className="mr-2" />
              Team Members
            </Link>
            <Link
              to={`/teams/${team.id}/projects`}
              className={selectedCategory === PROJECTS ? 'active-label' : ''}
            >
              <span className="project-title">Projects</span>
            </Link>
            {/*
            <Link
              to={`/teams/${team.id}/channel`}
              className={selectedCategory === CHANNEL ? 'active-label' : ''}
            >
              <span className="channel-title">Channels</span>
            </Link>
            */}
          </div>
          <img src={backgroundimg} alt="" />
        </div>
      ))}
    </aside>
  );
}

Sidebar.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(Sidebar);
