var express = require('express');
var router = express.Router();
module.exports = router;

//import the recipients fakerbase
var usersDB = require('./recipients.js');
var users = usersDB.users;

//import the user object
var masterUser = require('./user.js');
var currentUser = masterUser.user;

//import the content
var content = require('./content.js');
var dynamicContent = content.content;

var checkDate = "1 September and 30 September 2017"
var challengeDate = "16 December 2017"
//var paymentTwo = "18 November 2017"
//var paymentThree = "19 December 2017"
//var paymentFour = "19 January 2017"

// pay journey
var payer = {
    name : "Jane Doe",
    email : "mrssmith@gmail.com",
    text : "0757894577878",
    hasEmail : false,
    hasText : false,
    auth : false,
    exemption : "mat",
    //Amount of payment per month
    plan : 344,
    followup : 0,
    remainder: 0,
  resetAll : function () {
    this.name = "Jane Doe";
    this.email = "mrssmith@gmail.com";
    this.hasEmail = false;
    this.hasText = false;
    this.auth = false;
    this.exemption = "mat";
    this.plan = 344;
      this.followup = 0;
      this.remainder = 0;
  }
};

var resetAll = function () {
  currentUser.resetUser();
  dynamicContent.updateContent("D");
};

function findAndUpdate(user) {
  user = parseInt(user);
  var newUser = getUser(user);
  currentUser.update(newUser);
  dynamicContent.updateContent(currentUser.ticked);
}

function getUser(noKey){
  for (var i=0; i < users.length; i++) {
    if (users[i].pcn === noKey) {
      //found = true;
      return users[i];
    }
  }
}

var pcn = {
  pcnNumber : "314159265",
  resetAll : function () {
    console.log("Resetting...");
    this.originalBalance = 68.00;
    this.payment = 0;
    this.totalPayments = 0;
    this.newBalance = 68.00;
  },
  reduce : function () {
    this.newBalance = (this.newBalance - this.payment);
    this.totalPayments = (this.totalPayments + this.payment);
  }
};

var resetPayer = function() {
  pcn.resetAll();
  payer.resetAll();
};

boolToString = ((b) => {
  return (b ? 'Yes' : 'No');
});


// Route index page
router.get('/', function (req, res) {
  resetPayer();
  resetAll();
  res.render('index');
});

router.get(/index/, function (req, res) {
  resetPayer();
  resetAll();
  res.render('index');
});

router.get(/num-handler/, function (req, res) {
  if (req.query.pcnnumber != "") {
    pcn.pcnNumber = req.query.pcnnumber;
  }
  res.redirect('summary');
});

router.get(/summary/, function (req, res) {
  res.render('pay/summary', {
    pcnnumber : pcn.pcnNumber,
    originalbalance : pcn.originalBalance,
    payment : pcn.payment,
    newbalance : pcn.newBalance
  });
});

//router.get('pay-a-penalty/amount-to-pay', function (req, res) {
//  res.render('/pay-a-penalty/amount-to-pay', {
//    pcnnumber : pcn.pcnNumber,
//    originalbalance : pcn.originalBalance,
//    payment : pcn.payment,
//    newbalance : pcn.newBalance
//  });
//});

router.get(/payment-handler/, function (req, res) {
  pcn.payment = parseInt(req.query.amount);
  pcn.reduce();
  res.render('pay/email');
});

router.get(/mail-handler/, function (req, res) {
  if (req.query.email == "yes") {
    payer.hasEmail = true;
      res.redirect('mail-value');
  } else {
    payer.hasEmail = false;
    res.redirect('check');
  }
});

router.get(/m-handler/, function (req, res) {
  if (req.query.email != "") {
    payer.email = req.query.email;
  }
  res.redirect('pay/check');
});

router.get(/check/, function (req, res) {
  res.render('pay/check', {
    pcnnumber : pcn.pcnNumber,
    amount : pcn.payment,
    email : payer.email,
    hasmail : boolToString(payer.hasEmail)
  });
});

