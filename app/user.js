//user.js

var defaults = {
  firstName : "Michelle",
  lastName : "Doe",
  pcn : 234567891,
  matD : true,
  medE : false,
  ppcF : false,
  hc2L : false,
  esaH : false,
  jsaK : false,
  tcM : false,
  pcS : false,
  ticked : "D",
  hasEmail : false,
  email : "mdoe@gmail.com",
  addressLineOne : "1 Old Street",
  addressLineTwo : "",
  addressTown : "Town",
  addressPostCode : "NE1 0LD",
  fullAddress : "1 Old Street, Old Town NE1 0LD",
};

var user = {
  resetUser : function () {
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        user[key] = defaults[key];
      }
    }
  },
  updateAddress : function () {
    this.fullAddress = this.addressLineOne;
    if (this.addressLineTwo != "") {
      this.fullAddress = this.fullAddress + ", " + this.addressLineTwo;
    }
    this.fullAddress = this.fullAddress + ",  " + this.addressTown + " " + this.addressPostCode;
  },
  removeCat : function (cat) {
    if (cat === undefined) {
      this.matD = false;
      this.medE = false;
      this.ppcF = false;
      this.hc2L = false;
      this.esaH = false;
      this.jsaK = false;
      this.tcM = false;
      this.pcS = false;
    } else {
      if (cat === "matD") {
        this.matD = false;
      }
      if (cat === "medE") {
        this.medE = false;
      }
      if (cat === "ppcF") {
        this.ppcF = false;
      }
      if (cat === "hc2L") {
        this.hc2L = false;
      }
      if (cat === "esaH") {
        this.esaH = false;
      }
      if (cat === "jsaK") {
        this.jsaK = false;
      }
      if (cat === "tcM") {
        this.tcM = false;
      }
      if (cat === "pcS") {
        this.pcS = false;
      }
    }
  },
  setCats : function (user) {
    if (user.matD === true) {
      this.matD = true;
    } else {
      this.matD = false;
    }
    if (user.medE === true) {
      this.medE = true;
    } else {
      this.medE = false;
    }
    if (user.ppcF === true) {
      this.ppcF = true;
    } else {
      this.ppcF = false;
    }
    if (user.hc2L === true) {
      this.hc2L = true;
    } else {
      this.hc2L = false;
    }
    if (user.jsaK === true) {
      this.jsaK = true;
    } else {
      this.jsaK = false;
    }
    if (user.esaH === true) {
      this.esaH = true;
    } else {
      this.esaH = false;
    }
    if (user.tcM === true) {
      this.tcM = true;
    } else {
      this.tcM = false;
    }
    if (user.pcS === true) {
      this.pcS = true;
    } else {
      this.pcS = false;
    }
  },
  update : function(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.pcn = user.pcn;
    this.setCats(user);
    this.ticked = user.ticked;
  },
  showCats : function () {
    console.log(
      "Matex: " + this.matD + "\n" +
      "Medex: " + this.medE + "\n" +
      "PPC: " + this.ppcF + "\n" +
      "HC2: " + this.hc2L + "\n" +
      "JSA: " + this.jsaK + "\n" +
      "ESA: " + this.esaH + "\n" +
      "TC: " + this.tcM + "\n" +
      "Pen cred: " + this.pcS
    );
  }
};

//function testUser(id) {
//  currentUser = getUser(id);
//  if(found === true) {
//    console.log("Found: " + JSON.stringify(currentUser) );
//  } else {
//    console.log("Not found!");
//  }
//}

//testUser(234567891);

user.resetUser();
module.exports.user = user;