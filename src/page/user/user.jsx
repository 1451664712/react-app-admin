import React, {Component} from 'react'
import {Card, Icon, Button, Table, message, Breadcrumb, Modal} from 'antd';
import LinkButton from "../../components/link-button";
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from "../../api";
import {formateDate} from "../../utils/dateUtils";
import AddForm from "./add-form";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

export default class User extends Component {
    state = {
        loading: false,
        users: [],
        roles: [],
        showStatus: 0, //弹框状态
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: "操作",
                width: 300,
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => {
                            this.showUpdateUser(user)
                        }}>修改</LinkButton>&nbsp;&nbsp;
                        <LinkButton onClick={() => {
                            this.deleteUser(user)
                        }}>删除</LinkButton>&nbsp;&nbsp;
                    </span>
                )
            }
        ];
    };
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    showAddUser = () => {
        this.user = null
        this.setState({showStatus: 1})
    }

    // 添加用户
    addUserAndUpdateUser = () => {
        this.form.validateFields(async (err) => {
            if (!err) {
                this.setState({showStatus: 0})
                const user = this.form.getFieldsValue()
                console.log("user", user)
                this.form.resetFields();

                if (this.user) {
                    user._id = this.user._id
                }
                const result = await reqAddOrUpdateUser(user)
                if (result.status === 0) {
                    message.success(`${this.user ? '修改' : '添加'}用户成功`)
                    this.getUsers()
                } else {
                    message.error(result.msg)
                }
            }
        })
    }
    // 取消弹出框
    handleCancel = () => {
        this.setState({showStatus: 0})
        this.form.resetFields();
    }

    // 删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `你确定要删除${user.username}吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('已删除')
                    this.getUsers()
                }
            }
        });
    }

    // 修改用户
    showUpdateUser = (user) => {
        console.log(user)
        this.user = user
        this.setState({showStatus: 1})
    }
    // 获取用户列表
    getUsers = async () => {
        this.setState({loading: true})
        const result = await reqUsers()
        this.setState({loading: false})
        if (result.status === 0) {
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({users, roles})
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users, roles, loading, showStatus} = this.state
        const user = this.user || {}
        const title = (
            <Button type="primary" onClick={this.showAddUser}>创建用户</Button>
        )
        return (
            <Card title={title} bordered={false}>
                <Table
                    rowKey="_id"
                    loading={loading}
                    columns={this.columns}
                    dataSource={users}
                    bordered
                />
                <Modal
                    title={user._id ? '编辑用户' : '添加用户'}
                    visible={showStatus === 1}
                    onOk={this.addUserAndUpdateUser}
                    onCancel={this.handleCancel}
                >
                    <AddForm setForm={(form) => {
                        this.form = form
                    }} roles={roles} user={user}/>
                </Modal>
            </Card>
        )
    }
}
