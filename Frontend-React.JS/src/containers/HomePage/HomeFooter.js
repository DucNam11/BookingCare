import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeFooter.scss'
import { FormattedMessage } from 'react-intl';
import { imgHomeHeader } from './ImgList'
import { withRouter } from 'react-router'
import HealthBooking from '../../assets/images/HealthBooking.svg'

class HomeFooter extends Component {

    render() {

        return (
            <>
                <footer className='footer'>
                    <div className='home-footer-container text-light-white '>
                        <div className='home-footer-content container'>
                            <div className='footer-upper row'>
                                <div className='col-footer about col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6'>
                                    <span className='title'><FormattedMessage id="footerabout.aboutus" /></span>
                                    <ul className='items'>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerabout.mysystem" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerabout.ourdoctor" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerabout.cooperate" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerabout.recruitment" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerabout.news" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerabout.policy" /></a>
                                        </li>
                                    </ul>
                                </div>
                                <div className='col-footer service col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6'>
                                    <span className='title'><FormattedMessage id="footerservice.myservice" /></span>
                                    <ul className='items'>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerservice.make" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerservice.package" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerservice.customer" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerservice.resolve" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerservice.how" /></a>
                                        </li>
                                        <li className='item'>
                                            <a href='' className='item-link'><FormattedMessage id="footerservice.faq" /></a>
                                        </li>
                                    </ul>
                                </div>
                                <div className='col-footer contact col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6'>
                                    <div className='logo-footer'>
                                        <img className='logo-img' src={HealthBooking} />
                                    </div>
                                    <ul className='items'>
                                        <li className='item name'><FormattedMessage id="footercontact.name" /></li>
                                        <li className='item'>
                                            <i className="fas fa-map-marker-alt"></i>
                                            <FormattedMessage id="footercontact.address" /></li>
                                        <li className='item'>
                                            <i className="fas fa-mobile-alt"></i> +84(0) 367 582 193</li>
                                        <li className='item'>
                                            <i className="far fa-envelope"></i>
                                            danletuan@gmail.com</li>
                                        <li className='item sign-log'>
                                            {/* <a className='signup' href='/sign-up'><FormattedMessage id="footercontact.signup" /></a>
                                            <a className='login' href='/login'><FormattedMessage id="footercontact.login" /></a> */}
                                        </li>
                                    </ul>
                                </div>
                                <div className='col-footer download col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6'>
                                    <div className='items'>
                                        <div className='qrcode'>
                                            <img className='img' src={imgHomeHeader.qrcode} />
                                        </div>
                                        <div className='store'>
                                            <img className='img' src={imgHomeHeader.google_play} />
                                            <img className='img' src={imgHomeHeader.app_store} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='qrcode-hover'>
                        <img className='qrcode-hover-img' src={imgHomeHeader.qrcode} />
                    </div>
                    <div className='home-footer-bottom '>
                        <div className='container'>
                            <div className='footer-bottom row'>
                                <span className='col-bottom copyright col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-4 col-12'>
                                    &copy; 2023 Copyright.</span>
                                <div className='col-bottom social-media col-xxl-2 col-xl-2 col-lg-3 col-md-2 col-sm-11 col-12'>
                                    <a className='media-link' target="_blank" href='https://www.facebook.com/'>
                                        <i className="fab fa-facebook"></i></a>
                                    <a className='media-link' target="_blank" href='https://www.youtube.com/'>
                                        <i className="fab fa-youtube"></i></a>
                                    <a className='media-link' target="_blank" href='https://github.com/'>
                                        <i className="fab fa-github"></i></a>
                                    <a className='media-link' target="_blank" href='https://www.linkedin.com/'>
                                        <i className="fab fa-linkedin"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </>
        );
    }

}


const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeFooter));