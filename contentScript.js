window.onload = () => {
  // get the datepicker element
  dates = (datePicker) => {
    if (datePicker) {
      var listofDates = [];
      var e = document.getElementsByClassName("ui-datepicker-group");
      var c = document.getElementsByClassName("ui-datepicker-group").length;
      var m = document.getElementsByClassName("ui-datepicker-month");
      var y = document.getElementsByClassName("ui-datepicker-year");

      // cycle through months
      for (let i = 0; i < c; i++) {
        // extracting date from anchor tag
        let date = e[i].querySelectorAll("td>a");
        let dateList = [];
        for (let j = 0; j < date.length; j++) {
          dateList.push(date[j].textContent);
        }

        var month = m[i].textContent;
        var year = y[i].textContent;
        let dates = { month: month, year: year, dates: dateList };

        // add the date to the list of dates
        listofDates.push(dates);
      }

      return listofDates;
    }
    return null;
  };

  scrapContent = () => {
    // extraction visa type
    var visaType = document.getElementsByClassName("stylizedLabel")[5];
    if(visaType){
    visaType = visaType.textContent;
    }

    // extract appointment type
    var appointmentType = document.getElementsByTagName("h3")[1];
    if(appointmentType){
    appointmentType = appointmentType.textContent;
    }

    // extract OFC_city Mumbai, Delhi, Kolkata, Hydrabad
    var OFC_city = document.getElementsByTagName("select")[0];
    if(OFC_city){
    OFC_city = OFC_city.options[OFC_city.selectedIndex].textContent;
  }

    // extract date
    var datePicker = document.getElementById("datepicker");
    if(datePicker){

    datePicker = dates(datePicker);
  }

    // send message to background.js
    if (visaType) {
      message = {
        visaType: visaType,
      };
    }else if (appointmentType === "Schedule OFC Appointment") {
      message = {
        appointmentType_OFC: appointmentType,
        location_OFC: OFC_city,
        date_OFC: datePicker,
      };
    } else if ( appointmentType === "Schedule Consular Appointment") {
      message = {
        appointmentType_consular: appointmentType,
        location_consular: OFC_city,
        date_consular: datePicker,
      };
    } else {
      message = {
        appointmentType_other: appointmentType,
        location_other: OFC_city,
        date_other: datePicker,
      };
    }

    // send message to background.js
    return message;
  };

  // listen for message from background.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.statusComplete) {
      console.log("status complete");

      sendResponse({ statusComplete: scrapContent()});
    }
  });
};
