import React, { useState, useEffect, useRef } from 'react';
import { Getpurchase } from '../store/slices/client';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';

const Item = () => {
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [columns, setcolumns] = useState([
    { header: 'Name', field: 'name' },
    { header: 'Total Purchases', field: 'purchases' },
  ]);

  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [listParties, setListpartners] = useState([]);
    const [fromDate, setFromDate] = useState(localStorage.getItem('savedFromDate'));
    const [toDate, setToDate] = useState(localStorage.getItem('savedToDate'));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch parties
  useEffect(() => {
    const params = {
      partner_id: id,
      from_date: fromDate,
      to_date: toDate,
    };
    setIsLoading(true);
    dispatch(Getpurchase(params))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListpartners(data?.data?.clients);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch, id]);

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
                    <h2 className="main-content-title tx-24 mg-b-5">Total Purchase List</h2>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#">Purchase</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Total Purchase List
                      </li>
                    </ol>
                  </div>
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
