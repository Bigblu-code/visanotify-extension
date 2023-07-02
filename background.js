chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const URL =
    "https://portal.ustraveldocs.com/*";


  const webhookURL_F1_Consular = ""
  const webhookURL_F1_OFC = ""

  const webhookURL_other_OFC = ""
  const webhookURL_other_Consular = ""

  const webhookURL_B1_OFC = ""
  const webhookURL_B1_Consular = ""
  const webhookURL_B2_OFC = ""
  const webhookURL_B2_Consular = ""

  const webhookURL_errorLog = ""


  if (changeInfo.status === "complete" && tab.url.match(URL)) {

    chrome.tabs.sendMessage(tabId, { statusComplete: true }, (response) => {

      request = response.statusComplete;

      // set the data to local storage
      chrome.storage.local.set({ visaType: request.visaType });
      chrome.storage.local.set({ appointmentType: request.appointmentType });

      // set data to local for OFC
      chrome.storage.local.set({ location_OFC: request.location_OFC });
      chrome.storage.local.set({ date_OFC: request.date_OFC });

      // set data to local for consular
      chrome.storage.local.set({ location_consular: request.location_consular });
      chrome.storage.local.set({ date_consular: request.date_consular });

      // set data to local for other
      chrome.storage.local.set({ visaType_other: request.visaType_other })
      chrome.storage.local.set({ error: request.error })

      chrome.storage.local.set({ currentURL: request.currentURL })

      console.info("Getting Request: ")
      console.log(request);

      // get visa type from local storage
      chrome.storage.local.get().then((result) => {

        // VISA TYPE ==> F-1
        if (result.visaType === 'F-1') {

          // send message for OFC
          if (request.appointmentType === "OFC" && request.location_OFC) {

            var message = messageContent(result.visaType, request.appointmentType, request.location_OFC, request.date_OFC)
            sendMessageToDiscord(message, webhookURL_F1_OFC);
          } else if (request.appointmentType === "CONSULAR" && request.location_consular) {

            var message = messageContent(result.visaType, request.appointmentType, request.location_consular, request.date_consular)
            sendMessageToDiscord(message, webhookURL_F1_Consular);
          } else {
            if (result.currentURL.indexOf("/scheduleappointment") > -1) {
              sendMessageToDiscord({ "content": "Appointment Type Not Identified == " + result.currentURL }, webhookURL_errorLog);
            }
          }

        }
        // VISA TYPE ==> NULL
        else if (result.visaType == null) {


          if (request.appointmentType === "OFC" && request.location_OFC) {
            var message = errorMesssageContent(result.visaType, request.appointmentType, request.location_OFC, request.date_OFC, " Visa Type Not found ", result.currentURL)
          } else if (request.appointmentType === "CONSULAR" && request.location_consular) {
            var message = errorMesssageContent(result.visaType, request.appointmentType, request.location_consular, request.date_consular, " Visa Type Not found ", result.currentURL)
          } else {
            if (result.location_OFC != null && result.location_consular != null) {
              sendMessageToDiscord({ "content": "Appointment Type Not Identified == " + result.currentURL }, webhookURL_errorLog);
            }
          }

          // send ERROR message to discord
          sendMessageToDiscord(message, webhookURL_errorLog);

        }
        // VISA TYPE ==> OTHER
        else {

          // send message for OFC
          if (request.appointmentType === "OFC" && request.location_OFC) {

            var message = messageContent(result.visaType, request.appointmentType, request.location_OFC, request.date_OFC)
            sendMessageToDiscord(message, webhookURL_other_OFC);

          } else if (request.appointmentType === "CONSULAR" && request.location_consular) {

            var message = messageContent(result.visaType, request.appointmentType, request.location_consular, request.date_consular)
            sendMessageToDiscord(message, webhookURL_other_Consular);

          } else {

            if (result.currentURL.indexOf("/scheduleappointment") > -1) {
              sendMessageToDiscord({ "content": "- Appointment Type Not Identified ==" + result.currentURL }, webhookURL_errorLog);

            }
          }

        }

      });
    });
  }
})

// Format Message
messageContent = (visaType, appointmentType, location, date) => {
  let dateString = "";

  if (date) {

    date.forEach(element => {
      dateString += `${element.month} ${element.year} \nDate: ${element.dates !== "" || element.dates !== null || element.dates ? element.dates.join(", ") : " X "} \n\n`
    })
  }

  const currentDate = new Date().toISOString();

  var message = {
    "embeds": [
      {
        "title": "Appointment Details",
        "description": "Here are the details for your appointment:",
        "color": dateString !== "" ? 3066993 : 15158332,
        "timestamp": currentDate,
        "fields": [
          {
            "name": "Visa Type",
            "value": visaType ? visaType : "Not Available",
            "inline": true
          },
          {
            "name": "Appointment Type",
            "value": appointmentType ? appointmentType : "Not Available",
            "inline": true
          },
          {
            "name": "Location",
            "value": location ? location : "No Location Available",
            "inline": false
          },
          {
            "name": "Dates",
            "value": dateString !== "" ? "```" + dateString + "```" : "``` " + "No Dates Available" + "```",
            "inline": false
          }
        ],
        "footer": {
          "text": "US Visa Slot Notify | "
        }
      }
    ],
    content: dateString !== "" ? ` @${visaType} | Slots Found ` : ""
  }

  return message;
}

// Format Error message
errorMesssageContent = (visaType, appointmentType, location, date, errorMessage, url) => {

  let dateString = "";

  if (date) {

    date.forEach(element => {
      dateString += `${element.month} ${element.year} \nDate: ${element.dates !== "" || element.dates !== null || element.dates ? element.dates.join(", ") : " X "} \n\n`
    })
  }

  const currentDate = new Date().toISOString();

  var message = {
    "embeds": [
      {
        "title": "Error",
        "description": "Here are the details for your appointment:",
        "color": 15152933,
        "timestamp": currentDate,
        "fields": [
          {
            "name": "Visa Type",
            "value": visaType ? visaType : "Not Available",
            "inline": true
          },
          {
            "name": "Appointment Type",
            "value": appointmentType ? appointmentType : "Not Available",
            "inline": true
          },
          {
            "name": "Location",
            "value": location ? location : "No Location Available",
            "inline": false
          },
          {
            "name": "Dates",
            "value": dateString !== "" ? "```" + dateString + "```" : "``` " + "No Dates Available" + "```",
            "inline": false
          },
          {
            "name": "URL",
            "value": url,
            "inline": false
          },
          {
            "name": "Error Message",
            "value": errorMessage,
            "inline": false
          }

        ],
        "footer": {
          "text": "US Visa Slot Notify | "
        }
      }
    ],
    content: dateString !== "" ? ` @${visaType} | Slots Found ` : ""
  }

  return message

}


// Send message to Discord Webhooks
sendMessageToDiscord = async (message, webhookURL) => {

  await fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  })
    .then(console.log("Success:"))
    .catch(error => console.error("Error:", error));
}


// clear the local storage on closing the tab
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.local.clear();
});


// open discord link when extension installed
chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.create({ url: "https://discord.gg/cWSeQ5tPu6" });
}
);