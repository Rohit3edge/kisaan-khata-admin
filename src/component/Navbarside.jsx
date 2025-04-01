import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import logo from "../img/logos/kisaankhatalogo.png";
// import logo from '../assets/img/brand/logo.png';
import logoLight from '../assets/img/brand/logo-light.png';
import flagFrance from '../assets/img/flags/french_flag.jpg';
import flagGermany from '../assets/img/flags/germany_flag.jpg';
import flagItaly from '../assets/img/flags/italy_flag.jpg';
import flagRussia from '../assets/img/flags/russia_flag.jpg';
import flagSpain from '../assets/img/flags/spain_flag.jpg';
import userImg1 from '../assets/img/users/1.jpg';
import userImg5 from '../assets/img/users/5.jpg';
import userImg2 from '../assets/img/users/2.jpg';
import userImg3 from '../assets/img/users/3.jpg';



const Navbarside = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState("");
  const [selectedNav, setSelectedNav] = useState("Dashboard"); 
  const [bankData, setBankData] = useState();

  const open = () => {
    document.getElementById("side").classList.toggle("show");
  };

  const drop = () => {
    document.getElementById("usermenu").classList.toggle("showuser");
  };

  let data = JSON.parse(localStorage.getItem("user"));
  const name = data?.data?.name;
  const user_type = data?.data?.user_type;


  const signOut = (e) => {

    localStorage.clear();
    Cookies.remove("user");
    navigate("/login");
  };

  return (
    <>
      <div className="main-header side-header header top-header">
        <div className="container">
          <div className="main-header-left">
            <a className="main-header-menu-icon d-lg-none" href="" id="mainNavShow"><span></span></a>
            <a className="main-logo" href="/">
              <img src={logo} className="header-brand-img desktop-logo" style={{ height: "54px" }} alt="logo" />
              <img src={logoLight} className="header-brand-img desktop-logo theme-logo" alt="logo" />
            </a>
          </div>
          <div className="main-header-center">
            <div className="responsive-logo">
              <a href="index.html"><img src={logo} className="mobile-logo" style={{ height: "54px" }} alt="logo" /></a>
              <a href="index.html"><img src={logoLight} className="mobile-logo-dark" alt="logo" /></a>
            </div>
          </div>
             <Link to="/login" onClick={signOut} className="btn btn-success">
                Logout
              </Link>
         
        </div>
      </div>

    <div className="main-navbar hor-menu sticky">
				<div className="container">
              <ul className="nav">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/"><i className="ti-home"></i>Dashboard</NavLink>
                </li>
                {/* <li className="nav-item">
                  <NavLink className="nav-link" to="#"><i className="ti-package"></i>Inventory</NavLink>
                </li> */}
                {user_type === "Admin" && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/partners/list"><i className="ti-exchange-vertical"></i>Partners</NavLink>
                  </li>
                )}

                <li className="nav-item">
                    <NavLink className="nav-link" to="/licence/list"><i className="ti-exchange-vertical"></i>Partners Licence</NavLink>
                </li>
                

                <li className="nav-item">
                  <NavLink className="nav-link" to="/clients/list"><i className="ti-user"></i>Clients</NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/compliance/list"><i className="ti-user"></i>Compliance Master</NavLink>
                </li>


                {/* <li className="nav-item">
                  <NavLink className="nav-link" to="#"><i className="ti-bell"></i>Notifications</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="#"><i className="ti-shopping-cart"></i>Shop</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="#"><i className="ti-id-badge"></i>Contacts</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="#"><i className="ti-settings"></i>Setting</NavLink>
                </li> */}
              </ul>
				</div>
			</div>
    </>
  );
};

export default Navbarside;
