import { LicenceCheck } from "../../store/slices/client";

export const API_BASE_URL =
  process.env.API_BASE_URL || "https://kisaan-khata-api.updateproject.com/";
  // process.env.API_BASE_URL || "https://api.kisaankhata.com";

export const X_API_KEY="z3rlamk8xyv4r79x5wb8t35x3ot49yzg"
 // CommonImgUploadService
// export const CommonImgUploadService_BASE_URL="updateproject.com/kisaan-khata-api/uploads"
export const CommonImgUploadService_BASE_URL="https://kisaankhata.com/api/uploads"


export const API_PATHS = {
  
  // // get Expert list
  // ExperList: API_BASE_URL +'/get/expertise',

  // // Dashboard Api url 
  // dashboard :API_BASE_URL + "dashboard/admin",

  // //upload media
  // uploadImage: API_BASE_URL_WM + "/upload",
  // multiUploadImage: API_BASE_URL + "/multiUpload",


  //  /farmer_documents

  //authentication
  login: "/partner-company/login",
  partnerList: "/partner-company/list",
  partnerAdd: "/partner-company/add",
  partnerEdit: "/partner-company/get-detail",
  partnerUpdate: "/partner-company/update",

  clientList: "/clients/list",
  clientAdd: "/clients/add",
  clientEdit: "/clients/get-detail",
  clientUpdate: "/clients/update",
  CheckEmailclients :"/clients/check-email",
  CheckGSTclients :"/clients/check-gst",
  getstate:"/common/getstatelist",
  licenceList : "licence/list",
  licenceAdd : "licence/store",
  licenceEdit : "licence/get-detail",
  licenceUpdate : "licence/update",
  LicenceCheck : "licence/check",
  complianceList : "compliance/index",
  complianceAdd : "compliance/store",
  complianceEdit : "compliance/edit",
  complianceUpdate : "compliance/updatedata",

// home page
getsales:"/partner/getsales",
getpurchase:"/partner/getpurchase",
gettotalclients:"/partner/totalclients",
getbankbalance:"/partner/getbankbalance",
// getsales:"/partner/getsales",


gettotalsales:"/dashboard/get-total-sales",
gettotalpurchase: "/dashboard/get-total-purchase",
ProfitLoss:"/ledger/get-pl-statement",
gettotalbankbalance:"/dashboard/get-total-bank-balance",
gettotalcash:"/dashboard/get-total-cash",
gettotalsundrydebtors:"/dashboard/get-total-sundry-debtors",
gettotalsundrycreditors:"/dashboard/get-total-sundry-creditors",
stockinventorytotal:"/report/stock-inventory-total",
getfinancialyear: "/client/get-financial-year",


  

}