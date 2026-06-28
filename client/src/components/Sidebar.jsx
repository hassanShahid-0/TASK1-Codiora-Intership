import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark border-end border-secondary border-opacity-25 sidebar-container">
      <ul className="nav nav-pills flex-column mb-auto gap-2">
        <li className="nav-item">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-white ${
                isActive ? 'active bg-primary' : 'hover-opacity'
              }`
            }
          >
            <i className="bi bi-speedometer2 fs-5"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-white ${
                isActive ? 'active bg-primary' : 'hover-opacity'
              }`
            }
          >
            <i className="bi bi-person-badge fs-5"></i>
            <span>Portfolio</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/skills"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-white ${
                isActive ? 'active bg-primary' : 'hover-opacity'
              }`
            }
          >
            <i className="bi bi-journal-code fs-5"></i>
            <span>Skills</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-white ${
                isActive ? 'active bg-primary' : 'hover-opacity'
              }`
            }
          >
            <i className="bi bi-code-slash fs-5"></i>
            <span>Projects</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-white ${
                isActive ? 'active bg-primary' : 'hover-opacity'
              }`
            }
          >
            <i className="bi bi-tags fs-5"></i>
            <span>Categories</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/preview"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-white ${
                isActive ? 'active bg-primary' : 'hover-opacity'
              }`
            }
          >
            <i className="bi bi-eye fs-5"></i>
            <span>Live Preview</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
