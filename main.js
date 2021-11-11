const firebaseConfig = {
  apiKey: "AIzaSyDXKLESIO6zdynm4s7LyADme6b4Xh2yuJ8",
  authDomain: "linkmark-9dc9a.firebaseapp.com",
  projectId: "linkmark-9dc9a",
  storageBucket: "linkmark-9dc9a.appspot.com",
  messagingSenderId: "472263149198",
  appId: "1:472263149198:web:b2476d0b6cf3571247ebdf",
  measurementId: "G-5LHR07H4H1",
};

let currentUrl;
chrome.tabs.query(
  {
    currentWindow: true,
    active: true,
  },
  function (tabs) {
    console.log(tabs);
    const tabUrl = document.getElementById("url");
    if (tabUrl) {
      currentUrl = tabs[0].url;
      tabUrl.innerHTML = tabs[0].title;
      tabUrl.href = tabs[0].url;
      tabUrl.data = tabs[0].title;
      if (tabs[0].favIconUrl) {
        document.querySelector(".current_favicon").src = tabs[0].favIconUrl;
      }
    }
  }
);

//display saved items

const fetch = () => {
  var template = "";
      localData = JSON.parse(localStorage.getItem("saved"));
    if(localData){
        localData.map(e => {
          if (e.group == localStorage.getItem("selected")) {
            template += `<tr>`;
            template += `  <th class="fav-th" scope="col"> <img class="favicon" src="${e.favIconUrl}" alt=""></th>`;
            template += `<td style="max-width:350px;overflow:hidden"> <a target="_blank" href=${e.url}>${e.title}</a> </td>`;
            template += `<td><button data-url="${e.url}" data-key=${e.url}" class="btn delete"> <img src="x-circle-fill.svg"></button></td>`;
            template += `</tr>`;
          }
      })
    }
  document.querySelector(".saved-data").innerHTML = template;
};

//save current url
const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    chrome.browserAction.setIcon({
      path: {
        19: "heart-fill.svg",
      },
    });
    const url = document.getElementById("url").href;
    const title = document.getElementById("url").innerHTML;
    const favIconUrl = document.querySelector(".current_favicon").src;
    const group = localStorage.getItem("selected") || "General";
    var data = {
      url,
      title,
      favIconUrl,
      group,
    };
      let prevData = JSON.parse(localStorage.getItem("saved"));
      let exists = false;
      
      if (prevData) {
          for (let i = 0; i < prevData.length; i++){
              if (prevData[i].url === data.url) {
                  exists = true;
                  break;
              }
          }
          if (!exists) {
              localStorage.setItem("saved", JSON.stringify([...prevData,data]));
          }
          
      } else {
          localStorage.setItem("saved", JSON.stringify([data]));
      }
    location.reload();
  });
}

if (document.querySelector(".saved-data")) {
  fetch();
}

//delete
let buttons = document.querySelectorAll(".delete");

if (buttons) {
  async function removeThis (element) {
    var dataKey = element.getAttribute("data-key");
    var dataUrl = element.getAttribute("data-url");
    dataUrl === currentUrl &&
      chrome.browserAction.setIcon({
        path: {
          19: "icon.png",
        },
      });
      let data = await JSON.parse(localStorage.getItem("saved"));
      newData = await data.filter((i) => i.url !== dataUrl);
      console.log("data", data);
      console.log("new data",newData)
      localStorage.setItem("saved", JSON.stringify(newData));
    location.reload();
  }
  for (let i = 0, len = buttons.length; i < len; i++) {
    buttons[i].addEventListener("click", function (event) {
      removeThis(this);
      console.log(this);
    });
  }
}

if (!localStorage.getItem("selected")) {
  localStorage.setItem("selected", "General");
}

//group select
const btnGrp = document.querySelectorAll(".btn-group");
if (btnGrp) {
  for (let i = 0; i < btnGrp.length; i++) {
    btnGrp[i].addEventListener("click", () => {
      localStorage.setItem("selected", btnGrp[i].getAttribute("data-key"));
      document.querySelector(
        ".save-to"
      ).innerHTML = `Save to ${localStorage.getItem("selected")}`;
      changeClass();
      fetch();
      location.reload();
    });
  }
}

let changeClass = () => {
  if (document.querySelector(".save-to")) {
    document.querySelector(
      ".save-to"
    ).innerHTML = `Save to ${localStorage.getItem("selected")}`;
  }
  let item = localStorage.getItem("selected");
  for (let i = 0; i < btnGrp.length; i++) {
    if (btnGrp[i].getAttribute("data-key") == item) {
      btnGrp[i].classList.add("selected");
    } else {
      btnGrp[i].classList.remove("selected");
    }
  }
};

changeClass();

// badge numbers

const BadgeNumber = () => {
  let generalCount = 0;
  let workCount = 0;
    const data = JSON.parse(localStorage.getItem("saved"));
    for (i = 0; i < data.length; i++){
        if (data[i].group === "General") {
            generalCount++;
        } if (data[i].group === "Work") {
            workCount++;
        } else {
            continue;
        }
    }

  if (document.querySelector(".badge-general")) {
    document.querySelector(".badge-general").innerHTML = generalCount;
    document.querySelector(".badge-work").innerHTML = workCount;
  }
};
BadgeNumber();
