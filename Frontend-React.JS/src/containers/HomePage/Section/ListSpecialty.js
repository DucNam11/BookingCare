import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router';
import HomeHeader from '../HomeHeader';
import './List.scss';


class ListSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
        };
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            });
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`)
        }
    }
    render() {
        let { dataSpecialty } = this.state;
        return (
            <>
                <HomeHeader></HomeHeader>
                <div className="section">
                    <div className="container">
                        <div className="section-header">
                            <span className="title-section">
                                DANH SÁCH CHUYÊN KHOA
                            </span>
                        </div>
                        <div className="body">
                            {dataSpecialty && dataSpecialty.length > 0 &&

                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div
                                            className="section-customize specialty-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailSpecialty(item)}

                                        >
                                            <div
                                                className="bg-image section-specialty"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div className="specialty-name">{item.name}</div>
                                        </div>
                                    );
                                })}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListSpecialty));
