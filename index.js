var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "EMPLOYEE-DATABASE";
var empRelationName = "EMP-DATA";
var connToken = "90934956|-31949252301077115|90959516";

setBaseUrl(jpdbBaseURL);

function disableCtrl(ctrl) {
  $("#new").prop("disabled", ctrl);
  $("#save").prop("disabled", ctrl);
  $("#edit").prop("disabled", ctrl);
  $("#change").prop("disabled", ctrl);
  $("#reset").prop("disabled", ctrl);
}

function disableNav(ctrl) {
  $("#first").prop("disabled", ctrl);
  $("#prev").prop("disabled", ctrl);
  $("#next").prop("disabled", ctrl);
  $("#last").prop("disabled", ctrl);
}

function disableForm(bValue) {
  $("#empid").prop("disabled", bValue);
  $("#empname").prop("disabled", bValue);
  $("#empsal").prop("disabled", bValue);
  $("#hra").prop("disabled", bValue);
  $("#da").prop("disabled", bValue);
  $("#deduct").prop("disabled", bValue);
}

function makeDataFormEmpty() {
  $("#empid").val("");
  $("#empname").val("");
  $("#empsal").val("");
  $("#hra").val("");
  $("#da").val("");
  $("#deduct").val("");
}

function setFirstRecNo2LS(jsonObj) {
  var data = JSON.parse(jsonObj.data);
  localStorage.setItem("first_rec_no", data.rec_no ?? "0");
}
function setLastRecNo2LS(jsonObj) {
  var data = JSON.parse(jsonObj.data);
  localStorage.setItem("last_rec_no", data.rec_no ?? "0");
}
function setCurrRecNo2LS(jsonObj) {
  var data = JSON.parse(jsonObj.data);
  localStorage.setItem("curr_rec_no", data.rec_no ?? "0");
}

function setNextRecNo2LS(jsonObj) {
  var data = JSON.parse(jsonObj.data);
  localStorage.setItem("next_rec_no", data.rec_no ?? "0");
}

function getFirstRecNoFromLS() {
  return localStorage.getItem("first_rec_no");
}
function getLastRecNoFromLS() {
  return localStorage.getItem("last_rec_no");
}
function getCurrRecNoFromLS() {
  return localStorage.getItem("curr_rec_no");
}
function getNextRecNoFromLS() {
  return localStorage.getItem("next_rec_no");
}

function isNoRecordPresentLS() {
  return getFirstRecNoFromLS() === "0" && getLastRecNoFromLS() === "0";
}
function isOnlyOneRecordPresent() {
  return (
    !isNoRecordPresentLS() && getFirstRecNoFromLS() === getLastRecNoFromLS()
  );
}

function initEmpForm() {
  localStorage.removeItem("first_rec_no");
  localStorage.removeItem("last_rec_no");
  localStorage.removeItem("curr_rec_no");
  console.log("initEmpForm() - done");
}

function validateData() {
  var empid = $("#empid").val();
  var empname = $("#empname").val();
  var empsal = $("#empsal").val();
  var hra = $("#hra").val();
  var da = $("#da").val();
  var deduct = $("#deduct").val();

  if (!empid) {
    alert("Employee ID missing");
    $("#empid").focus();
    return "";
  }
  if (!empname) {
    alert("Employee name missing");
    $("#empname").focus();
    return "";
  }
  if (!empsal) {
    alert("Employee salary missing");
    $("#empsal").focus();
    return "";
  }
  if (!hra) {
    alert("Employee HRA missing");
    $("#hra").focus();
    return "";
  }
  if (!da) {
    alert("Employee DA missing");
    $("#da").focus();
    return "";
  }
  if (!deduct) {
    alert("Employee Deduction missing");
    $("#deduct").focus();
    return "";
  }

  var jsonStrObj = {
    id: empid,
    empname: empname,
    empsal: empsal,
    hra: hra,
    da: da,
    deduct: deduct,
  };
  return JSON.stringify(jsonStrObj);
}

// function showData(obj) {
//   const record = obj.data && obj.data.record;
//   if (!record) {
//     console.error("No record found", obj);
//     return;
//   }
//   $("#empid").val(record.id || "");
//   $("#empname").val(record.empname || "");
//   $("#empsal").val(record.empsal || "");
//   $("#hra").val(record.hra || "");
//   $("#da").val(record.da || "");
//   $("#deduct").val(record.deduct || "");
// }

function showData(obj) {
  if (!obj || obj.status !== 200 || !obj.data) {
    console.error("Invalid response:", obj);
    return;
  }

  var data = JSON.parse(obj.data); // parse string into object
  var record = data.record;

  if (!record) {
    console.error("No record found in response:", obj);
    return;
  }

  $("#empid").val(record.id || "");
  $("#empname").val(record.empname || "");
  $("#empsal").val(record.empsal || "");
  $("#hra").val(record.hra || "");
  $("#da").val(record.da || "");
  $("#deduct").val(record.deduct || "");

  // also update rec_no in localStorage
  localStorage.setItem("curr_rec_no", data.rec_no);
}

function newForm() {
  makeDataFormEmpty();
  disableForm(false);
  disableNav(true);
  disableCtrl(true);
  $("#save").prop("disabled", false);
  $("#reset").prop("disabled", false);
  $("#empid").focus();
}

