import axios from 'axios';
import qs from 'qs';
import { API_PATHS } from '../utils/constants/api.constants';

class clientsService {
  static Listclients(item) {
    const api = `${API_PATHS.clientList}`;
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

  static Addclients(item) {
    const api = `${API_PATHS.clientAdd}`;

    return axios
      .post(api, item, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

  static Editclients(item) {
    const api = `${API_PATHS.clientEdit}`;
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

  static Updateclients(item) {
    const api = `${API_PATHS.clientUpdate}`;
    const data = qs.stringify(item); // Convert object to URL-encoded format

    return axios
      .post(api, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

  static CheckEmailclients(item) {
    const api = `${API_PATHS.CheckEmailclients}`;
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

  static CheckGSTclients(item) {
    const api = `${API_PATHS.CheckGSTclients}`;
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

  static GetState() {
    const api = `${API_PATHS.getstate}`;
    return axios
      .get(api, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

  static LicenceCheck(item) {
    const api = `${API_PATHS.LicenceCheck}`;
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

  static Getsales(item) {
    const api = `${API_PATHS.getsales}`;
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
  static Getpurchase(item) {
    const api = `${API_PATHS.getpurchase}`;
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
  static Gettotalclients(item) {
    const api = `${API_PATHS.gettotalclients}`;
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
  static Getbankbalance(item) {
    const api = `${API_PATHS.getbankbalance}`;
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
}

export default clientsService;
