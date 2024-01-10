import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacility.scss';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
import './List.scss';
import HomeHeader from '../HomeHeader';

class MedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : []
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    render() {
        let { dataClinics } = this.state;
        return (
            <>
                <HomeHeader></HomeHeader>
                <div className='medical-facility'>
                    <div className='container'>
                        <div className='section-header'>
                            <span className='title-section'>DANH SÁCH CƠ SỞ Y TẾ</span>
                        </div>
                        <div className='body'>

                            {dataClinics && dataClinics.length > 0 &&
                                dataClinics.map((item, index) => {
                                    return (
                                        <div className='section-customize clinic-child'
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div className='bg-image section-medical-facility'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                            </div>
                                            <div className='clinic-name'>{item.name}</div>

                                        </div>
                                    )
                                })

                            }
                        </div>

                    </div>
                </div>

            </>

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
