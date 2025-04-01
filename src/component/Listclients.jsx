import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { Listclients } from '../store/slices/client';
import { Listpartners } from '../store/slices/partners';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Table from '../common/Table';

const Item = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;
  const user_type = user?.data?.user_type;

  const [isLoading, setIsLoading] = useState(false);
  const [listclients, setListclients] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Name', field: 'name' },
    { header: 'Company Name', field: 'company_name' },
    { header: 'Partner Name', field: 'partner_name' },
    { header: 'Date', field: 'date_added' },
    { 
      header: 'Actions', 
      field: 'actions', 
      isAction: true, 
      actionButtons: [
        { name: 'Edit', className: 'btn-default' }, 
        { name: 'View Dashboard', className: 'btn-default top-button' }, 
      ]
    }
  ]);

  const [formData, setFormData] = useState({
     partner_id : ''
  });
 

  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [listParties, setListpartners] = useState([]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (item) => {
      navigate(`/clients/edit/${item.id ? item.id : null}`)
      // Implement your edit logic here
  };

  const handleViewDashboard = (item) => {
    navigate(`/clients/dashboard/${item.id ? item.id : null}`, {
      state: { company_name: item.company_name },  // Send the company name via state
    })
    // Implement your edit logic here
};

  const handleDelete = (item) => {
    console.log('Deleting item:', item);
    // Implement your delete logic here
  };

  const partyOptions = listParties.map((party) => ({
      value: party.id,
      label: party.name,
  }));


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

const handleInputChange = (selectedOption, actionMeta) => {
  const value = selectedOption.value;
  
  if (actionMeta.name === 'partner_id') {
    setFormData((prevState) => ({
      ...prevState,
      [actionMeta.name]: value, 
    }));
    console.log('Selected value:', value);

    dispatch(Listclients({ profile_id: value }))
      .unwrap()
      .then((response) => {
        if(response?.data){
          setListclients(response?.data);
        }
        else{
          setListclients('');
        }
        
      })
      .catch((error) => {
        console.log('Error fetching client list:', error);
      });
  }
};




  React.useEffect(() => {
    const action = user_type === "Admin"
      ? Listclients()
      : Listclients({ profile_id: id });
    setIsLoading(true);
    dispatch(action)
      .unwrap()
      .then((data) => {
        console.log('clients list ',data);
        setIsLoading(false);
        setListclients(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = listclients?.filter(party => 
    party?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) 

  );

  return (
    <div>
      <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
        <Navbarside />
        {isLoading && <Loader />}
        <div className="container ">
            <div className="col-md-12 ">
            <div className="row content-body">
                <div className="container-fluid">
                <div className="page-header">
                    <div>
                    <h2 className="main-content-title tx-24 mg-b-5">Clients List</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <a href="#">Clients</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                           Clients List
                        </li>
                    </ol>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn ripple btn-default" onClick={() => navigate('/clients/add')}>
                            Add Client
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div class="form-group">
                        <div class="row">
                            <div class="col-md-6">
                            <label>Client Ownership <span class="required">*</span> </label>
                                 <Select options={partyOptions} name="partner_id" placeholder="--Select Customer--" onChange={handleInputChange}  />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                    <Table
                        columns={columns}
                        data={filtereditemList}
                        tableRef={tableRef}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        currentPage={currentPage}
                        totalCount={filtereditemList?.length}
                        onPageChange={handlePageChange}
                        handleEdit={handleEdit}
                        handleViewDashboard={handleViewDashboard}
                        handleDelete={handleDelete}
                        handleSearchChange={handleSearchChange}
                    />
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

export default Item;