router.get(/payment/, function (req, res) {
  res.render('pay/payment', {
    pcnnumber : pcn.pcnNumber,
    payment : pcn.payment
  });
});

router.get(/confirm/, function (req, res) {
  res.render('pay/confirm', {
    payment : pcn.payment
  });
});

router.get(/done/, function (req, res) {
  res.render('pay/done', {
    pcnnumber : pcn.pcnNumber,
    originalbalance : pcn.originalBalance,
    totalpayments : pcn.totalPayments,
    payment : pcn.payment,
    newbalance : pcn.newBalance,
    hasmail : payer.hasEmail,
    email : payer.email
  });
});

router.get(/final/, function (req, res) {
  res.render('pay/final', {
    originalbalance : pcn.originalBalance,
    payment : pcn.payment,
    totalpayments : pcn.totalPayments,
    newbalance : pcn.newBalance
  });
});

router.get(/reduce-handler/, function (req, res) {
  res.redirect('confirm');
});

router.get(/con-handler/, function (req, res) {
  if (pcn.newBalance != 0) {
      res.redirect('done');
  } else {
      res.redirect('final');
  }
});

//Pay
router.get(/pay-handler/, function (req, res) {
  if (payer.auth == true) {
      res.redirect('summary');
  } else {
      res.redirect('number');
  }
});

/* 
******************
***** PAY V3 *****
******************
*/

router.get(/followup-handler/, function (req, res) {
  res.redirect('../pay-penalty/card-dets')
    if (payer.plan == 86){
          payer.followup = 1;
      } else if (payer.plan == 172){
          payer.followup = 2;
      } 
});

router.get('//overview/', function (req, res) {
  res.render('pay-penalty/overview', {
    plan : payer.plan
  });
});

router.get(/plan-option/, function (req, res) {
  if (req.query.plan == "172") {
    /* If the user has selected £34 over 2 months then set plan to 34 */
      payer.plan = 172;
      res.redirect('yourplan')
  } else {
      /* If the user has selected £17 over 4 months then set plan to 17 */
    payer.plan = 86;
    res.redirect('yourplan')
  }
});

router.get('/pay-penalty/end/', function (req, res) {
  res.render('pay-penalty/end', {
    pcnnumber : pcn.pcnNumber,
    hastext : boolToString(payer.hasText),
    text : payer.text,
    hasmail : boolToString(payer.hasEmail),
    email : payer.email,
    plan : payer.plan,
    followup : payer.followup,
      remainder : payer.remainder
  })
})

router.get('/pay-penalty/yourplan', function (req, res) {
  res.render('pay-penalty/yourplan', {
    hastext : boolToString(payer.hasText),
    text : payer.text,
    hasmail : boolToString(payer.hasEmail),
    email : payer.email,
    plan : payer.plan
  })
})

router.get('/pay-penalty/accept/', function (req, res) {
  res.render('pay-penalty/accept', {
    pcnnumber : pcn.pcnNumber,
    plan : payer.plan,
      remainder : payer.remainder,
          hastext : boolToString(payer.hasText),
    text : payer.text,
    hasmail : boolToString(payer.hasEmail),
    email : payer.email,
      followup : payer.followup
  })
})

router.get('/pay-penalty/card-dets/', function (req, res) {
  res.render('pay-penalty/card-dets', {
    pcnnumber : pcn.pcnNumber,
    plan : payer.plan,
      followup: payer.followup,
      remainder: payer.remainder
  })
})

router.get(/contact-handler/, function (req, res) {
  payer.hasText = false;
  payer.hasEmail = false;
  if (req.query.text == 'true') {
    payer.hasText = true;
  }
  if (req.query.email == 'true') {
    payer.hasEmail = true;
  }
  if (payer.hasText) {
    res.redirect('text-value');
  } else if (payer.hasEmail) {
     res.redirect('mail-value');
  } else {
    payer.hasText = false;
    payer.hasEmail = false;
    res.redirect('accept');
  }
});

