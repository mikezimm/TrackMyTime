export function getLocalMonths(local,format){

    let months = [];
    var getMonth = function(idx) {

        var objDate = new Date();
        objDate.setDate(1);
        objDate.setMonth(idx-1);
        var locale = local,
            month = objDate.toLocaleString(locale, { month: format });
          return month;
      }
    
      var i;
      for (i = 1; i < 12; i++) {
        months.push(getMonth(i));
      }

      return months;
}