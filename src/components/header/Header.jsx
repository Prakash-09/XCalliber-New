import React from 'react';
import './Header.scss';
import logo from '../../assets/Images/DD-Logo.svg';
import { Link } from 'react-router-dom';


export default class Header extends React.Component {

    render() {
        return (
            <div className="header-component container-fluid">
                <Link to="/">
                    <img src={logo} alt="digitaldots-logo" height="50px" width="50px" />
                    <span className="logo-title">XCalliber</span>
                </Link>
            </div>
        );
    }
}