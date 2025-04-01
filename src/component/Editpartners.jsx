import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { GetState } from '../store/slices/client';
import { Updatepartners ,Editpartners } from '../store/slices/partners';
import Loader from '../common/Loader';
import Select from 'react-select';

const AddParty = () => {

    const { id } = useParams();
  const itemId = id;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const [selectedState, setSelectedstate] = useState(null);
  const [getState, setGetState] = useState([]);

  const userID = user?.data?.id;
  const Name = user?.data?.company_name;


  const statesOptions = getState.map((state) => ({
      value: state.state_name,
      label: state.state_name,
  }));


  useEffect(() => {
    if (itemId) {
      setIsLoading(true);
      dispatch(Editpartners({ id: itemId})) 
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const item = data?.data;
          console.log('item',item);
          setFormData({
                id:itemId || '',
                user_type: 'Partner',
                name: item?.name || '',
                address: item?.address || '',
                email: item?.email || '',
                phoneno: item?.phoneno || '',
                uadai: item?.uadai || '',
                gst: item?.gst || '',
                company_name: item?.company_name || '',
                da_type: item?.da_type || '',
                date_added: currentDate,
                state : item?.state || '',
                city : item?.city || '',
                address1: item?.address1 || '',
                profile_password: item?.plain_password || '',
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [dispatch, itemId]);


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


  const handleStateChange = (selectedOption2) => {
    setSelectedstate(selectedOption2);
    const stateId = selectedOption2.value;
    console.log('stateId',stateId);
    setFormData({ ...formData, state: stateId});
};



  const [formData, setFormData] = useState({
        user_type: 'Partner',
        name: '',
        address: '',
        email: '',
        phoneno: '',
        uadai: '',
        gst: '',
        company_name: '',
        da_type: '',
        profile_password: '',
        date_added: currentDate
  });

  const [errors, setErrors] = useState({});


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

  const handleDiscard = () => {
    setFormData({
      user_type: 'Partner',
      name: '',
      address: '',
      email: '',
      phoneno: '',
      uadai: '',
      gst: '',
      company_name: '',
      da_type: '',
      profile_password: '',
      date_added: currentDate
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    console.log(formData)
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(Updatepartners(formData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            user_type: 'Partner',
            name: '',
            address: '',
            email: '',
            phoneno: '',
            uadai: '',
            gst: '',
            company_name: '',
            da_type: '',
            profile_password: '',
            date_added: currentDate
          });
          console.log('Form submitted successfully', data);
          navigate('/partners/list');
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
                    <h2 className="main-content-title tx-24 mg-b-5">Partner Edit</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <a href="#">Partners List</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                           Partner Edit
                        </li>
                    </ol>
                    </div>
                    <div className="d-flex justify-content-end" >
                        <button className="btn ripple btn-default" onClick={handleSubmit}>
                            Update
                        </button>
                        <a class="btn btn-cancel" onClick={() => navigate('/partners/list')}>Cancel</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div class="card custom-card">
                            <div class="card-body">
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-12">
                                        <label>
                                            Name <span class="required">*</span>
                                        </label>
                                        <input name="name" type="text" className="form-control" value={formData.name} onChange={handleInputChange} />
                                        {errors.name && <span className="text-danger">{errors.name}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                           <label>Phone No </label>
                                           <input name="phoneno" type="number" className="form-control" value={formData.phoneno} onChange={handleInputChange} />
                                           {errors.phoneno && <span className="text-danger">{errors.phoneno}</span>}
                                        </div>
                                        <div class="col-md-6">
                                           <label>Email</label>
                                           <input name="email" type="email" className="form-control" value={formData.email} onChange={handleInputChange} />
                                           {errors.email && <span className="text-danger">{errors.email}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                        <label>Address <span class="required">*</span></label> 
                                           <textarea name="address" style={{height: '138px'}}  rows="2" cols="20" maxlength="150" id="address" class="form-control mt_5" value={formData.address} onChange={handleInputChange} ></textarea>
                                          {errors.address && <span className="text-danger">{errors.address}</span>}

                                        </div>
                                        <div class="col-md-6">
                                            <label>Address 1</label>
                                            <textarea name="address1" style={{height: '138px'}}  rows="2" cols="20" maxlength="150" id="address1" class="form-control mt_5" value={formData.address1} onChange={handleInputChange} ></textarea>
                                            {errors.address1 && <span className="text-danger">{errors.address1}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                          <label>State<span class="required">*</span> </label>
                                           <Select options={statesOptions} name="state" placeholder="--Select State--" required onChange={handleStateChange}   value={statesOptions?.find((option) => option?.value === formData.state ) || null}/>
                                            {errors.state && <span className="text-danger">{errors.state}</span>}
                                        </div>
                                        <div class="col-md-6">
                                            <label>City <span class="required">*</span></label>
                                            <input name="city" type="text" class="form-control" required  value={formData.city} onChange={handleInputChange} />
                                            {errors.city && <span className="text-danger">{errors.city}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Company GST</label>
                                            <input name="gst" type="text" class="form-control" value={formData.gst} onChange={handleInputChange} />
                                            {errors.gst && <span className="text-danger">{errors.gst}</span>}
                                        </div>
                                        <div class="col-md-6">
                                            <label>Profile Password</label>
                                            <input name="profile_password" type="text" class="form-control" value={formData.profile_password ? formData.profile_password :formData.profile_password} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        {/* <div class="col-md-6">
                                            <label>User UIDAI No</label>
                                            <input name="uadai" type="text" class="form-control" value={formData.uadai} onChange={handleInputChange} />
                                            {errors.uadai && <span className="text-danger">{errors.uadai}</span>}
                                        </div> */}
                                        <div class="col-md-6">
                                            <label>Data Access Type</label>
                                            <select name="da_type" className="form-control" onChange={handleInputChange} value={formData.da_type}>
                                                <option>Select Data Access</option>
                                                <option value="0">Read/Write</option>
                                                <option value="1">Read</option>
                                                <option value="2">Write</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label>Company Name</label>
                                            <input name="company_name" type="text" class="form-control" value={formData.company_name} onChange={handleInputChange} />
                                            {errors.company_name && <span className="text-danger">{errors.company_name}</span>}
                                        </div>
                                    </div>
                                </div>
                                {/* <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Data Access Type</label>
                                            <select name="da_type" className="form-control" onChange={handleInputChange} value={formData.da_type}>
                                                <option>Select Data Access</option>
                                                <option value="0">Read/Write</option>
                                                <option value="1">Read</option>
                                                <option value="2">Write</option>
                                            </select>
                                        </div>
                                        
                                    </div>
                                </div> */}
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
