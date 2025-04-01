import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { GetState } from '../store/slices/client';
import { Addcompliances } from '../store/slices/partners';
import Loader from '../common/Loader';
import Select from 'react-select';

const AddCom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const [selectedState, setSelectedstate] = useState(null);         
  const [getState, setGetState] = useState([]);
  
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    compliance_name: '',
        is_recurring:''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsLoading(true);
    dispatch(GetState())
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setGetState(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch, id]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'opening_blance') {
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };


  const validate = () => {
    let newErrors = {};
    if (!formData.compliance_name) newErrors.compliance_name = 'Name is required.';
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 

  const handleSubmit = (e) => {
    console.log(formData)
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(Addcompliances(formData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            compliance_name: '',
            is_recurring:''
          });
          console.log('Form submitted successfully', data);
          navigate('/compliance/list');
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
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
                    <h2 className="main-content-title tx-24 mg-b-5">Compliance Master Add</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <a href="#">Compliance Master List</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                           Compliance Master Add
                        </li>
                    </ol>
                    </div>
                    <div className="d-flex justify-content-end" >
                        <button className="btn ripple btn-default" onClick={handleSubmit}>
                            Save
                        </button>
                        <a class="btn btn-cancel" onClick={() => navigate('/compliance/list')}>Cancel</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div class="card custom-card">
                            <div class="card-body">
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>
                                                Name <span class="required">*</span>
                                            </label>
                                            <input name="compliance_name" type="text" className="form-control" value={formData.compliance_name} onChange={handleInputChange} />
                                            {errors.compliance_name && <span className="text-danger">{errors.compliance_name}</span>}
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-check" style={{ padding: "6%" }}>
                                                <input class="form-check-input" name="is_recurring"  checked={formData.is_recurring === "1"} type="checkbox" value={formData.is_recurring} onChange={(e) =>
                                                            setFormData((prevState) => ({
                                                            ...prevState,
                                                            is_recurring: e.target.checked ? "1" : "0", 
                                                            }))
                                                        } id="flexCheckChecked" />
                                                <label class="form-check-label" for="flexCheckChecked" >
                                                    Checked checkbox
                                                </label>
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddCom;
