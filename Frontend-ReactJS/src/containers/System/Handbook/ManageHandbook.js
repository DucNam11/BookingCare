import React, {Component} from 'react';
import {connect} from 'react-redux';
import {CommonUtils, CRUD_ACTIONS, LANGUAGE} from '../../../utils';
import * as actions from '../../../store/actions';
import Select from 'react-select';
import {FormattedMessage} from 'react-intl';
import {FaFileUpload} from 'react-icons/fa';
import Lightbox from 'react-image-lightbox';
import './ManageHandbook.scss';
import {toast} from 'react-toastify';
import {createNewHandbook, editHandbookById, getAllHandbook} from "../../../services";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowBoxImage: false,
            isRoomImage: false,
            previewImageUrl: '',
            image: '',
            file: '',

            allDoctor: [],
            adviser: '',
            authors: '',
            name: '',
            contentHTML: '',
            contentMarkdown: '',

            isShowLoading: false,
        };
    }
    async componentDidMount() {
        this.props.fetchAllDoctorRedux();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let listDoctor = this.buildInputSelectName(this.props.allDoctors);
            this.setState({
                allDoctors: listDoctor,
            });
        }
    }

    handleGetAllHandbook = async () => {
        let {arrHandbook} = this.state
        let res = await getAllHandbook()
        if (res && res.errCode === 0) {
            this.setState({
                arrHandbook: res.data,
                action: CRUD_ACTIONS.CREATE,
            })
        }
    }

    buildInputSelectName = (data) => {
        let result = [];
        if (data && data.length > 0) {
            result = data.map((item, index) => {
                let object = {};
                let labelVi = `${item.firstName} ${item.lastName}`;
                let labelEn = `${item.lastName} ${item.firstName}`;
                object.label = this.props.languageRedux === LANGUAGE.VI ? labelVi : labelEn;
                object.value = item.id;
                return object;
            });
        }
        return result;
    };

    onChangeInput = (key, value) => {
        this.setState({
            [key]: value,
        });
    };
    handlePickDoctor = (e) => {
        let adviser = e.map((item) => item.value);
        this.setState({
            adviser: adviser.join(),
        });
    };
    handleEditorChange = (data) => {
        this.setState({
            contentHTML: data,
        });
    };
    handleOnchangeImage = async (e) => {
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({ previewImageUrl: objectUrl, isShowBoxImage: true, image: base64, file: file });
        }
    };
    handleSaveHandbook = async () => {
        let {action} = this.state
        if (action === CRUD_ACTIONS.CREATE) {
            let {userInfo} = this.props
            let res = await createNewHandbook({
                name: this.state.name,
                imageBase64: this.state.imageBase64,
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
                userId: userInfo.id,
            })
            if (res && res.errCode === 0) {
                toast.success('Save new specialty success')
                this.setState({
                    name: '',
                    imageBase64: '',
                    contentHTML: '',
                    contentMarkdown: '',
                    previewImgUrl: ''
                }, async () => {
                    await this.handleGetAllHandbook()
                })

            } else {
                toast.error('Something Wrong')
            }
        }
        if (action === CRUD_ACTIONS.EDIT) {
            let res = await editHandbookById({
                id: this.state.id,
                name: this.state.name,
                imageBase64: this.state.imageBase64,
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
            })
            if (res && res.errCode === 0) {
                toast.success('Save specialty success')
                this.setState({
                    id: '',
                    name: '',
                    imageBase64: '',
                    contentHTML: '',
                    contentMarkdown: '',
                    previewImgUrl: ''
                }, async () => {
                    await this.handleGetAllHandbook()
                })

            } else {
                toast.error('Something Wrong')
            }
        }
    }

    render() {
        let { allDoctors, authors, name } = this.state;
        return (
            <div className="handbook_container position-loading">


                <div className="handbook-title title">
                    <h3>Quản lý cẩm nang</h3>
                </div>

                <div className="wrapper-handbook w60">
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label forhtml="inputEmail4">Tiêu đề</label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputEmail4"
                                value={name}
                                onChange={(e) => this.onChangeInput('title', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-md-3 upload-file-container">
                            <label htmlFor="inputCity">Chọn ảnh chủ đề</label>
                            <div className="btn-container">
                                <input
                                    id="uploadFile"
                                    type="file"
                                    className="form-control"
                                    hidden
                                    onChange={(e) => this.handleOnchangeImage(e)}
                                />
                                <label className="text-upload" htmlFor="uploadFile">
                                    <FormattedMessage id="manage-user.uploadImage" />
                                    <FaFileUpload className="icon-upload" />
                                </label>
                                {this.state.isShowBoxImage && (
                                    <div
                                        className="preview pv-left preview-right"
                                        style={{ backgroundImage: `url(${this.state.previewImageUrl})` }}
                                        onClick={() => this.setState({ isRoomImage: true })}
                                    ></div>
                                )}
                            </div>
                            {this.state.isRoomImage && (
                                <Lightbox
                                    mainSrc={this.state.previewImageUrl}
                                    onCloseRequest={() => this.setState({ isRoomImage: false })}
                                />
                            )}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label forhtml="inputEmail4">Nhóm tác giả</label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputEmail4"
                                value={authors}
                                onChange={(e) => this.onChangeInput('authors', e.target.value)}
                            />
                        </div>
                        <div className=" form-group col-md-6">
                            <label>Nhóm cố vấn</label>
                            <Select
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                                isMulti
                                defaultValue={''}
                                onChange={(e) => this.handlePickDoctor(e)}
                                options={allDoctors}
                            />
                        </div>
                    </div>
                    <div className="manage-doctor-editor">
                        <MdEditor style={{height: '400px'}}
                                  renderHTML={text => mdParser.render(text)}
                                  onChange={this.handleEditorChange}
                                  value={this.state.contentMarkdown}
                        />
                    </div>
                    <div className="container_btn">
                        <button
                            className="btn btn-warning"
                            onClick={() => {
                                this.handleSaveHandbook();
                            }}
                        >
                            Đăng bài
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        languageRedux: state.app.language,
        allDoctorRedux: state.admin.allDoctors,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctorRedux: () => dispatch(actions.fetchAllDoctor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);