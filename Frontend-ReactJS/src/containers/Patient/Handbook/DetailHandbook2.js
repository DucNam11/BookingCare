import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { getDetailHandbookById } from '../../../services/userService';
import { BsLightbulbFill } from 'react-icons/bs';
import moment from 'moment';
import { convertKeyToValue } from '../../../utils';
import { getallcodeServive } from '../../../services/userService';

import './DetailHandbook.scss';

class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handbookData: {},
            keyForm: [],
        };
    }
    async componentDidMount() {
        let { match } = this.props;
        if (match && match.params && match.params.id) {
            let handbookId = match.params.id;
            let response = await getDetailHandbookById(handbookId);
            let PositionRes = await getallcodeServive('position');
            if (response && response.errorCode === 0) {
                this.setState({
                    handbookData: response.data,
                    keyForm: PositionRes.data,
                });
            }
        }
    }
    componentDidUpdate() {}

    render() {
        let { handbookData, keyForm } = this.state;
        let positionSender = '';
        let nameSender = '';
        let advisers = '';
        if (handbookData && handbookData.adviserData) {
            positionSender = convertKeyToValue(handbookData.senderData.position, keyForm);
            nameSender = `${handbookData.senderData.firstName} ${handbookData.senderData.lastName}`;
            advisers = handbookData.adviserData
                .map((item) => {
                    let position = convertKeyToValue(item?.position, keyForm) || 'Bác sĩ';
                    return `${position} ${item?.firstName} ${item?.lastName}`;
                })
                .join(';');
        }

        return (
            <div className="detail-clinic-wrapper">
                {/* <HomeHeader /> */}
                <div className="handbook-container coverArea">
                    <div className="handbook-wrapper">
                        <h1 className="handbook-title">{handbookData.title}</h1>
                        <div className="handbook-detail-info">
                            <li>Nhóm tác giả:&nbsp;{handbookData.authors}</li>
                            <li>Người kiểm duyệt:&nbsp;{`${positionSender} ${nameSender}`}</li>
                            <li>Cố vấn y khoa:&nbsp;{advisers}</li>
                            <li>Xuất bản:&nbsp; {moment(handbookData.createdAt).format('LL')},</li>
                            <li>
                                Cập nhật lần cuối:&nbsp;
                                {moment(handbookData.updatedAt).format('LL')}
                            </li>
                        </div>

                        <div className="intro-bookingCare ">
                            <div className="icon">
                                <BsLightbulbFill />
                            </div>
                            <h4>
                                BookingCare là Nền tảng Y tế chăm sóc sức khỏe toàn diện hàng đầu Việt Nam kết nối người
                                dùng với trên 150 bệnh viện - phòng khám uy tín, hơn 1,000 bác sĩ chuyên khoa giỏi và
                                hàng nghìn dịch vụ, sản phẩm y tế chất lượng cao.
                            </h4>
                        </div>
                        <div className="image-handbook">
                            <img src={handbookData.image} alt="img"></img>
                        </div>
                        <div
                            className="detail-clinic"
                            dangerouslySetInnerHTML={{ __html: handbookData.contentHTML }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        detailDoctorRedux: state.admin.detailDoctor,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchDetailDoctor: (id) => dispatch(actions.fetchDetailDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);