var content = {
  description : 'Box "D" (has a valid maternity exemption certificate)',
  title : 'NHS maternity exemption certificate',
  updateContent : function (cat) {
    switch(cat) {
      case "D":
        this.title = 'NHS maternity Exemption Certificate';
        this.description = 'Box "D" (has a valid maternity exemption certificate)';
        break;
      case "E":
        this.title = 'NHS Medical Exemption Certificate';
        this.description = 'Box "E" (has a valid medical exemption certificate)';
        break;
      case "F":
        this.title = 'Prescription Prepayment Certificate';
        this.description = 'Box "L" (has a valid Prescription Prepayment certificate)';
        break;
      case "L":
        this.title = 'Help with health costs (HC2) Certificate';
        this.description = 'Box "L" (has a valid prescription prepayment certificate)';
        break;
      case "M":
        this.title = 'Tax Credit Certificate';
        this.description = 'Box "M" (is entitled to, or named on, a valid NHS Tax Credit Exemption certificate)';
        break;
      case "H":
        this.title = 'Income support or income-related employment and support allowance';
        this.description = 'Box "H" (gets Income Support or income-related Employment and Support Allowance)';
        break;
      case "I":
        this.title = 'Income related employment support allowance';
        this.description = 'Box "H" (gets Income Support or income-related Employment and Support Allowance)';
        break;
      case "K":
        this.title = 'Income based jobseekers allowance';
        this.description = 'Box "K" (gets income-based Job seekers Allowance)';
        break;
      case "S":
        this.title = "Your partner's Pension Credit guarantee credit award";
        this.description = 'Box "S" (has a partner who gets Pension Credit guarantee credit (PCGC)';
        break;
      default:
        this.title = "none";
        this.description = "none";
    }
  }
};

module.exports.content = content;