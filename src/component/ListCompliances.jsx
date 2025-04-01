import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { ListCompliances } from '../store/slices/partners';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';

const Item = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [listCompliances, setListCompliances] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Compliance Name', field: 'compliance_name' },
    { header: 'Date', field: 'added_on' },
    { 
      header: 'Actions', 
      field: 'actions', 
      isAction: true, 
      actionButtons: [
        { name: 'Edit', className: 'btn-default' },
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
      navigate(`/compliance/edit/${item.id ? item.id : null}`)
      // Implement your edit logic here
  };

  const handleDelete = (item) => {
    console.log('Deleting item:', item);
    // Implement your delete logic here
  };



  React.useEffect(() => {
    setIsLoading(true);
    dispatch(ListCompliances())
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListCompliances(data?.data);
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

  const filtereditemList = listCompliances?.filter(party => 
    party?.compliance_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) 

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
                    <h2 className="main-content-title tx-24 mg-b-5">Compliance Master List</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <a href="#">Compliance Master</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Compliance Master
                        </li>
                    </ol>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn ripple btn-default" onClick={() => navigate('/compliance/add')}>
                            Add Compliance Master
                        </button>
                    </div>
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

export default Item;
