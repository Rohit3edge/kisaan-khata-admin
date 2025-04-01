import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { ListpartnersLicence } from '../store/slices/partners';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';

const Licence = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;
  const user_type = user?.data?.user_type;

  const [isLoading, setIsLoading] = useState(false);
  const [listpartnersLicence, setListpartnersLicence] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'ID', field: 'id' },
    { header: 'key', field: 'key' },
    { header: 'Partner Name', field: 'partner_name' },
    { header: 'Vaid Days', field: 'valid_days' },
    { header: 'Number Of Licence', field: 'number_of_licence' },
    { header: 'Date', field: 'created_at' },
    { 
      header: 'Actions', 
      field: 'actions', 
      isAction: true, 
      actionButtons: [
        ...(user_type === 'Admin' ? [{ name: 'Edit', className: 'btn-default' }] : []) // Only add the 'Edit' button for Admins
      ]
    }
  ]);
 

  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  
  const handleEdit = (item) => {
      navigate(`/licence/Edit/${item.id ? item.id : null}`)
      // Implement your edit logic here
  };

  const handleDelete = (item) => {
    console.log('Deleting item:', item);
    // Implement your delete logic here
  };



  React.useEffect(() => {
    const action = user_type === "Admin"
      ? ListpartnersLicence()
      : ListpartnersLicence({ profile_id: id });
    setIsLoading(true);
    dispatch(action)
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListpartnersLicence(data?.data);
        console.log(data.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = listpartnersLicence?.filter(party => 
    party?.valid_days?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.number_of_licence?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.partner_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) 

  );

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
                    <h2 className="main-content-title tx-24 mg-b-5">Partners Licence List</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <a href="#">Partners</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                           Partners Licence List
                        </li>
                    </ol>
                    </div>
                    { user_type == 'Admin' ? 
                     <div className="d-flex justify-content-end">
                        <button className="btn ripple btn-default" onClick={() => navigate('/licence/create')}>
                            Add Partners Licence 
                        </button>
                    </div>
                    :''
                    }
                </div>

                <div className="row">
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

export default Licence;
