import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Listpartners , UpdatepartnersLicence ,EditpartnersLicence } from '../store/slices/partners';
import Select from 'react-select';
import Loader from '../common/Loader';

const EditLicence = () => {
    const { id } = useParams();
    const itemId = id;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);
  const [listParties, setListpartners] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const UserID = user?.data?.id;
  const Name = user?.data?.company_name;
  const user_type = user?.data?.user_type;


  const [formData, setFormData] = useState({
        partner_id : '',
        valid_days : '',
        number_of_licence : ''
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
    if (itemId) {
      setIsLoading(true);
      dispatch(EditpartnersLicence({ id: itemId})) 
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const item = data?.data;
          console.log('item',item);
          setFormData({
            id:item?.id ||'',
            partner_id : item?.partner_id ||'',
            valid_days : item?.valid_days ||'',
            number_of_licence : item?.number_of_licence ||'',
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [dispatch, itemId]);


  const handleInputChange = (e) => {
    const { name, value,checked} = e.target;
    
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));

  };

  const handlePartyChange = (selectedOption) => {
    setSelectedParty(selectedOption);
    const partyId = selectedOption.value;
    setFormData({ ...formData, partner_id: partyId});
  };



  const partyOptions = listParties.map((party) => ({
      value: party.id,
      label: party.name,
  }));


  const validate = () => {
    let newErrors = {};
    if (!formData.partner_id) newErrors.partner_id = 'Client Ownership  is required.';
    if (!formData.valid_days) newErrors.valid_days = 'Valid Days Of Licence is required.';
    if (!formData.number_of_licence) newErrors.number_of_licence = 'Number Of Licence is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    const moduleString = selectedModules.join(',');

    const updatedFormData = {
      ...formData,
      module: moduleString,
      partner_id: user_type === 'Admin' ? formData.partner_id : id,
    };
    console.log('updatedFormData',updatedFormData)
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(UpdatepartnersLicence(updatedFormData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
              partner_id : '',
              valid_days : '',
              number_of_licence : ''

          });
          
          console.log('Form submitted successfully', data);
          navigate('/licence/list');
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
                    <h2 className="main-content-title tx-24 mg-b-5">Partners Licence Edit</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <a href="#">Partners Licence List</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Partners Licence Edit
                        </li>
                    </ol>
                    </div>
                    <div className="d-flex justify-content-end" >
                        <button className="btn ripple btn-default" onClick={handleSubmit}>
                            Update
                        </button>
                        <a class="btn btn-cancel" onClick={() => navigate('/licence/list')}>Cancel</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div class="card custom-card">
                            <div class="card-body">
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                        <label>Client Ownership <span class="required">*</span> </label>
                                        <Select options={partyOptions} name="partner_id" required placeholder="--Select Customer--" onChange={handlePartyChange}  value={partyOptions?.find((option) => option?.value === formData?.partner_id ) || null}  />
                                        {errors.partner_id && <span className="text-danger">{errors.partner_id}</span>}

                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                           <label>Valid Days Of Licence <span class="required">*</span></label>
                                           <input name="valid_days" type="number" className="form-control" required value={formData?.valid_days} onChange={handleInputChange} />
                                           
                                           {errors.valid_days && <span className="text-danger">{errors.valid_days}</span>}
                                        </div>
                                        <div class="col-md-6">
                                           <label>Number Of Licence<span class="required">*</span></label>
                                           <input name="number_of_licence" type="number" className="form-control" value={formData?.number_of_licence} required onChange={handleInputChange} />
                                           {errors.number_of_licence && <span className="text-danger">{errors.number_of_licence}</span>}
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

export default EditLicence;
