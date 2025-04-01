import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class partnersService {

    static Listpartners(item) {
        const api = `${API_PATHS.partnerList}`;
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

    static Addpartners(item) {

        const api = `${API_PATHS.partnerAdd}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static Editpartners(item) {
      const api = `${API_PATHS.partnerEdit}`;
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


    static Updatepartners(item) {

        const api = `${API_PATHS.partnerUpdate}`;
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static ListpartnersLicence(item) {
      const api = `${API_PATHS.licenceList}`;
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

  static AddpartnersLicence(item) {

      const api = `${API_PATHS.licenceAdd}`;
      
      return axios
      .post(api,item,{
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
      })
      .then((response) => response.data);
  }

  static EditpartnersLicence(item) {
    const api = `${API_PATHS.licenceEdit}`;
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

  static UpdatepartnersLicence(item) {

    const api = `${API_PATHS.licenceUpdate}`;
    return axios
    .post(api,item,{
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    })
    .then((response) => response.data);
}


static ListCompliances(item) {
  const api = `${API_PATHS.complianceList}`;
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

static Addcompliances(item) {

  const api = `${API_PATHS.complianceAdd}`;
  
  return axios
  .post(api,item,{
      headers: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
  })
  .then((response) => response.data);
}

static Editcompliances(item) {
  const api = `${API_PATHS.complianceEdit}`;
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

static Updatecompliances(item) {

  const api = `${API_PATHS.complianceUpdate}`;
  return axios
  .post(api,item,{
      headers: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
  })
  .then((response) => response.data);
}

      

}

export default partnersService;