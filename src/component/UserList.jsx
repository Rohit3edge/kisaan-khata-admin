import React, { useState, useEffect, useRef } from 'react';
import { GetUserList,Userdelete } from '../store/slices/user';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';

const Item = () => {
      const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const user_type = user?.data?.user_type;


  const [isLoading, setIsLoading] = useState(false);
  const [columns, setcolumns] = useState([
    { header: 'Name', field: 'name' },
    { header: 'Email', field: 'email' },
    { header: 'Client Permissions', field: 'Client_combo' },
    { 
        header: 'Actions', 
        field: 'actions', 
        isAction: true, 
        actionButtons: [
          { name: 'Edit', className: 'btn-default' }, 
          // { name: 'Delete', className: 'btn-cancel' }, 
        ]
      }
  ]);

  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [listParties, setListpartners] = useState([]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch parties
  useEffect(() => {
    fetchUserList()
  }, [ id]);

  const fetchUserList = async () => {
    const params = {
        partner_id: id,
      };
      const data =user_type === "Admin" ? "" : params
      setIsLoading(true);
      dispatch(GetUserList(data))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setListpartners(data?.data);
  
        })
        .catch(({ message }) => {
          setIsLoading(false);
          setListpartners([]);
          console.log(message);
        });
  };

  const handleEdit = (item) => {
    navigate(`/User/EditUser/${item.id ? item.id : null}`);
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this User?');
    if (confirmDelete) {
      setIsLoading(true);
      dispatch(Userdelete({  partner_id: id, id: item.id }))
        .unwrap()
        .then(() => {
          setIsLoading(false);
          fetchUserList(); // Refresh the invoice list
        })
        .catch(({ message }) => {
          // console.log(message)
          setIsLoading(false);
        //   toast.error(message);
        });
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = listParties?.filter((party) => party?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()));

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
                    <h2 className="main-content-title tx-24 mg-b-5">User List</h2>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#">User</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                      User List
                      </li>
                    </ol>
                 
                  </div>
                  {(user_type === 'Partner') && (
                  <div className="d-flex justify-content-end">
                        <button className="btn ripple btn-default" onClick={() => navigate('/User/AddUser')}>
                            Add User
                        </button>
                    </div>
                  )}
                </div>

                <div className="row">
                  {/* <div class="form-group">
                        <div class="row">
                            <div class="col-md-6">
                            <label>Client Ownership <span class="required">*</span> </label>
                                 <Select options={partyOptions} name="partner_id" placeholder="--Select Customer--" onChange={handleInputChange}  />
                            </div>
                        </div>
                    </div> */}
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
                      handleSearchChange={handleSearchChange}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
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
