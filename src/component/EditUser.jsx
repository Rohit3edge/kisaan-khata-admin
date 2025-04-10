import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetPartnerUser,Userupdate,GetDetailsuser } from '../store/slices/user';
import { API_BASE_URL} from "../utils/constants/api.constants";
import axios from "axios";
import Loader from '../common/Loader';
import Navbarside from './Navbarside';
import Footer from './Footer';

const EditUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const [originalEmail, setOriginalEmail] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [listParties, setListpartners] = useState([]);
  const [formData, setFormData] = useState({
    partner_id: id,
    id: userId,
    name: '',
    email: '',
    profile_password: '',
    isActive: '0',
    permissions: [],
  });

  const [errors, setErrors] = useState({});


      useEffect(() => {
        const params = {
          partner_id: id,
        };
        setIsLoading(true);
        dispatch(GetPartnerUser(params))
          .unwrap()
          .then((data) => {
            setIsLoading(false);
            setListpartners(data?.data);
    
          })
          .catch(({ message }) => {
            setIsLoading(false);
            console.log(message);
          });
      }, [ id]);


  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const data = await dispatch(GetDetailsuser({  partner_id: id, id: userId })).unwrap();
      setIsLoading(false);
      console.log(data?.data);
      setFormData((prevState) => ({
        ...prevState,
        name: data?.data?.name,
        email: data?.data?.email,
        isActive: data?.data?.is_active,
        permissions: data?.data?.partner_user_permissions ? data?.data?.partner_user_permissions.split(',') : [],
      })
   
    
    );
    setOriginalEmail(data?.data?.email);
    } catch (error) {
      setIsLoading(false);
      console.log('Error fetching :', error.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));

           // Clear previous errors
       setErrors((prev) => ({ ...prev, [name]: "" }));
  };

      // Function to verify email from API
      const verifyEmail = async (email) => {
        if (!email || email === originalEmail) return; // Do not verify if email hasn't changed
      
        try {
          const formData = new FormData();
          formData.append("email", email);
      
          const response = await axios.post(`${API_BASE_URL}partner-user/email-check`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
          console.log(response);
      
          if (response?.data?.status) {
            setCheckingEmail(response?.data?.status);
            setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
          }
          else{
            setCheckingEmail(response.data.status)
          }
        } catch (error) {
          console.error("Error checking email:", error);
        }
      };
      
    
      // Debounce API call (run after user stops typing for 500ms)
      useEffect(() => {
        const delay = setTimeout(() => {
          if (formData.email) {
            verifyEmail(formData.email);
          }
        }, 500);
      
        return () => clearTimeout(delay);
      }, [formData.email]);
      
  const handlePermissionChange = (permission) => {
    setFormData((prevState) => {
      const updatedPermissions = prevState.permissions.includes(permission) ? prevState.permissions.filter((perm) => perm !== permission) : [...prevState.permissions, permission];

      return { ...prevState, permissions: updatedPermissions };
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    if (checkingEmail) newErrors.email = 'This email is already registered.';
    // if (!formData.profile_password) newErrors.profile_password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(Userupdate(formData))
        .unwrap()
        .then(() => {
          setIsLoading(false);
          navigate('/User/list');
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.error(message);
        });
    }
  };

  return (
    <div>
      <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
        <Navbarside />
        {isLoading && <Loader />}
        <div className="container">
          <div className="col-md-12">
            <div className="row content-body">
              <div className="container-fluid">
                <div className="page-header">
                  <div>
                    <h2 className="main-content-title tx-24 mg-b-5">Client Add</h2>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#">Client List</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Client Add
                      </li>
                    </ol>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button className="btn ripple btn-default" onClick={handleSubmit}>
                      Save
                    </button>
                    <a class="btn btn-cancel" onClick={() => navigate('/User/list')}>
                      Cancel
                    </a>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="card custom-card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>
                                Name <span className="required">*</span>
                              </label>
                              <input name="name" type="text" className="form-control" onChange={handleInputChange} value={formData.name} />
                              {errors.name && <span className="alert-message">{errors.name}</span>}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>
                                Email <span className="required">*</span>
                              </label>
                              <input name="email" type="text" className="form-control" onChange={handleInputChange} value={formData.email} />
                              {errors.email && <p className="alert-message">{errors.email}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Edit Password</label>
                              <input name="profile_password" type="text" className="form-control" onChange={handleInputChange} value={formData.profile_password} />
                              <p className="alert-message">Leave it blank, if you dont want to change password.</p>
                              {errors.profile_password && <p className="alert-message">{errors.profile_password}</p>}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group" style={{ marginTop: '2.2rem' }}>
                              <label>
                                <input type="checkbox" name="isActive" checked={formData.isActive == 0 ? false : true} onChange={handleInputChange} /> Active
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Permissions</label>
                          <div className="row mt-2">
                            {listParties?.map((permission, index) => (
                              <div key={index} className="col-md-6">
                                <label>
                                  <input type="checkbox" checked={formData.permissions.includes(permission?.id)} onChange={() => handlePermissionChange(permission?.id)} /> {permission?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditUser;
