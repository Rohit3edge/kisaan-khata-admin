import axios from 'axios';
import { API_PATHS } from '../utils/constants/api.constants';

class UserService {
  static GetUserList(item) {
    const api = `${API_PATHS.userlist}`;

    const formData = new FormData();

    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        formData.append(key, item[key]);
      }
    }
    return axios
      .post(api, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

  static GetPartnerUser(item) {
    const api = `${API_PATHS.partneruser}`;

    const formData = new FormData();

    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        formData.append(key, item[key]);
      }
    }
    return axios
      .post(api, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

  static Adduser(item) {
    const api = `${API_PATHS.adduser}`;

    const formData = new FormData();

    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        formData.append(key, item[key]);
      }
    }
    return axios
      .post(api, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

  static Userupdate(item) {
    const api = `${API_PATHS.userupdate}`;

    const formData = new FormData();

    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        formData.append(key, item[key]);
      }
    }
    return axios
      .post(api, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

  static GetDetailsuser(item) {
    const api = `${API_PATHS.getdetailsuser}`;

    const formData = new FormData();

    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        formData.append(key, item[key]);
      }
    }
    return axios
      .post(api, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

  static Userdelete(item) {
    const api = `${API_PATHS.userdelete}`;
    const formData = new FormData();

    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        formData.append(key, item[key]);
      }
    }
    return axios
      .post(api,formData,  {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

}

export default UserService;