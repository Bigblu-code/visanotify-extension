chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const URL =
    "https://portal.ustraveldocs.com/*";

    const webhookURL_Test             = ""
    const webhookURL_F1_OFC           = ""
    const webhookURL_F1_Consular      = ""
    const webhookURL_other_OFC        = ""
    const webhookURL_other_Consular   = ""


    // const webhookURL_Test = "";
    
    if (changeInfo.status === "complete" && tab.url.match(URL)) {
        
        chrome.tabs.sendMessage(tabId,{ statusComplete: true }, (response) => {
            
            request = response.statusComplete;

            // set the data to local storage
        chrome.storage.local.set({ visaType: request.visaType });

        // set data to local for OFC
        chrome.storage.local.set({ appointmentType_OFC: request.appointmentType_OFC });
        chrome.storage.local.set({ location_OFC: request.location_OFC });
        chrome.storage.local.set({ date_OFC: request.date_OFC });

        // set data to local for consular
        chrome.storage.local.set({ appointmentType_consular: request.appointmentType_consular });
        chrome.storage.local.set({ location_consular: request.location_consular });
        chrome.storage.local.set({ date_consular: request.date_consular }); 

        // set data to local for other
        chrome.storage.local.set({ appointmentType_other: request.appointmentType_other });
        chrome.storage.local.set({ location_other: request.location_other });
        chrome.storage.local.set({ date_other: request.date_other });

        console.log(request);

        // get visa type from local storage
        chrome.storage.local.get("visaType").then((result) => {
            
            // if visa type is availabel
            if(result.visaType === 'F-1'){
                
                // send message for OFC
                if(request.appointmentType_OFC === "Schedule OFC Appointment" && request.location_OFC){

                  // const webhookURL_F1_OFC           = ""

                    var message = messageContent(result.visaType, request.appointmentType_OFC, request.location_OFC, request.date_OFC)
                    // send message to discord
                    sendMessageToDiscord(message, webhookURL_F1_OFC);
                }else if(request.appointmentType_consular === "Schedule Consular Appointment" && request.location_consular ){

                  // const webhookURL_F1_Consular      = ""

                    var message = messageContent(result.visaType, request.appointmentType_consular, request.location_consular, request.date_consular)
                    // send message to discord
                    sendMessageToDiscord(message, webhookURL_F1_Consular);
                }else{
                    var message = messageContent(result.visaType, request.appointmentType_other, request.location_other, request.date_other)
                    // send message to discord
                    sendMessageToDiscord(message, webhookURL_Test);
                }
                
            }else{

              // send message for OFC
              if(request.appointmentType_OFC === "Schedule OFC Appointment" && request.location_OFC){

                // webhookURL_other_OFC = ""

                  var message = messageContent(result.visaType, request.appointmentType_OFC, request.location_OFC, request.date_OFC)
                  // send message to discord
                  sendMessageToDiscord(message, webhookURL_other_OFC);
              }else if(request.appointmentType_consular === "Schedule Consular Appointment" && request.location_consular ){

                // webhookURL_other_Consular = ""

                  var message = messageContent(result.visaType, request.appointmentType_consular, request.location_consular, request.date_consular)
                  // send message to discord
                  sendMessageToDiscord(message, webhookURL_other_Consular);
              }else{
                  var message = messageContent(result.visaType, request.appointmentType_other, request.location_other, request.date_other)
                  // send message to discord
                  sendMessageToDiscord(message, webhookURL_Test);
              }

            }

        });
        });
    }
})

// function to return message for discord
messageContent = (visaType, appointmentType, location, date) => {
    let dateString = "";
    
    if(date){

        date.forEach(element => {
            dateString += `${element.month} ${element.year} \nDate: ${ element.dates !== "" || element.dates !== null ? element.dates.join(", "): " X " } \n\n`
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
                "value": visaType? visaType : "Not Available",
                "inline": true
              },
              {
                "name": "Appointment Type",
                "value": appointmentType? appointmentType : "Not Available",
                "inline": true
              },
              {
                "name": "Location",
                "value": location? location : "No Location Available",
                "inline": false
              },
              {
                "name": "Dates",
                "value": dateString !== "" ? "```"+dateString+"```" : "``` "+"No Dates Available"+"```",
                "inline": false
              }
            ],
            "footer": {
              "text": "US Visa Slot Notify | "
            }
          }
        ],
        content: dateString !== "" ? " @F1 | Slots Found " : ""
      }

      return message;
}

// Function to send message to discord
sendMessageToDiscord  = async (message, webhookURL)=> {
    
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
chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({ url: "https://discord.gg/cWSeQ5tPu6" });
  }
);