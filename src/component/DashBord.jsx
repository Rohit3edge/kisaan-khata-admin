import React, { useState, useEffect } from 'react';
import { useParams,useLocation  } from 'react-router-dom';
import {GetProfitLoss,GetFinancialYear, GetTotalSales, GetTotalPurchase, GetTotalbankbalance, GetTotalCash, GetTotalSundryDebtors, GetTotalSundryCreditors, GetStockInventoryTotal } from '../store/slices/home';
import { useDispatch, useSelector } from 'react-redux';
import Navbarside from '../component/Navbarside';
import Footer from './Footer';
import Loader from '../common/Loader';
import Select from 'react-select';
import Widget from './widget/widget';

function Home() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { dashboardId } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = dashboardId;
  const Name = location.state?.company_name;
  const topName = user?.data?.company_name;
  const role = user?.data?.role;
  const permissions = user?.data?.permissions?.split(',') || [];
  const isAdmin = role === 'Admin';

  const today = new Date();

  // // Financial year calculation
  // const getFinancialYearStartDate = () => {
  //   const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  //   return `${currentYear}-04-01`;
  // };

  const getFinancialYearRange = () => {
    const startYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    const endYear = startYear + 1;
    return `${startYear}-${endYear}`;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [saleTotal, setSaleTotal] = useState();
  const [totalbankbalance, setTotalbankbalance] = useState();
  const [totalCash, setTotalCash] = useState();
  const [totalSundryDebtors, setTotalSundryDebtors] = useState();
  const [totalSundryCreditors, setTotalSundryCreditors] = useState();
  const [totalPurchase, setTotalPurchase] = useState();
  const [stockInventoryTotal, setStockInventoryTotal] = useState();
  const [profitLoss, setProfitLoss] = useState({});
  // const [selectedYear, setSelectedYear] = useState(
  //   localStorage.getItem("selectedFinancialYear") || getFinancialYearRange()
  // );

  const initialSelectedYear = localStorage.getItem('selectedFinancialYear') || getFinancialYearRange();
  const [selectedYear, setSelectedYear] = useState(initialSelectedYear);
  const [fromDate, setFromDate] = useState(`${initialSelectedYear.split('-')[0]}-04-01`);
  const [toDate, setToDate] = useState(`${initialSelectedYear.split('-')[1]}-03-31`);
  const [firstFinancialYear, setFirstFinancialYear] = useState(localStorage.getItem('firstFinancialYear') || '');

  const getFinancialYears = () => {
    // const firstFinancialYear = localStorage.getItem("firstFinancialYear") || ""; // Ensure it's a string

    if (!firstFinancialYear.includes('-')) {
      console.error('Invalid firstFinancialYear format:', firstFinancialYear);
      return [];
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-based in JavaScript (0 = Jan, 11 = Dec)

    // Extract the first financial year start
    const [firstStartYear] = firstFinancialYear.split('-').map(Number);

    if (isNaN(firstStartYear)) {
      console.error('Invalid start year in firstFinancialYear:', firstFinancialYear);
      return [];
    }

    // Determine the last financial year to be displayed
    const lastFinancialYear = currentMonth > 3 ? currentYear : currentYear - 1;

    return Array.from({ length: lastFinancialYear - firstStartYear + 1 }, (_, i) => {
      const startYear = firstStartYear + i;
      const endYear = startYear + 1;
      return { value: `${startYear}-${endYear}`, label: `${startYear}-${endYear}` };
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

  useEffect(() => {
    fetchFinancialYear();
  }, []);

  const fetchFinancialYear = async () => {
    try {
      const data = await dispatch(GetFinancialYear({ profile_id: id })).unwrap();
      // console.log("Financial year updated from backend:", data.first_financial_year);
      if (data?.first_financial_year && data.first_financial_year !== firstFinancialYear) {
        console.log('Financial year updated from backend:', data.first_financial_year);

        // Update local state and localStorage
        setFirstFinancialYear(data.first_financial_year);
        localStorage.setItem('firstFinancialYear', data.first_financial_year);

        // Update the selected financial year dropdown
        // const updatedYear = data.firstFinancialYear;
        // setSelectedYear(updatedYear);
        // localStorage.setItem("selectedFinancialYear", updatedYear);
      }
    } catch (error) {
      console.error('Error fetching financial year:', error.message);
    }
  };

  const fetchStocks = async () => {
    const newItem = {
      profile_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };

    try {
      const data = await dispatch(GetStockInventoryTotal(newItem)).unwrap();
      setStockInventoryTotal(data?.stock_value);
    } catch (error) {
      console.log('Error fetching stock:', error.message);
    }
  };

  const fetchProfitLoss = async () => {
    const newItem = {
      profile_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };

    try {
      const data = await dispatch(GetProfitLoss(newItem)).unwrap();
      setProfitLoss(data?.data?.income_statement?.['Gross Profit/Loss']);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  const fetchSaleTotal = async () => {
    const newItem = {
      profile_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };
    try {
      const data = await dispatch(GetTotalSales(newItem)).unwrap();
      setSaleTotal(data?.data?.sale);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  const fetchPurchaseTotal = async () => {
    const newItem = {
      profile_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };
    try {
      const data = await dispatch(GetTotalPurchase(newItem)).unwrap();
      setTotalPurchase(data?.data?.purchase);
    } catch (error) {
      console.log('Error fetching', error.message);
    }
  };

  const fetchTotalbankbalance = async () => {
    const newItem = {
      profile_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };
    try {
      const data = await dispatch(GetTotalbankbalance(newItem)).unwrap();
      setTotalbankbalance(data?.total_bank_balance);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  const fetchTotalCash = async () => {
    const newItem = {
      profile_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };
    try {
      const data = await dispatch(GetTotalCash(newItem)).unwrap();
      setTotalCash(data?.total_cash_balance);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  const fetchTotalSundryDebtors = async () => {
    try {
      const data = await dispatch(GetTotalSundryDebtors({ profile_id: id })).unwrap();
      setTotalSundryDebtors(data?.total_sundry_debtors_count);
    } catch (error) {
      console.log('Error fetching', error.message);
    }
  };

  const fetchTotalSundryCreditors = async () => {
    try {
      const data = await dispatch(GetTotalSundryCreditors({ profile_id: id })).unwrap();
      setTotalSundryCreditors(data?.total_sundry_creditors_count);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPurchaseTotal(), fetchSaleTotal(), fetchTotalbankbalance(), fetchTotalSundryCreditors(), fetchTotalSundryDebtors(), fetchTotalCash(), fetchProfitLoss(), fetchStocks()]);

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
              <h2 class="main-content-title tx-24 mg-b-5">
                Welcome To {topName}
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
          <div className="row">
                <div className="col-md-12">
                  <div className="card custom-card-home">
                    <div className="card-body">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-xl-12 col-lg-12 col-md-6 col-12">
                            <div className="card-block pt-2 pb-0 d-flex" style={{ gap: '15px' }}>
                              <Widget type="FPO" title={Name} />
                              <Widget type="Share Capital" amount={0} title="Share Capital" link="See details" isMoney={true} />
                              <Widget type="Share Holder" amount={0} title="Share Holder" link="See details" isMoney={false} />
                            </div>
                            <div className="card-block pt-2 pb-0 d-flex" style={{ gap: '15px' }}>
                              <Widget type="Sale" amount={Number(saleTotal)} title="Sale" link={isAdmin || permissions.includes('Invoices') ? 'View Sale' : ''} isMoney={true} path="/invoicelist" />
                              <Widget
                                type="Purchase"
                                amount={Number(totalPurchase)}
                                title="Purchase"
                                link={isAdmin || permissions.includes('Purchase Voucher') ? 'View Purchase' : ''}
                                isMoney={true}
                                path="/purchase/purchasevoucherlist"
                              />
                              <Widget
                                type="Net Profit"
                                amount={profitLoss?.amount}
                                title={profitLoss?.description == 'Gross Profit' ? 'Net Profit' : 'Net Loss'}
                                link={isAdmin || permissions.includes('Business Reports') ? 'See details' : ''}
                                isMoney={true}
                                path="/reports/profitandloss"
                              />
                            </div>
                            <div className="card-block pt-2 pb-0 d-flex" style={{ gap: '15px' }}>
                              <Widget
                                type="Stock"
                                amount={stockInventoryTotal}
                                title="Stock"
                                link={isAdmin || permissions.includes('Stock Reports') ? 'View all Stock' : ''}
                                isMoney={true}
                                path="/reports/stocksummary"
                              />
                              <Widget type="Bank" amount={Number(totalbankbalance)} title="Bank" isMoney={true} />
                              <Widget
                                type="Cash"
                                amount={Number(totalCash)}
                                title="Cash"
                                isMoney={true}
                                link={isAdmin || permissions.includes('Ledger') ? 'See Cash details' : ''}
                                path="/ledgerdetails/1"
                              />
                            </div>
                            <div className="card-block pt-2 pb-0 d-flex" style={{ gap: '15px' }}>
                              <Widget type="Sundry Debtors" amount={Number(totalSundryDebtors)} title="Sundry Debtors" isMoney={false} />
                              <Widget type="Sundry Creditors" amount={Number(totalSundryCreditors)} title="Sundry Creditors" isMoney={false} />
                              <Widget type="Assets" amount={0} title="Assets" link="See details" isMoney={false} />
                            </div>
                            {/* <div className="charts"> */}
                            {/* <Featured /> */}
                            {/* <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} /> */}
                            {/* </div> */}
                            <div id="Widget-line-chart" className="height-70 lineChartWidget WidgetlineChart mb-2"></div>
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


