export function getLocalMonths(local,format){

    let months = [];
    var getMonth = function(idx) {

        var objDate = new Date();
        objDate.setDate(1);
        objDate.setMonth(idx-1);
        var locale = local,
            month = objDate.toLocaleString(locale, { month: format });
          return month;
      };
    
      var i;
      for (i = 1; i < 12; i++) {
        months.push(getMonth(i));
      }

      return months;
}

export function msPerMin(){
  return 60000;
}
export function msPerHr(){
  return 3600000;
}
export function msPerDay(){
  return 86400000;
}
export function msPerWk(){
  return 604800000;
}
export function msPerMo(){
  return 2678400000;
}
export function msPerQ(){
  return 7776000000;
}
export function msPerYr(){
  return 31536000000;
}


export function getTimeSpan(startTime: string,endTime: string){
  
  console.log('getBestTimeDelta', startTime, endTime);

  let date = new Date(startTime).getTime();
  let startDate = new Date(startTime).getDate();
  let endDate = new Date(endTime).getDate();
  let dateString : string = (new Date(startTime)).toLocaleDateString('short');
  let timeString : string = (new Date(startTime)).toLocaleTimeString('short');
  let forString = '- for';
  let deltaString : string = getBestTimeDelta(startTime,endTime);

  return [dateString,timeString,forString,deltaString].join(' ');

}

export function getBestTimeDelta(startTime: string,endTime: string){
  let start = new Date(startTime).getTime();
  let end = new Date(endTime).getTime();
  let delta : number = end - start;

  console.log('getBestTimeDelta', startTime, endTime);

  if (delta/(1000) < 60 ) {
    return delta/(1000) + ' seconds';

  } else if (delta/(msPerMin()) < 60 ) {
    return ((delta/msPerMin())).toFixed(0) + ' minutes';

  } else if (delta/(msPerHr()) < 24 ) {
    return (delta/(msPerHr())).toFixed(0) + ' hours';

  } else if (delta/(msPerDay()) < 7 ) {
    return (delta/(msPerDay())).toFixed(0) + ' days';

  } else if (delta/(msPerDay()) < 30 ) {
    return (delta/(msPerWk())).toFixed(0) + ' weeks';

  } else if (delta/(msPerMo()) < 24 ) {
    return (delta/(msPerMo())).toFixed(0) + ' months';

  } else if (delta/(msPerYr()) < 4 ) {
    return (delta/(msPerYr())).toFixed(0) + ' years';

  } else {
    return 'Infinity and Beyond!';
  }
}

export function getTimeDelta(time1, time2, inWhat){
  let date = new Date(time1).getTime();
  let now = new Date().getTime();
  let age : number = (now - date);
  if (inWhat === 'days') { age =  age/(1000 * 60 * 60 * 24) ; }
  else if (inWhat === 'hours') { age =  age/(1000 * 60 * 60) ; }
  else if (inWhat === 'minutes') { age =  age/(1000 * 60) ; }
  else if (inWhat === 'seconds') { age =  age/(1000) ; }
  else if (inWhat === 'best'){
  }

  return age;

}

export function getAge(time, inWhat){
  let now = new Date().getTime();
  let age = getTimeDelta(time, now, inWhat);

  return age;

}