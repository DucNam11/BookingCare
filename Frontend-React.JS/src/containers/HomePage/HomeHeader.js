import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import * as actions from '../../store/actions';
import { changeLanguageApp } from '../../store/actions';
import { withRouter } from 'react-router';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import Select from 'react-select'
import logo from '../../assets/images/logo.svg'

class HomeHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            listClinic: [],
            listSpecialty: [],
            listDoctors: [],
            selectedOption: '',
        }
    }

    componentDidMount() {
        this.props.getRequiredDoctorInfor()
        this.props.fetchAllDoctors()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resSpecialty, resClinic } = this.props.allRequiredDoctorInfor
            let dataSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataClinic = this.buildDataInputSelect(resClinic, 'CLINIC')
            this.setState({
                listSpecialty: dataSpecialty,
                listClinic: dataClinic
            })
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = []
        let language = this.props.language
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item) => {
                    let object = {};
                    let labelVi = `${item.firstName} ${item.lastName}`
                    let labelEn = `${item.lastName} ${item.firstName}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.id
                    object.type = 'USERS'
                    object.image = item.image
                    result.push(object)
                })
            }
            if (type === 'SPECIALTY') {
                inputData.map((item) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id
                    object.image = item.image
                    object.type = 'SPECIALTY'
                    result.push(object)
                })
            }
            if (type === 'CLINIC') {
                inputData.map((item) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id
                    object.image = item.image
                    object.type = 'CLINIC'
                    result.push(object)
                })
            }

        }
        return result
    }


    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }

    handleChange = (selectedOption) => {
        if (selectedOption.type === 'SPECIALTY') {
            this.props.history.push(`/detail-specialty/${selectedOption.value}`)
        }
        if (selectedOption.type === 'CLINIC') {
            this.props.history.push(`/detail-clinic/${selectedOption.value}`)
        }
        if (selectedOption.type === 'USERS') {
            this.props.history.push(`/detail-doctor/${selectedOption.value}`)
        }
    }

    returnSpecialty = () => {
        if (this.props.history) {
            this.props.history.push(`/list-specialty`)
        }
    }

    returnDoctor = () => {
        if (this.props.history) {
            this.props.history.push(`/list-doctor`)
        }
    }

    returnMedicalFacility = () => {
        if (this.props.history) {
            this.props.history.push(`/list-medical-facility`)
        }
    }

    render() {
        console.log('checkk', this.props)
        let language = this.props.language;
        let { dropdownOpen, selectedOption, listSpecialty, listClinic, listDoctors } = this.state
        const groupedOptions = [
            {
                label: <FormattedMessage id='homeheader.speciality' />,
                options: listSpecialty,
            },
            {
                label: <FormattedMessage id='homeheader.health-facility' />,
                options: listClinic
            },
            {
                label: <FormattedMessage id='homeheader.doctor' />,
                options: listDoctors
            }
        ];
        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className='left-content'>
                            <i className='fas fa-bars'></i>
                            <img className='header-logo' src={logo} onClick={() => this.returnToHome()}></img>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'
                                onClick={() => this.returnSpecialty()}
                            >
                                <div><b><FormattedMessage id="homeheader.speciality"></FormattedMessage></b></div>
                                <div className='subs-title' ><FormattedMessage id="homeheader.searchdoctor"></FormattedMessage></div>
                            </div>
                            <div className='child-content'
                                onClick={() => this.returnMedicalFacility()}
                            >
                                <div><b><FormattedMessage id="homeheader.health-facility"></FormattedMessage></b></div>
                                <div className='subs-title' ><FormattedMessage id="homeheader.select-room"></FormattedMessage></div>
                            </div>
                            <div className='child-content'
                                onClick={() => this.returnDoctor()}
                            >
                                <div><b><FormattedMessage id="homeheader.doctor"></FormattedMessage></b></div>
                                <div className='subs-title' ><FormattedMessage id="homeheader.select-doctor"></FormattedMessage></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.fee"></FormattedMessage></b></div>
                                <div className='subs-title' ><FormattedMessage id="homeheader.check-health"></FormattedMessage></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'> <i className='fas fa-question-circle'></i>
                                <FormattedMessage id="homeheader.support"></FormattedMessage>
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span>
                            </div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                            </div>
                            {/* <div className='login'>
                                <button onClick={() => this.changeLanguage(LANGUAGES.EN)}><FormattedMessage id="homeheader.login"></FormattedMessage></button>
                            </div> */}

                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="banner.title1"></FormattedMessage></div>
                            <div className='title2'><FormattedMessage id="banner.title2"></FormattedMessage></div>
                            <div className='search'>
                                <i className='fas fa-search'></i>
                                <Select
                                    value={selectedOption}
                                    onChange={this.handleChange}
                                    options={groupedOptions}
                                    placeholder={'Search'}
                                    isSearchable={true}
                                    isLoading={true}
                                />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-hospital'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child1"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-mobile-alt'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child2"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-procedures'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child3"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-flask'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child4"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-user-md'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child5"></FormattedMessage></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-briefcase-medical'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child6"></FormattedMessage></div>
                                </div>
                            </div>
                        </div>
                    </div>

                }

            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()),
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));