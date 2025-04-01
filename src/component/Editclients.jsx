import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Listpartners } from '../store/slices/partners';
import { Updateclients,Editclients ,CheckGSTclients ,GetState ,LicenceCheck } from '../store/slices/client';
import Select from 'react-select';
import Loader from '../common/Loader';


const EditCliets = () => {
    const { id } = useParams();
    const itemId = id;

   console.log('itemId',itemId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);
  const [listParties, setListpartners] = useState([]);
  const [getState, setGetState] = useState([]);

  const [licenceError, setLicenceError] = useState('');
  const [selectedState, setSelectedstate] = useState(null);
  const [licencedays, setLicenceDay] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  
  const UserID = user?.data?.id;
  const Name = user?.data?.company_name;
  const user_type = user?.data?.user_type;

  const [formData, setFormData] = useState({
          id:itemId ||'',
          name: '',
          address: '',
          email: '',
          phoneno: '',
          lic_validity_days: '',
          gst: '',
          company_name: '',
          da_type: '',
          partner_id : '',
          date_added: currentDate,
          module: '',
          state :'',
          city :'',
          profile_img : '',
          licence_key :'',
          profile_password:''
  });


  useEffect(() => {
    if (itemId) {
      setIsLoading(true);
      dispatch(Editclients({ id: itemId})) 
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const item = data?.data;
          console.log('item',item);
            if (item?.partner_id) {
                fetchParties().then((ndata) => {
                   handlePartyChange(item?.partner_id, ndata, true);
                });
            }
            if (item?.state) {
              fetchStates().then((ndata) => {
                handleStateChange(item?.state, ndata, true);
              });
          }
          setFormData((prevFormData) => ({
            ...prevFormData,
                id:item?.id ||'',
                name: item?.name ||'',
                address: item?.address ||'',
                email: item?.email ||'',
                phoneno: item?.phoneno ||'',
                lic_validity_days: item?.lic_validity_days ||'',
                gst: item?.gst ||'',
                company_name: item?.company_name ||'',
                da_type:item?.da_type ||'',
                partner_id :item?.partner_id ||'',
                date_added: item?.date_added ||'',
                state :item?.state ||'',
                city :item?.city ||'',
                profile_img :item?.profile_img ||'',
                licence_key :item?.licence_key ||'',
                profile_password : item?.plain_password || ''
          }));
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [dispatch, itemId]);

    // Fetch parties
    useEffect(() => {
        fetchParties();
    }, [dispatch, id]);

 
    useEffect(() => {
      fetchStates();
  }, [dispatch, id]);
 

  



  const [errors, setErrors] = useState({});

  const fetchParties = async () => {
    try {
      const data = await dispatch(Listpartners()).unwrap();
      setListpartners(data?.data);
      return data?.data;
    } catch (error) {
      console.log('Error fetching parties:', error.message);
    }
  };

  const fetchStates = async () => {
    try {
      const data = await dispatch(GetState()).unwrap();
      setGetState(data?.data);
      return data?.data;
    } catch (error) {
      console.log('Error fetching parties:', error.message);
    }
  };


  const handleInputChange = (e) => {
    const { name, value,checked} = e.target;

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
                setLicenceDay(response?.data?.valid_days);
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


  const handlePartyChange = (selectedOption, ndata, isData) => {
    console.log('selectedOption, ndata, isData',selectedOption, ndata, isData);
    
    const FinalselectedOption = isData ? selectedOption : selectedOption?.value; 
    if (!FinalselectedOption) {
      console.error('FinalselectedOption is undefined or invalid');
      return;
    }
    const ListParties = isData ? ndata : listParties;
    const party = ListParties?.find((p) => p?.id == FinalselectedOption);
    setSelectedParty(party.id);
    setFormData((prevFormData) =>({ ...prevFormData, partner_id: party.id}));
  };


 
  const handleStateChange = (selectedOption, ndata, isData) => {
    console.log('selectedOption, ndata, isData',selectedOption, ndata, isData);
    
    const FinalselectedOption = isData ? selectedOption : selectedOption?.value; 
    console.log('FinalselectedOption select ',FinalselectedOption);
    if (!FinalselectedOption) {
      console.error('FinalselectedOption is undefined or invalid');
      return;
    }
    const GetState = isData ? ndata : getState;
    const party = GetState?.find((p) => p?.state_name == FinalselectedOption);
    setSelectedstate(party.state_name);
    setFormData((prevFormData) =>({ ...prevFormData, state: party.state_name}));
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
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    const moduleString = selectedModules.join(',');

    const updatedFormData = {
      ...formData,
      module: moduleString,
      lic_validity_days: licencedays ? licencedays :formData?.lic_validity_days,
    };
    
    console.log(updatedFormData);

    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(Updateclients(updatedFormData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            id:itemId ||'',
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
console.log('selectedState',selectedState);
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
                    <h2 className="main-content-title tx-24 mg-b-5">Client Edit</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <a href="#">Client List</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                           Client Edit
                        </li>
                    </ol>
                    </div>
                    <div className="d-flex justify-content-end" >
                      {!licenceError && (
                        <button className="btn ripple btn-default" onClick={handleSubmit}>Update </button>
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
                                        <Select options={partyOptions} name="partner_id" placeholder="--Select Customer--" onChange={handlePartyChange} value={partyOptions?.find((option) => option?.value === selectedParty) || null} />
                                        </div>
                                    </div>
                                </div>
                                )}
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Company Name</label>
                                            <input name="company_name" type="text" class="form-control" value={formData.company_name} onChange={handleInputChange} />
                                            {errors.company_name && <span className="text-danger">{errors.company_name}</span>}
                                        </div>
                                        <div class="col-md-6">
                                           <label>Owner Name</label>
                                           <input name="name" type="text" className="form-control" value={formData.name} onChange={handleInputChange} />
                                           {errors.name && <span className="text-danger">{errors.name}</span>}
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                    <div class="col-md-6">
                                        <label>Address</label>
                                           <textarea name="address" rows="2" cols="20" maxlength="150" id="address" class="form-control mt_5" value={formData.address} onChange={handleInputChange} ></textarea>
                                        </div>
                                        <div class="col-md-6">
                                          <label>State<span class="required">*</span> </label>
                                          <Select options={statesOptions} name="state" placeholder="--Select State--" required onChange={handleStateChange} value={statesOptions?.find((option) => option?.value === selectedState) || null}   />
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
                                            <label>Company GST </label>
                                            <input name="gst" type="text" class="form-control" value={formData.gst} onChange={handleInputChange} />
                                            {errors.gst && <span className="text-danger">{errors.gst}</span>}
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                    <div class="col-md-6">
                                            <label>Email</label>
                                            <input name="email" type="text" class="form-control" value={formData.email} onChange={handleInputChange} />
                                            {errors.email && <span className="text-danger">{errors.email}</span>}
                                        </div>
                                        <div class="col-md-6">
                                           <label>Phone No</label>
                                           <input name="phoneno" type="number" className="form-control" value={formData.phoneno} onChange={handleInputChange} />
                                           {errors.phoneno && <span className="text-danger">{errors.phoneno}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Licence Key</label>
                                            <input name="licence_key" type="text" class="form-control" value={formData?.licence_key} onChange={handleInputChange} />
                                            {errors.licence_key && <span className="text-danger">{errors.licence_key}</span>}
                                            {licenceError && <span className="text-danger">{licenceError}</span>}
                                        </div>
                                        <div class="col-md-6">
                                            <label>Validity</label>
                                            <input name="lic_validity_days" type="text" class="form-control" value={licencedays ? licencedays : formData.lic_validity_days} onChange={handleInputChange} readOnly="readOnly"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-md-6">
                                          <label>Profile Password</label>
                                        <input name="profile_password" type="text" class="form-control" value={formData.profile_password} onChange={handleInputChange} />
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

export default EditCliets;