router.get(/haha-handler/, function (req, res) {
  if (payer.hasEmail) {
    res.redirect('mail-value');
  } else {
     res.redirect('accept');
  }
});

router.get(/nocomms-handler/, function (req, res) {
  payer.hasText = false;
  payer.hasEmail = false;
  res.redirect('accept')
});


router.get('/pay-penalty/recap/', function (req, res) {
 res.render('pay-penalty/recap', {
   pcnnumber : pcn.pcnNumber,
   hastext : boolToString(payer.hasText),
   text : payer.text,
   hasmail : boolToString(payer.hasEmail),
   email : payer.email,
   plan : payer.plan
  });
});

router.get(/payfull-handler/, function (req, res) {

      payer.plan = 344;
      res.redirect('../pay-penalty/card-dets')
  
});

router.get(/remainder-handler/, function (req, res) {

      payer.followup = 1;
      res.redirect('../pay-penalty/card-dets')
  
});

router.get('/pay-penalty/contact-option-full/', function (req, res) {
  res.render('pay-penalty/contact-option-full', {
    plan : payer.plan,

  })
})

/* 
*********************
***** Challenge *****
*********************
*/

// Ask for ref number
router.get(/pcn-number/, function (req, res) {
  currentUser.resetUser();
  res.render('challenge/pcn-number');
});

// find the user
router.get(/lookup-handler/, function (req, res) {
  var entry;
  if (req.query.ref.length === 9) {
    entry = parseInt(req.query.ref);
    findAndUpdate(entry);
  }
  currentUser.showCats();
  res.redirect('penalty-view');
});


// display the users's PCN
router.get('/challenge/penalty-view/', function (req, res) {
  console.log("here" + currentUser.ticked);
  res.render('challenge/penalty-view', {
    name : currentUser.firstName + " " + currentUser.lastName,
    ticked : currentUser.ticked,
    cat : dynamicContent.description,
    checkdate : checkDate,
    challengeDate : challengeDate,
      plan : payer.plan,
      followup : payer.followup
  });
});

// Did you have...
router.get(/did-you-have/, function (req, res) {
  res.render('challenge/did-you-have', {
    title : dynamicContent.title,
    description : dynamicContent.description,
    cat : currentUser.ticked,
    checkdate : checkDate
  });
});

router.get(/did-you-handler/, function (req, res) {
  if (req.query.exemption == 'no') {
    currentUser.removeCat();
    currentUser.showCats();
    res.redirect('bsa-exemptions');
  } else {
    if (currentUser.esaH == true || currentUser.jsaK == true || currentUser.pcS == true) {
      res.redirect('bsa-exemptions');
    } else {
      res.redirect('cert-number');
    }
  }
});

// Ask for a cert number
router.get(/cert-number/, function (req, res) {
  res.render('challenge/cert-number', {
    title : dynamicContent.title
  });
});

// check cert number (yes, really!)
router.get(/cert-handler/, function (req, res) {
  if (req.query.cert != "") {
    res.redirect('out-of-date');
  } else {
    res.redirect('found');
  }
});

// ask the user which details are wrong
router.get(/mistake/, function (req, res) {
  res.render('challenge/mistake', {
    name : currentUser.firstName + " " + currentUser.lastName,
    address : currentUser.fullAddress
  });
});

// display the bsa exemptions
router.get(/bsa-exemptions/, function (req, res) {
  res.render('challenge/bsa-exemptions', {
    ticked : currentUser.ticked,
    checkdate : checkDate
  });
});

// we cant find your certificate
router.get(/out-of-date/, function (req, res) {
  res.render('challenge/out-of-date', {
    title : dynamicContent.title,
    checkdate : checkDate
  });
});

