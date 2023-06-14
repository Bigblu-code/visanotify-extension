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
    // var visaType = document.getElementsByClassName("stylizedLabel")[5];
    // if (visaType) {
    //   visaType = visaType.textContent;
    // }

    // extract appointment type
    // var appointmentType = document.getElementsByTagName("h3")[1];
    // if(appointmentType){
    // appointmentType = appointmentType.textContent;
    // }

    const visaTypes = ["B1", "B1/B2", "B2", "C1/D", "J-1", "J-2", "F-1", "F-2", "M-1", "M-2", "L-1 (Blanket)", "H-1B", "H-2A", "H-3B", "H-3", "H-4", "L-1 (Individual)", "L-2 (Blanket)", "L-2 (Individual)", "O-1", "O-2", "O-3", "P-1", "P-2", "P-3", "P-4", "Q-1", "R-1", "R-2"];
    visaType = ""
    let found = false;
    let currentURL = window.location.toString().toLowerCase();
    if (currentURL && currentURL.indexOf("/applicanthome") > -1) {
      let text = document.querySelector("#dashboard-table")?.textContent;
      if (text){
        for (const vt of visaTypes) {
          if (text.indexOf(vt) > -1) {
            visaType = vt;
            found = true;
            break;
          }
        }
      }
    }
    if (!found) {
      const visaType = document.getElementsByClassName("stylizedLabel")[5];
      if (visaType) {
        visaType = visaType.textContent;
      }
    }

    
    // extract appointment Type
    appointmentType = ""
    if (currentURL && currentURL.indexOf("/scheduleappointment") > -1) {
      console.log(currentURL)
      let dashboard = document.getElementById("dashboard");
      appointmentType = dashboard?.textContent?.indexOf("Consular") > -1 ? "CONSULAR" :  dashboard?.textContent?.indexOf("OFC") > -1 ? "OFC" : document.getElementsByTagName("h3")[1];
    }

    // extract city Mumbai, Delhi, Kolkata, Hydrabad
    var city = document.getElementsByTagName("select")[0];
    if (city) {
      city = city.options[city.selectedIndex].textContent;
    }

    // extract date
    var datePicker = document.getElementById("datepicker");
    if (datePicker) {
      datePicker = dates(datePicker);
    }

    // send message to background.js
    if (visaType) {
      message = {
        visaType: visaType,
      };
    } else if (appointmentType === "OFC") {
      message = {
        appointmentType_OFC: appointmentType,
        location_OFC: city,
        date_OFC: datePicker,
      };
    } else if (appointmentType === "CONSULAR") {
      message = {
        appointmentType_consular: appointmentType,
        location_consular: city,
        date_consular: datePicker,
      };
    } else {
      message = {
        appointmentType_other: appointmentType,
        location_other: city,
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
