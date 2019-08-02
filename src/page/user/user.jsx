import React, {Component} from 'react'
import {Card, Icon, Button, Table, message, Breadcrumb, Modal} from 'antd';
import LinkButton from "../../components/link-button";
import {reqUsers, reqAdduser, reqDeleteUser} from "../../api";
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
        type: 0,
        user: {}
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
                        <LinkButton onClick={() => {this.updateUser(user)}}>修改</LinkButton>&nbsp;&nbsp;
                        <LinkButton onClick={() => {this.deleteUser(user)}}>删除</LinkButton>&nbsp;&nbsp;
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

    addShow = () => {
        this.setState({showStatus: 1})
    }

    addUser = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({showStatus: 0})
                this.form.resetFields();
                const result = await reqAdduser(values)
                if (result.status === 0) {
                    message.success('添加用户成功')
                    this.getUsers()
                } else {
                    message.error(result.msg)
                }
            }
        })
    }

    handleCancel = () => {
        this.setState({showStatus: 0})
    }

    // 删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: '你确定要删除吗？',
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
    updateUser = (user) => {
        this.setState({type: 1, showStatus: 1})
        this.setState({user})
    }
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
        const {users, user, roles, loading, showStatus, type} = this.state
        console.log(user)
        const title = (
            <Button type="primary" onClick={this.addShow}>创建用户</Button>
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
                    title={type === 0 ? '添加用户' : '编辑用户'}
                    visible={showStatus === 1}
                    onOk={type === 0 ? this.addUser : this.updateUser}
                    onCancel={this.handleCancel}
                >
                    <AddForm setForm={(form) => {
                        this.form = form
                    }} roles={roles} type={type} user={user}/>
                </Modal>
            </Card>
        )
    }
}