router.get(/bsa-handler/, function (req, res) {
  var next = 'cert-number';
  var topCat;
  var bsa = req.query.bsa;
  if (bsa != "no") {
    if (bsa == 'mat') {
      currentUser.matD = true;
      topCat = "D";
    } else if (bsa == 'med') {
      currentUser.medE = true;
      topCat = "E";
    } else if (bsa == 'ppc') {
      currentUser.ppcF = true;
      topCat = "F";
    } else if (bsa == 'hc2') {
      currentUser.hc2L = true;
      topCat = "L";
    } else if (bsa == 'tc') {
      currentUser.tcM = true;
      topCat = "M";
    }
    dynamicContent.updateContent(topCat);
  } else {
    if (currentUser.esaH === true || currentUser.jsaK === true || currentUser.pcS === true) {
      next = 'proof-of-benefit';
    } else {
      next = 'dwp-exemptions';
    }
  }
  res.redirect(next);
});

router.get(/categories-handler/, function (req, res) {
  var bens = req.query.benefits;
  var nextBens = "proof-of-benefit";
  var topCat;
  if (bens != "no") {
    if (bens == "is" || bens == "esa") {
      currentUser.esaH = true;
      topCat = "H";
    } else if (bens == "jsa") {
      currentUser.jsaK = true;
      topCat = "K";
    } else if (bens == "pc") {
      currentUser.pcS = true;
      topCat = "S";
    }
    nextBens = 'proof-of-benefit';
    dynamicContent.updateContent(topCat);
  } else {
    nextBens = "cant-find";
  }
  if (currentUser.ticked == "D") {
    nextBens = 'pregnant';
  } else if (currentUser.ticked == "E") {
    nextBens = 'medical';
  }
  res.redirect(nextBens);
});

router.get(/pregnancy-handler/, function (req, res) {
  if (req.query.pregnant == 'yes') {
    if(currentUser.esaH === true || currentUser.jsaK === true || currentUser.pcS === true) {
      res.redirect('mat-ben');
    } else {
      res.redirect('matex');
    }
  } else {
    if(currentUser.esaH === true || currentUser.jsaK === true || currentUser.pcS === true) {
//      dynamicContent.updateContent(currentUser.ticked);
      res.redirect('proof-of-benefit');
    } else {
      res.redirect('cant-find');
    }
  }
});

router.get(/medical-handler/, function (req, res) {
  if (req.query.medical == 'yes') {
    res.redirect('illnesses');
  } else {
    if(currentUser.esaH === true || currentUser.jsaK === true || currentUser.pcS === true) {
      res.redirect('proof-of-benefit');
    } else {
      res.redirect('cant-find');
    }  
  }
});

router.get(/illnesses-handler/, function (req, res) {
  if (req.query.medical == 'yes') {
    if(currentUser.esaH === true || currentUser.jsaK === true || currentUser.pcS === true) {
      res.redirect('med-ben');
    } else {
      res.redirect('medex');
    }
  } else {
    if(currentUser.esaH === true || currentUser.jsaK === true || currentUser.pcS === true) {
      res.redirect('proof-of-benefit');
    } else {
      res.redirect('cant-find');
    }
  }
});

router.get(/details-handler/, function (req, res) {
  if (req.query.details == 'no') {
    res.redirect('mistake');
  } else {
    if (currentUser.matD === true) {
      res.redirect('pregnant');
    } else if (currentUser.medE === true) {
      res.redirect('medical');
    } else if (currentUser.esaH === true || currentUser.jsaK === true || currentUser.pcS === true) {
      res.redirect('proof-of-benefit');
    } else {
      res.redirect('cant-find');
    }
  }
});

router.get(/benefits-handler/, function (req, res) {
  if (req.query.details == 'yes') {
    res.redirect('proof-of-benefit');
  } else {
    res.redirect('mistake');
  }
});

// display the users's personal details
router.get(/personal-details/, function (req, res) {
  res.render('challenge/personal-details', {
    name : currentUser.firstName + " " + currentUser.lastName,
    ref : currentUser.pcn,
    title : dynamicContent.title,
    address : currentUser.fullAddress,
    checkdate : checkDate
  });
});

// display personal details for those on benefits
router.get(/personal-benefits/, function (req, res) {
  res.render('challenge/personal-benefits', {
    name : currentUser.firstName + " " + currentUser.lastName,
    ref : currentUser.pcn,
    title : dynamicContent.title
  });
});

