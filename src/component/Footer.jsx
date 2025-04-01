import React, { Component } from "react";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div className="row mt-5" >
        <div className="col-md-12 p-0 " >
            <div className="main-footer text-center fixed-footer">
                <div className="container">
                    <div className="row row-sm">
                        <div className="col-md-12">
                            <span>Copyright © 2024 <a href="#" className="footer_url">Kisaan Khata</a>. Developed by <a className="footer_url" href="https://www.3edgetechnologies.com/">3 Edge Technologies</a> All rights reserved.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Footer;
