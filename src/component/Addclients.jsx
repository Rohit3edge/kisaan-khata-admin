import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Listpartners } from '../store/slices/partners';
import { Addclients ,CheckEmailclients ,CheckGSTclients ,GetState , LicenceCheck} from '../store/slices/client';
import Select from 'react-select';
import Loader from '../common/Loader';

const AddParty = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedState, setSelectedstate] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);
  const [listParties, setListpartners] = useState([]);
  const [getState, setGetState] = useState([]);
  const [emailError, setEmailError] = useState('');
  const [licenceError, setLicenceError] = useState('');
  const [licencedays, setLicenceDay] = useState('');
  const [GSTError, setGSTError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  
  const id = user?.data?.id;
  const Name = user?.data?.company_name;
  const user_type = user?.data?.user_type;


  const [formData, setFormData] = useState({
          name: '',
          address: '',
          email: '',
          phoneno: '',
          lic_validity_days: licencedays,
          gst: '',
          company_name: '',
          da_type: '',
          partner_id : '',
          profile_password: '',
          date_added: currentDate,
          module: '',
          state :'',
          city :'',
          profile_img : '',
          licence_key :''
  });

    // Fetch parties
    useEffect(() => {
      setIsLoading(true);
      dispatch(Listpartners())
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setListpartners(data?.data);
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }, [dispatch, id]);

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
    const { name, value,checked} = e.target;
    if (name === 'email') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      // Dispatch the ChackEmail action to validate the email
      dispatch(CheckEmailclients({ email: value }))
        .unwrap()
        .then((response) => {
          console.log('Email check ',response.message);
            if (response.status) {
              setEmailError('Email already exists'); 
            } else {
              setEmailError(''); 
            }
        })
        .catch((error) => {
          console.log('Error checking email:', error);
        });

      return; 
    }

    if (name === 'gst') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      // Dispatch the ChackEmail action to validate the email
      dispatch(CheckGSTclients({ gst: value }))
        .unwrap()
        .then((response) => {
          console.log('gst check ',response.message);
            if (response.status) {
              setGSTError('GST already exists');
              
            } else {
              setGSTError(''); 
            }
        })
        .catch((error) => {
          console.log('Error checking GST:', error);
        });

      return; 
    }

    if (name === 'licence_key') {
      if(user_type == 'Admin'){
        if(!formData.partner_id ){
          setLicenceError('Select Client Ownership');
        }
        else{
            setFormData((prevState) => ({
              ...prevState,
              [name]: value,
            }));
            dispatch(LicenceCheck({ licence_key: value ,partner_id: formData.partner_id }))
              .unwrap()
              .then((response) => {
                console.log('licence chack ',response.status);
                  if (response.status) {
                    setLicenceError('');
                    setLicenceDay(response?.data?.valid_days);
                    
                  } else {
                  
                    setLicenceError(response.message); 
                  }
              })
              .catch((error) => {
                console.log('Error checking Licence:', error);
              });
        }
      }
      else{
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        dispatch(LicenceCheck({ licence_key: value ,partner_id:id }))
          .unwrap()
          .then((response) => {
            console.log('licence chack ',response.status);
              if (response.status) {
                setLicenceError('');
              } else {
              
                setLicenceError(response.message); 
              }
          })
          .catch((error) => {
            console.log('Error checking Licence:', error);
          });
      }
       
      return; 
    }

    if (checked) {
      // If checked, add the value to the selectedModules array
      setSelectedModules((prev) => [...prev, value]);
    } else {
      // If unchecked, remove the value from the selectedModules array
      setSelectedModules((prev) => prev.filter((module) => module !== value));
    }
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

  const handlePartyChange = (selectedOption) => {
    setSelectedParty(selectedOption);
    const partyId = selectedOption.value;
    setFormData({ ...formData, partner_id: partyId});
  };

  const handleStateChange = (selectedOption2) => {
      setSelectedstate(selectedOption2);
      const stateId = selectedOption2.value;
      console.log('stateId',stateId);
      setFormData({ ...formData, state: stateId});
  };

  const partyOptions = listParties.map((party) => ({
      value: party.id,
      label: party.name,
  }));

  const statesOptions = getState.map((state) => ({
    value: state.state_name,
    label: state.state_name,
}));



  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.profile_password) newErrors.profile_password = 'Password is required.';
    if (!formData.gst) newErrors.gst = 'GST is required.';
    if (!formData.company_name) newErrors.company_name = 'Company Name is required.';
    if (!formData.state) newErrors.state = 'State is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    if (!formData.phoneno) newErrors.phoneno = 'Phone No is required.';
    if (!formData.address) newErrors.address = 'Address is required.';
    // if (!formData.licence_key) newErrors.licence_key = 'Licence Key is required.';
    if (emailError) newErrors.email = 'Please Change Email This already exists';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    const moduleString = selectedModules.join(',');

    const updatedFormData = {
      ...formData,
      module: moduleString,
      partner_id: user_type === 'Admin' ? formData.partner_id : id,
      lic_validity_days: licencedays,
    };
    console.log('updatedFormData',updatedFormData)
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(Addclients(updatedFormData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
              name: '',
              address: '',
              email: '',
              phoneno: '',
              lic_validity_days: '',
              gst: '',
              partner_id : '',
              company_name: '',
              da_type: '',
              profile_password: '',
              date_added: currentDate,
              module: '',
              state :'',
              city :'',
              profile_img : '',
              licence_key :''

          });
          
          console.log('Form submitted successfully', data);
          navigate('/clients/list');
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
                    <div className="d-flex justify-content-end" >
                     {!licenceError && (
                        <button className="btn ripple btn-default" onClick={handleSubmit}>
                            Save
                        </button>
                      )}
                        <a class="btn btn-cancel" onClick={() => navigate('/clients/list')}>Cancel</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div class="card custom-card">
                            <div class="card-body">
                             {user_type === "Admin" && (
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                        <label>Client Ownership <span class="required">*</span> </label>
                                        <Select options={partyOptions} name="partner_id" required placeholder="--Select Customer--" onChange={handlePartyChange}  />
                                        {errors.partner_id && <span className="text-danger">{errors.partner_id}</span>}

                                        </div>
                                    </div>
                                </div>
                              )}
                                <div class="form-group">
                                    <div class="row">
                                       <div class="col-md-6">
                                            <label>Company Name <span class="required">*</span></label>
                                            <input name="company_name" type="text" class="form-control" value={formData.company_name} required onChange={handleInputChange} />
                                            {errors.company_name && <span className="text-danger">{errors.company_name}</span>}
                                        </div>
                                        <div class="col-md-6">
                                           <label>Owner Name <span class="required">*</span></label>
                                           <input name="name" type="text" className="form-control" required value={formData.name} onChange={handleInputChange} />
                                           
                                           {errors.name && <span className="text-danger">{errors.name}</span>}
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                       <div class="col-md-6">
                                         <label>Address <span class="required">*</span></label>
                                          <textarea name="address" style={{height: '138px'}}  rows="2" cols="20" required maxlength="150" id="address" class="form-control mt_5" value={formData.address} onChange={handleInputChange} ></textarea>
                                          {errors.address && <span className="text-danger">{errors.address}</span>}
                                        </div>
                                        <div class="col-md-6">
                                          <label>State<span class="required">*</span> </label>
                                          <Select options={statesOptions} name="state" placeholder="--Select State--" required onChange={handleStateChange}  />
                                          {errors.state && <span className="text-danger">{errors.state}</span>}
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                    <div class="col-md-6">
                                            <label>City <span class="required">*</span></label>
                                            <input name="city" type="text" class="form-control" required  value={formData.city} onChange={handleInputChange} />
                                            {errors.city && <span className="text-danger">{errors.city}</span>}
                                        </div>
                                        <div class="col-md-6">
                                            <label>Company GST <span class="required">*</span> </label>
                                            <input name="gst" type="text" class="form-control" value={formData.gst} required onChange={handleInputChange} />
                                            {errors.gst && <span className="text-danger">{errors.gst}</span>}<br/>
                                            {GSTError && <span className="text-danger">{GSTError}</span>}
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                       <div class="col-md-6">
                                            <label>Email <span class="required">*</span></label>
                                            <input name="email" type="text" class="form-control" value={formData.email} required onChange={handleInputChange} />
                                            {errors.email && <span className="text-danger">{errors.email}</span>}<br/>
                                            {emailError && <span className="text-danger">{emailError}</span>}
                                        </div>
                                        <div class="col-md-6">
                                           <label>Phone No <span class="required">*</span></label>
                                           <input name="phoneno" type="number" className="form-control" value={formData.phoneno} required onChange={handleInputChange} />
                                           {errors.phoneno && <span className="text-danger">{errors.phoneno}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Licence Key </label>
                                            <input name="licence_key" type="text" class="form-control" value={formData.licence_key}  onChange={handleInputChange} />
                                            {errors.licence_key && <span className="text-danger">{errors.licence_key}</span>}
                                            {licenceError && <span className="text-danger">{licenceError}</span>}
                                        </div>
                                        <div class="col-md-6">
                                            <label>Validity Days </label>
                                            <input name="lic_validity_days" type="text" class="form-control" value={licencedays} onChange={handleInputChange} readonly="readonly"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Profile Password  <span class="required">*</span></label>
                                            <input name="profile_password" type="password" class="form-control" required value={formData.profile_password} onChange={handleInputChange} />
                                            {errors.profile_password && <span className="text-danger">{errors.profile_password}</span>}
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

export default AddParty;