// display the users's personal details
router.get(/your-details/, function (req, res) {
  res.render('challenge/your-details', {
    name : currentUser.firstName + " " + currentUser.lastName
  });
});

// Where we find their details
router.get(/found/, function (req, res) {
  res.render('challenge/found', {
    ref : currentUser.pcn,
    title : dynamicContent.title
  });
});

// Where a user updates their address
router.get(/address-handler/, function (req, res) {
  if (currentUser.cat == "H" || currentUser.cat == "I" || currentUser.cat == "K" || currentUser.cat == "S") {
    res.redirect('challenge/proof-of-benefit');
  } else {
    res.redirect('challenge/found');
  }
});

router.get('/challenge/address/', function (req, res) {
  res.render('challenge/address', {
    ref : currentUser.pcn,
    title : dynamicContent.title,
  });
});

// Where the user can prove benefit entitlement or get a certificate
router.get(/med-ben/, function (req, res) {
  res.render('challenge/med-ben', {
    benefit : dynamicContent.title
  });
});

// Where the user can prove benefit entitlement or get a certificate
router.get(/mat-ben/, function (req, res) {
  res.render('challenge/mat-ben', {
    benefit : dynamicContent.title
  });
});

// Where the user can prove benefit entitlement or get a certificate
router.get(/proof-of-benefit/, function (req, res) {
//  dynamicContent.updateContent(currentUser.ticked);
  res.render('challenge/proof-of-benefit', {
    benefit : dynamicContent.title,
    certificate : dynamicContent.title
  });
});

// show the DWP categories
router.get(/dwp-exemptions/, function (req, res) {
  res.render('challenge/dwp-exemptions', {
    ticked : currentUser.ticked,
    checkdate : checkDate
  });
});

// update address
router.get(/update-handler/, function (req, res) {
  currentUser.addressLineOne = req.query.lineone;
  currentUser.addressLineTwo = req.query.linetwo;
  currentUser.addressTown = req.query.town;
  currentUser.addressPostCode = req.query.postcode;
  currentUser.updateAddress();
  res.redirect('change');
});

// show the DWP categories
router.get(/change/, function (req, res) {
  res.render('challenge/change', {
    address : currentUser.fullAddress,
    name : currentUser.firstName + " " + currentUser.lastName
  });
});


router.get(/pregnant/, function (req, res) {
  res.render('challenge/pregnant', {
    checkdate : checkDate
  });
});

router.get(/matex/, function (req, res) {
  res.render('challenge/matex', {
    checkdate : checkDate
  });
});

router.get(/medex/, function (req, res) {
  res.render('challenge/medex', {
    checkdate : checkDate
  });
});

router.get('/challenge/home', function (req, res) {
  res.render('challenge/home', {
    checkdate : checkDate,
    title : dynamicContent.title
  });
});

router.get('/challenge/name', function (req, res) {
  res.render('challenge/name', {
    checkdate : checkDate,
    title : dynamicContent.title,
    name : currentUser.firstName + " " + currentUser.lastName
  });
});

router.get(/name-handler/, function (req, res) {
  res.redirect('/challenge/dob');
});

router.get('/challenge/dob', function (req, res) {
  res.render('challenge/dob', {
    checkdate : checkDate,
    title : dynamicContent.title
  });
});

router.get(/dob-handler/, function (req, res) {
  res.redirect('/challenge/home');
});

router.get(/home-handler/, function (req, res) {
  if (req.query.details == 'no') {
    res.redirect('/challenge/address');
  } else {
    if (currentUser.matD === true) {
      res.redirect('pregnant');
    } else if (currentUser.medE === true) {
      res.redirect('medical');
    } else if (currentUser.esaH === true || currentUser.jsaK === true || currentUser.pcS === true) {
      res.redirect('proof-of-benefit');
    } else {
      res.redirect('cant-find');
    }
  }
});