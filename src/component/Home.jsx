import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbarside from '../component/Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Getbankbalance, Gettotalclients, Getpurchase, Getsales } from '../store/slices/client';
import Select from 'react-select';
import Loader from '../common/Loader';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const Name = user?.data?.company_name;
  const user_type = user?.data?.user_type;
  const id = user?.data?.id;

  const today = new Date();

  const getFinancialYearRange = () => {
    const startYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    const endYear = startYear + 1;
    return `${startYear}-${endYear}`;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [saleTotal, setSaleTotal] = useState();
  const [totalbankbalance, setTotalbankbalance] = useState();
  const [totalCash, setTotalCash] = useState();
  const [fop, setFop] = useState();
  const [totalPurchase, setTotalPurchase] = useState();
  // const [selectedYear, setSelectedYear] = useState(
  //   localStorage.getItem("selectedFinancialYear") || getFinancialYearRange()
  // );

  const initialSelectedYear = localStorage.getItem('selectedFinancialYear') || getFinancialYearRange();
  const [selectedYear, setSelectedYear] = useState(initialSelectedYear);
  const [fromDate, setFromDate] = useState(`${initialSelectedYear.split('-')[0]}-04-01`);
  const [toDate, setToDate] = useState(`${initialSelectedYear.split('-')[1]}-03-31`);
  const [firstFinancialYear, setFirstFinancialYear] = useState(localStorage.getItem('firstFinancialYear') || '');

  const getFinancialYears = () => {
    const today = new Date();
    const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    const startYear = currentYear - 4; // Get the previous 4 financial years

    return Array.from({ length: 5 }, (_, i) => {
      const year = startYear + i;
      return { value: `${year}-${year + 1}`, label: `${year}-${year + 1}` };
    });
  };

  const partyOptions = getFinancialYears();

  // Handle year selection
  const handleChange = (selectedOption) => {
    setSelectedYear(selectedOption.value);
    localStorage.setItem('selectedFinancialYear', selectedOption.value);
    const [startYear, endYear] = selectedOption.value.split('-');

    // Set new from and to dates
    setFromDate(`${startYear}-04-01`);
    setToDate(`${endYear}-03-31`);

    const newFromDate = `${startYear}-04-01`;
    const newToDate = `${endYear}-03-31`;
    // Save in localStorage
    localStorage.setItem('savedFromDate', newFromDate);
    localStorage.setItem('savedToDate', newToDate);
  };

  useEffect(() => {
    localStorage.setItem('selectedFinancialYear', selectedYear);
    const [startYear, endYear] = selectedYear.split('-');
    setFromDate(`${startYear}-04-01`);
    setToDate(`${endYear}-03-31`);
  }, [selectedYear]);

  // useEffect(() => {
  //   fetchFinancialYear();
  // }, []);

  // const fetchFinancialYear = async () => {
  //   try {
  // 	const data = await dispatch(GetFinancialYear({ partner_id: id })).unwrap();
  // 	// console.log("Financial year updated from backend:", data.first_financial_year);
  // 	if (data?.first_financial_year && data.first_financial_year !== firstFinancialYear) {
  // 	  console.log("Financial year updated from backend:", data.first_financial_year);

  // 	  // Update local state and localStorage
  // 	  setFirstFinancialYear(data.first_financial_year);
  // 	  localStorage.setItem("firstFinancialYear", data.first_financial_year);

  // 	  // Update the selected financial year dropdown
  // 	  // const updatedYear = data.firstFinancialYear;
  // 	  // setSelectedYear(updatedYear);
  // 	  // localStorage.setItem("selectedFinancialYear", updatedYear);
  // 	}
  //   } catch (error) {
  // 	console.error('Error fetching financial year:', error.message);
  //   }
  // };

  function formatToINRCurrency(amount) {
    if (typeof amount === 'string') {
      amount = amount.replace(/,/g, ''); // Remove commas if the input is a string
    }

    if (isNaN(amount) || amount === '' || amount === null) return 'Invalid Amount'; // Handle invalid inputs

    return `₹${Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  const fetchSaleTotal = async () => {
    const newItem = {
      partner_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };
    try {
      const data = await dispatch(Getsales(newItem)).unwrap();
      setSaleTotal(data?.data?.total_sales);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  const fetchPurchaseTotal = async () => {
    const newItem = {
      partner_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };
    try {
      const data = await dispatch(Getpurchase(newItem)).unwrap();
      setTotalPurchase(data?.data?.total_purchases);
    } catch (error) {
      console.log('Error fetching', error.message);
    }
  };

  const fetchTotalbankbalance = async () => {
    const newItem = {
      partner_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };
    try {
      const data = await dispatch(Getbankbalance(newItem)).unwrap();
      setTotalbankbalance(data?.data?.total_bank_balance);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  // const fetchTotalCash = async () => {
  //   const newItem = {
  // 	partner_id: id,
  // 	from_date: fromDate, // Ensure from_date is sent
  // 	to_date: toDate, // Ensure to_date is sent
  //   };
  //   try {
  // 	const data = await dispatch(GetTotalCash(newItem)).unwrap();
  // 	setTotalCash(data?.total_cash_balance);
  //   } catch (error) {
  // 	console.log('Error fetching ', error.message);
  //   }
  // };

  const fetchFop = async () => {
    const newItem = {
      partner_id: id,
    };
    try {
      const data = await dispatch(Gettotalclients(newItem)).unwrap();
      setFop(data?.total_clients);
      console.log('FOP', data.total_clients);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPurchaseTotal(), fetchSaleTotal(), fetchTotalbankbalance(), fetchFop()]);

      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, id, fromDate, toDate]);

  return (
    <div>
      <div class="row" style={{ marginLeft: '0', marginRight: '0' }}>
        <Navbarside />
        {isLoading && <Loader />}
        <div class="main-content pt-0">
          <div class="container">
            <div class="page-header">
              <div>
                <h2 className="main-content-title tx-24 mg-b-5">
                  Welcome To {Name} ({user_type === 'partner_user' ? 'Partner User' : user_type})
                </h2>

                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    Project Dashboard
                  </li>
                </ol>
              </div>
              <div class="d-flex justify-content-end a align-items-center">
                <h2 className="main-content-title tx-24 " style={{ margin: '0' }}>
                  {selectedYear}
                </h2>
                <div className="" style={{ marginLeft: '14px' }}>
                  <Select options={partyOptions} placeholder="--Select Year--" onChange={handleChange} value={partyOptions.find((option) => option.value === selectedYear)} />
                </div>
              </div>
            </div>
            <div class="row row-sm">
              <div class="col-sm-12 col-lg-12 col-xl-12">
                <div class="row row-sm">
                  <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4">
                    <div class="card custom-card">
                      <div class="card-body">
                        <div class="card-item">
                          <div class="card-item-icon card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path
                                d="M12 4c-4.41 0-8 3.59-8 8 0 1.82.62 3.49 1.64 4.83 1.43-1.74 4.9-2.33 6.36-2.33s4.93.59 6.36 2.33C19.38 15.49 20 13.82 20 12c0-4.41-3.59-8-8-8zm0 9c-1.94 0-3.5-1.56-3.5-3.5S10.06 6 12 6s3.5 1.56 3.5 3.5S13.94 13 12 13z"
                                opacity=".3"
                              />
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z" />
                            </svg>
                          </div>
                          <div class="card-item-title mb-2">
                            <label class="main-content-label tx-13 font-weight-bold mb-1">Total FPO</label>
                            {/* <span class="d-block tx-12 mb-0 text-muted">Previous month vs this months</span> */}
                          </div>
                          <div class="card-item-body">
                            <div class="card-item-stat">
                              <h4 class="font-weight-bold">{fop}</h4>
                              {/* <small>
                                <b class="text-success">55%</b> higher
                              </small> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4">
                    <div class="card custom-card">
                      <div class="card-body">
                        <div class="card-item">
                          <div class="card-item-icon card-icon">
                            <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                              <g>
                                <rect fill="none" height="24" width="24" />
                                <path d="M21,7h-4V3H7v4H3v14h18V7z M9,5h6v2H9V5z M19,19H5V9h14V19z" />
                                <polygon points="11,17 13,17 13,12 11,12" />
                                <rect height="2" width="2" x="11" y="10" />
                              </g>
                            </svg>
                          </div>
                          <div class="card-item-title mb-2">
                            <label class="main-content-label tx-13 font-weight-bold mb-1">Total Sales</label>
                            {/* <span class="d-block tx-12 mb-0 text-muted">Employees joined this month</span> */}
                          </div>
                          <div class="card-item-body">
                            <div class="card-item-stat">
                              <h4 class="font-weight-bold">{formatToINRCurrency(saleTotal)}</h4>
                              <small>
                                <Link rel="stylesheet" to="/TotalSaleList">
                                  <b class="text-success">View Sale</b>
                                </Link>
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4">
                    <div class="card custom-card">
                      <div class="card-body">
                        <div class="card-item">
                          <div class="card-item-icon card-icon">
                            <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                              <g>
                                <rect fill="none" height="24" width="24" />
                                <path d="M21,7h-4V3H7v4H3v14h18V7z M9,5h6v2H9V5z M19,19H5V9h14V19z" />
                                <polygon points="11,17 13,17 13,12 11,12" />
                                <rect height="2" width="2" x="11" y="10" />
                              </g>
                            </svg>
                          </div>
                          <div class="card-item-title mb-2">
                            <label class="main-content-label tx-13 font-weight-bold mb-1">Total Purchase</label>
                            {/* <span class="d-block tx-12 mb-0 text-muted">Employees joined this month</span> */}
                          </div>
                          <div class="card-item-body">
                            <div class="card-item-stat">
                              <h4 class="font-weight-bold">{formatToINRCurrency(totalPurchase)}</h4>

                              <small>
                                <Link rel="stylesheet" to="/TotalPurchaseList">
                                  <b class="text-success">View Purchase</b>
                                </Link>
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4">
                    <div class="card custom-card">
                      <div class="card-body">
                        <div class="card-item">
                          <div class="card-item-icon card-icon">
                            <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                              <g>
                                <rect fill="none" height="24" width="24" />
                                <path d="M12,3L2,9v2h20V9L12,3z M5,10V9h14v1H5z" />
                                <rect x="6" y="12" width="2" height="6" />
                                <rect x="10" y="12" width="2" height="6" />
                                <rect x="14" y="12" width="2" height="6" />
                                <rect x="18" y="12" width="2" height="6" />
                                <rect x="2" y="20" width="20" height="2" />
                              </g>
                            </svg>
                          </div>
                          <div class="card-item-title mb-2">
                            <label class="main-content-label tx-13 font-weight-bold mb-1">Total Bank Balance </label>
                            {/* <span class="d-block tx-12 mb-0 text-muted">Employees joined this month</span> */}
                          </div>
                          <div class="card-item-body">
                            <div class="card-item-stat">
                              <h4 class="font-weight-bold">{formatToINRCurrency(totalbankbalance)}</h4>
                              <small>
                                <Link rel="stylesheet" to="/TotalBankBalanceList">
                                  <b class="text-success">View Bank Balance</b>
                                </Link>
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-4">
                    <div class="card custom-card">
                      <div class="card-body">
                        <div class="card-item">
                          <div class="card-item-icon card-icon">
                            <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                              <g>
                                <rect fill="none" height="24" width="24" />
                                <path d="M3,5v14h18V5H3z M19,17H5V7h14V17z" />
                                <circle cx="12" cy="12" r="2" />
                                <path d="M7,9h2v2H7V9z" />
                                <path d="M15,9h2v2h-2V9z" />
                                <path d="M7,13h2v2H7V13z" />
                                <path d="M15,13h2v2h-2V13z" />
                              </g>
                            </svg>
                          </div>
                          <div class="card-item-title  mb-2">
                            <label class="main-content-label tx-13 font-weight-bold mb-1">Total Cash</label>
                          </div>
                          <div class="card-item-body">
                            <div class="card-item-stat">
                              <h4 class="font-weight-bold">{formatToINRCurrency(0)}</h4>
                              <small>
                                <Link rel="stylesheet" to="/TotalBankBalanceList">
                                  <b class="text-success">View Cash</b>
                                </Link>
                              </small>
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
}

export default Home;
