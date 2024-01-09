import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageHistory.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientHistoryForDoctor, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManageHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: [],
            isShowLoading: false,
            pdfBlobUrls: {},
            // pdfBlob: null,
            // pdfUrl: '',
        }
    }

    async componentDidMount() {

        this.getDatePatient();
        // let { user } = this.props;
        // let { currentDate } = this.state;
        // let formatedDate = new Date(currentDate).getTime();
        // try {
        //     // Gửi yêu cầu tới API để nhận dữ liệu Blob
        //     const response = await fetch(getAllPatientHistoryForDoctor({
        //         doctorId: user.id,
        //         date: formatedDate
        //     }));
        //     const blob = await response.blob();

        //     // Tạo URL cho Blob nhận được
        //     const pdfUrl = URL.createObjectURL(blob);

        //     this.setState({
        //         pdfBlob: blob,
        //         pdfUrl: pdfUrl
        //     });
        // } catch (error) {
        //     console.error('Error fetching or loading PDF:', error);
        // }

    }

    getDatePatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        let res = await getAllPatientHistoryForDoctor({
            doctorId: user.id,
            date: formatedDate
        })
        if (res && res.errCode === 0) {
            let pdfBlobUrls = {};
            for (let item of res.data) {
                if (item.files) {
                    const blob = new Blob([item.files]);
                    const pdfUrl = URL.createObjectURL(blob);
                    pdfBlobUrls[item.id] = pdfUrl;
                }
            }
            this.setState({
                dataPatient: res.data,
                pdfBlobUrls: pdfBlobUrls, // Cập nhật trạng thái mới
            })
            // this.setState({
            //     dataPatient: res.data
            // })
        }


    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }


    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        }, async () => {
            await this.getDatePatient()
        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.HistoryData.email,
            timeType: item.timeType,
            patientName: item.HistoryData.firstName,
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data,
        })


    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {},
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        })
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName,

        })
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send Remedy succeeds!')
            this.closeRemedyModal();
            await this.getDatePatient()
        }
        else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Something wrongs...')
        }
    }



    render() {

        let { dataPatient, isOpenRemedyModal, dataModal, pdfBlobUrls } = this.state;
        let { language } = this.props;
        console.log(dataPatient)
        return (
            <>

                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'>
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Quản lý Lịch sử khám bệnh
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám </label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ và tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Giới tính</th>
                                            <th>Kết quả khám bệnh</th>

                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((item, index) => {
                                                let time = language === LANGUAGES.VI ? item.timeTypeDataHistory.valueVi : item.timeTypeDataHistory.valueEn;
                                                let gender = language === LANGUAGES.VI ? item.HistoryData.genderData.valueVi : item.HistoryData.genderData.valueEn;
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.HistoryData.firstName}</td>
                                                        <td>{item.HistoryData.address}</td>
                                                        <td>{gender}</td>
                                                        <td>
                                                            {pdfBlobUrls[item.id] ? (
                                                                <a
                                                                    href={pdfBlobUrls[item.id]} // Sử dụng URL Blob đã tạo
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download={`file_${index}.pdf`} // Tên file khi tải xuống
                                                                >
                                                                    Download File
                                                                </a>
                                                            ) : (
                                                                <span>File not available</span>
                                                            )}
                                                        </td>
                                                    </tr>

                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan='6' style={{ textAlign: 'center' }}>No data</td>
                                            </tr>

                                        }
                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            </>

        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageHistory);
