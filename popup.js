const URL = "https://portal.ustraveldocs.com/";

window.onload = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  document.getElementById("discord_url").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://discord.gg/cWSeQ5tPu6" });
  });

  document.getElementById("share_url").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://joellui.webflow.io/work/usa-visa-notification" });
  });

  pageCheck = document.getElementById("pageCheck");

  if (tab.url.match(URL+"*")) {
    pageCheck.innerHTML = "&#x1F7E2";
    pageCheck.title = "Correct Page";
    pageCheck.style.fontSize = "15px";
    pageCheck.style.color = "green";
    pageCheck.style.float = "right";

    // get the data to local storage
    chrome.storage.local.get(
      [
        "visaType",
        "appointmentType",
        "location_OFC",
        "location_consular",
        "date_OFC",
        "date_consular",
        "date_other",
      ],
      (result) => {
        if (result.visaType !== undefined) {
        document.getElementById("visaType").innerHTML = result.visaType;
        }
        if (
          result.appointmentType !== undefined &&
          result.location_OFC !== undefined && 
          result.appointmentType == "OFC"
        ) {
          if (result.date_OFC !== null ) {
            c = result.date_OFC.length;

            let dispList = [];

            for (let i = 0; i < c; i++) {
              var month = result.date_OFC[i].month;
              var year = result.date_OFC[i].year;

              dispList.push(month + " " + year);
            }

            document.getElementById("visaOFCPlaceDate").innerHTML =
              result.location_OFC + " " + dispList;
          } else {
            document.getElementById("visaOFCPlaceDate").innerHTML =
              result.location_OFC+ "--" + " NO DATE AVAILABLE";
          }
        }

        if (
          result.appointmentType !== undefined &&
          result.location_consular !== undefined &&
          result.appointmentType == "CONSULAR"
        ) {
          if (result.date_consular !== null) {
            c = result.date_consular.length;

            let dispList = [];

            for (let i = 0; i < c; i++) {
              var month = result.date_consular[i].month;
              var year = result.date_consular[i].year;

              dispList.push(month + " " + year);
            }

            document.getElementById("visaConsulatePlaceDate").innerHTML =
              result.location_consular + " " + dispList;
          } else {
            document.getElementById("visaConsulatePlaceDate").innerHTML =
              result.location_consular + "--" + " NO DATE AVAILABLE";
          }
        }
      }
    );
  } else {
    pageCheck.style.fontSize = "15px";
    pageCheck.innerHTML = "&#x1F534;";
    pageCheck.title = "Wrong Page";
    pageCheck.style.color = "red";
    pageCheck.style.float = "right";
    pageCheck.onclick = () => {
      chrome.tabs.create({ url: URL });
    };
  }
};
