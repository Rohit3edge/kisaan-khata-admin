import React from 'react';
import Pagination from './Pagination';
import Moment from 'moment';

const Table = ({ columns, data, tableRef, pageSize, setPageSize, currentPage, totalCount, onPageChange, handleSearchChange, closing_balance,handleEdit ,handleViewDashboard,handleDelete}) => {
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const renderCellContent = (column, row) => {
    const formatAmount = (value) => {
      if (typeof value !== 'string') {
        // If value is not a string, convert it to a string or handle accordingly
        value = value?.toString() || '0'; // Convert value to a string, default to '0' if undefined
      }
    
      // Remove commas and convert the value to a number
      const numericValue = parseFloat(value.replace(/,/g, ''));
    
      // Ensure the value is a valid number before formatting
      if (isNaN(numericValue)) {
        return 'Invalid amount'; // Handle invalid values appropriately
      }
    
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue);
    };
    
    if (column.isAction) {
      return (
        <>
          {column.actionButtons?.map((button, index) => (
            <button key={index} className={`btn-sm ${button.className}`} onClick={() => {
              if (button.name === "Edit") {
                handleEdit(row);
              } else if (button.name === "View Dashboard") {
                handleViewDashboard(row);
              }else if (button.name === 'Delete') {
                handleDelete(row);
              }
            }}>
              {button.name}
            </button>
          ))}
        </>
      );
    }
  
    switch (column.field) {
      case 'Client_combo':
        if (row.partner_user_permissions !== "") {
          const permissions = row.partner_user_permissions || '';
          const formattedPermissions = permissions
            ? permissions.split('.,').join(',<br/>')
            : '';
      
          return (
            <div dangerouslySetInnerHTML={{ __html: formattedPermissions }} />
          );
        } else {
          return null;
        }
      
       

      case 'invoice_combined':
        if (row.invoice_prefix==null)return`${row.invoice_number}`
      return `${row.invoice_prefix}${row.invoice_number}`;
      case 'added_on':
        return Moment(row[column.field]).format('DD-MM-YYYY');
        case 'date_added':
        return Moment(row[column.field]).format('DD-MM-YYYY');
      case 'payment_date':
        return Moment(row[column.field]).format('DD-MM-YYYY');
        case 'invoice_date':
        return Moment(row[column.field]).format('DD-MM-YYYY');
        case 'number_of_licence':
          return row.number_of_licence == null ? `${row.number_of_licence}` : `${row.client_count} / ${row.number_of_licence}`;
      case 'dr':
        return Number(row[column.field]) === 0 ? '' : <span className="text-danger">{formatAmount(row[column.field])}</span>;
      case 'cr':
        return Number(row[column.field]) === 0 ? '' : <span className="text-success">{formatAmount(row[column.field])}</span>;
      case 'amount': 
        return formatAmount(row[column.field]);
        case 'grand_total': 
        return formatAmount(row[column.field]);
        case "bank_balance":
        case "sales":
          case "purchases":
      case 'balance':
        return formatAmount(row[column.field]);
      case 'description':
        // Trim the description to remove leading/trailing newlines
        const trimmedDescription = row[column.field].trim();
        return trimmedDescription.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ));
      case 'sale_price':
        return formatAmount(row[column.field]);
      default:
        return row[column.field];
    }
  };
  

  return (
    <div className="card custom-card mb-4">
      {data?.length === 0 && !handleSearchChange ? (
        <div className="card-body">
          <h2 className="text-center">No Record Found!!</h2>
        </div>
      ) : (
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label>
                <select name="pageSize" value={pageSize} onChange={handlePageSizeChange} className="form-select">
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                &nbsp;items/page
              </label>
            </div>
            <div className="col-md-6">
              <input type="search" className="form-control" placeholder="Search..." style={{ float: 'right', width: 'auto' }} onChange={handleSearchChange} />
            </div>
          </div>
          {closing_balance ? (
            <div className="text-right" style={{ padding: '10px 0 10px 0px', fontWeight: '700' }}>
              Closing Balance: ₹ {closing_balance}
            </div>
          ) : null}
          {data?.length === 0 ? (
            <h2 className="text-center">No Record Found!!</h2>
          ) : (
            <>
              <table className="table table-bordered border-bottom" ref={tableRef}>
                <thead className="table-header">
                  <tr>
                    {columns?.map((column) => (
                      <th key={column?.field} style={column?.field === 'added_on' || column?.field === 'payment_date' || column?.field === 'invoice_date' ? { width: '8rem' } : {}}>{column?.header} </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>{renderCellContent(column, row)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="PaginationContainer">
                <span className="total-elements">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalCount)} of {totalCount} entries
                </span>
                <Pagination currentPage={currentPage} totalCount={totalCount} itemsPerPage={pageSize} onPageChange={onPageChange} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Table;
