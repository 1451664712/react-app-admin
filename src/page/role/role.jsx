import React, {Component} from 'react'
import {Card, Button, message, Table, Modal} from 'antd'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles, reqAddRole, reqUpdateRole} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
// 时间格式化
import {formateDate} from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";


export default class User extends Component {
    state = {
        roles: [],
        role: {}, // 选中的role
        // disabled: true
        showStatus: 0 // 是否显示模态框，0都不显示 1显示 2显示更新
    }

    constructor (props) {
        super(props)
        this.auth = React.createRef()
    }
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: "创建时间",
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            }
        ];
    }

    onRow = (role) => {
        return {
            onClick: (event) => {
                if (role) {
                    this.setState({role})
                }
            }
        }
    }

    // 初始化列表
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({roles})
        }
    }
    // 显示添加模态框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    // 显示设置权限模态框
    showRole = () => {
        this.setState({
            showStatus: 2
        })
    }
    addRole = () => {
        this.form.validateFields(async (err, value) => {
            this.form.resetFields();
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })
                // 发请求更新分类
                const {roleName} = value
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    const role = result.data
                    this.setState((state) => ({
                        roles: [...state.roles, role]
                    }))
                    message.success('添加角色成功')
                } else {
                    message.error('添加角色失败')
                }
            }
        })
    }

    updateRole = async () => {
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
        const {role} = this.state
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        // 请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
           if (role._id === memoryUtils.user.role_id) {
               message.success('当前角色权限变更，请重新登录')
               memoryUtils.user = {}
               storageUtils.removeUser()
               this.props.history.replace('/login')
           } else {
               message.success('更新成功')
               this.setState({
                   roles: [...this.state.roles]
               })
           }
        }
    }
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }

    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles, role, showStatus} = this.state
        const title = (
            <span>
                <Button style={{marginRight: '20px'}} type="primary" onClick={this.showAdd}>添加角色</Button>
                <Button type="primary" disabled={!role._id} onClick={this.showRole}>设置权限</Button>
            </span>
        )
        return (
            <Card title={title} bordered={false}>
                <Table
                    bordered
                    rowKey="_id"
                    onRow={this.onRow}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({role})
                        }
                    }}
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true
                    }}
                />
                <Modal
                    title="添加角色"
                    visible={showStatus === 1}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm setForm={(form) => {this.form = form}}/>
                </Modal>
                <Modal
                    title="设置权限"
                    visible={showStatus === 2}
                    onOk={this.updateRole}
                    onCancel={this.handleCancel}
                >
                <AuthForm role={role} ref={this.auth}/>
                </Modal>
            </Card>
        )
    }
}