function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj === "") return;

  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    empDBName,
    empRelationName
  );
  jQuery.ajaxSetup({ async: false });
  var jsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  if (isNoRecordPresentLS()) setFirstRecNo2LS(jsonObj);
  setLastRecNo2LS(jsonObj);
  setCurrRecNo2LS(jsonObj);
  resetForm();
  $("#empid").focus();
}

function editData() {
  disableForm(false);
  $("#empid").prop("disabled", true);
  disableNav(true);
  disableCtrl(true);
  $("#change").prop("disabled", false);
  $("#reset").prop("disabled", false);
  $("#empname").focus();
}
// 1
function changeData() {
  var jsonChg = validateData();
  if (jsonChg === "") return;

  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonChg,
    empDBName,
    empRelationName,
    getCurrRecNoFromLS()
  );
  jQuery.ajaxSetup({ async: false });
  var jsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });

  console.log(jsonObj);
  resetForm();
  $("#empid").focus();
}

function resetForm() {
  disableCtrl(true);
  disableNav(false);

  $("#empid").val("");
  $("#empname").val("");
  $("#empsal").val("");
  $("#hra").val("");
  $("#da").val("");
  $("#deduct").val("");

  $("#empid").focus();

  if (isOnlyOneRecordPresent() || isNoRecordPresentLS()) disableNav(true);

  $("#new").prop("disabled", false);
  $("#edit").prop("disabled", !isNoRecordPresentLS());
  disableForm(true);
}

function getEmpId() {
  var empId = $("#empid").val().trim();
  return JSON.stringify({ id: empId });
}

var jsonObj = {
  id: $("#empid").val(),
  empname: $("#empname").val(),
  empsal: $("#empsal").val(),
  hra: $("#hra").val(),
  da: $("#da").val(),
  deduct: $("#deduct").val(),
};

function saveRecNo2LS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function fillData(jsonObj) {
  if (!jsonObj || jsonObj.status !== 200 || !jsonObj.data) {
    console.error("Invalid response:", jsonObj);
    return;
  }

  var data = JSON.parse(jsonObj.data);
  var record = data.record;

  if (!record) {
    console.error("No record found in fillData:", jsonObj);
    return;
  }

  $("#empid").val(record.id);
  $("#empname").val(record.empname);
  $("#empsal").val(record.empsal);
  $("#hra").val(record.hra);
  $("#da").val(record.da);
  $("#deduct").val(record.deduct);

  localStorage.setItem("curr_rec_no", data.rec_no);
}

function getEmpFromEmpID() {
  var empID = getEmpId();

  var getRequest = createGET_BY_KEYRequest(
    connToken,
    empDBName,
    empRelationName,
    empID
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseURL,
    jpdbIRL
  );

  jQuery.ajaxSetup({ async: true });

  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#empname").focus();
  } else if (resJsonObj.status === 200) {
    fillData(resJsonObj);
    $("#empid").prop("disabled", true);

    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#empname").focus();
  }
}

function getFirst() {
  var getFirstRequest = createFIRST_RECORDRequest(
    connToken,
    empDBName,
    empRelationName
  );
  jQuery.ajaxSetup({ async: false });
  var result = executeCommandAtGivenBaseUrl(
    getFirstRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });

  showData(result);
  setFirstRecNo2LS(result);
  $("#first, #prev").prop("disabled", true);
  $("#next").prop("disabled", false);
}

function getPrev() {
  var r = getCurrRecNoFromLS();
  var getPrevRequest = createPREV_RECORDRequest(
    connToken,
    empDBName,
    empRelationName,
    r
  );
  jQuery.ajaxSetup({ async: false });
  var result = executeCommandAtGivenBaseUrl(
    getPrevRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });

  showData(result);
  $("#save").prop("disabled", true);
}

function getNext() {
  var r = parseInt(localStorage.getItem("curr_rec_no")); // current record number
  if (!r) {
    alert("No current record found!");
    return;
  }

  var nextRecNo = r + 1;

  var getNextRequest = createGET_BY_RECORDRequest(
    connToken,
    empDBName,
    empRelationName,
    nextRecNo
  );

  jQuery.ajaxSetup({ async: false });
  var result = executeCommandAtGivenBaseUrl(
    getNextRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });

  if (result.status === 200) {
    showData(result); // fill the form with next record
    $("#save").prop("disabled", true);
  } else {
    alert("You are already at the last record!");
  }
}

// function getNext() {
//   var r = getCurrRecNoFromLS();
//   var getNextRequest = createNEXT_RECORDRequest(
//     connToken,
//     empDBName,
//     empRelationName,
//     r
//   );

//   jQuery.ajaxSetup({ async: false });
//   var result = executeCommandAtGivenBaseUrl(
//     getNextRequest,
//     jpdbBaseURL,
//     jpdbIRL
//   );
//   jQuery.ajaxSetup({ async: true });

//   if (result.status === 200) {
//     // Successfully got the next record
//     showData(result);
//     setCurrRecNo2LS(result);
//     $("#save").prop("disabled", true);
//   } else if (result.message === "EOF") {
//     // No more records (already at the last one)
//     alert("You are already at the last record!");
//   } else {
//     alert("Error: " + result.message);
//   }
// }

function getLast() {
  var getLastRequest = createLAST_RECORDRequest(
    connToken,
    empDBName,
    empRelationName
  );
  jQuery.ajaxSetup({ async: false });
  var result = executeCommandAtGivenBaseUrl(
    getLastRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });

  showData(result);
  setLastRecNo2LS(result);

  $("#last, #next").prop("disabled", true);
  $("#first, #prev").prop("disabled", false);
}
