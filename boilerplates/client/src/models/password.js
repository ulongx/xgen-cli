import { hashHistory,browserHistory } from 'dva/router';
import { changepw } from '../services/app';
import { message } from 'antd';
export default {
  namespace: 'passwords',
  state: {
  },
  subscriptions: {},
  effects: {
    *doChangePw({payload},{ select, call, put}){
      const changeUser = {...payload,id:sessionStorage.getItem('id')}
      const { data } = yield call(changepw,changeUser);
      if (data && data.success) {
        message.success('密码修改成功.');
      }else{
        message.error(data.msg);
      }
    }
  },
  reducers: {},

}
