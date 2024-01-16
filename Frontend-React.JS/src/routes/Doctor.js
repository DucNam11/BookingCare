import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import Header from '../containers/Header/Header';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import ManageHistory from '../containers/System/Doctor/ManageHistory';
import ManageScheduleDoctor from '../containers/System/Doctor/ManageScheduleDoctor';
import PatientManage from '../containers/System/Doctor/PatientManage';
class Doctor extends Component {
    render() {
        const { isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/doctor/manage-schedule" component={ManageScheduleDoctor} />
                            <Route path="/doctor/manage-patient" component={ManagePatient} />
                            <Route path="/doctor/manage-patient-history" component={ManageHistory} />
                            <Route path="/doctor/patient" component={PatientManage} />


                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
