import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import styles from './Password.less';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

function Password({form,dispatch}) {

  const { getFieldDecorator, validateFields, getFieldsValue } = form;

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      dispatch({
        type: 'passwords/doChangePw',
        payload: values
      });
    });
  }
  function checkPassword(rule, value, callback) {
      if (value != getFieldsValue().newpassword) {
        callback(new Error('新密码两次不一致'));
      } else {
        callback();
      }
  }
  return (
    <div className={styles.normal}>
      <Form onSubmit={handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入原始密码' }]
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="原始密码" />
            )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('newpassword', {
            rules: [{ required: true, message: '请输入新密码' }],
          })(
            <Input addonBefore={<Icon type="edit" />} type="password" placeholder="新密码" />
            )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('newpassword2', {
            validate: [{
              trigger: 'onBlur',rules: [ { required: true, message: '请输入新密码' }, checkPassword]
            }]
          })(
            <Input addonBefore={<Icon type="edit" />} type="password" placeholder="确认新密码" />
            )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            修改
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}
// export default Form.create()(Password)
Password.contextTypes = {
  form: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};
function mapStateToProps({passwords}) {
  return { passwords }
}
export default connect(mapStateToProps)(Form.create()(Password));
