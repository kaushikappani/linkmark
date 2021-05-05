chrome.tabs.query({
    currentWindow: true,
    active: true
}, function (tabs) {
    console.log(tabs);
    const tabUrl = document.getElementById('url')
    if (tabUrl) {
        tabUrl.innerHTML = tabs[0].title
        tabUrl.href = tabs[0].url
        tabUrl.data = tabs[0].title
        if (tabs[0].favIconUrl) {
            document.querySelector('.current_favicon').src = tabs[0].favIconUrl
        }
    }
});

//display saved items

const fetch = () => {
    var template = '';
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("saved")) {

            localData = JSON.parse(localStorage.getItem(localStorage.key(i)));
            if (localData.group == localStorage.getItem("selected")) {

                template += `<tr>`
                template += `  <th class="fav-th" scope="col"> <img class="favicon" src="${localData.favIconUrl}" alt=""></th>`
                template += `<td style="max-width:350px;overflow:hidden"> <a target="_blank" href=${localData.url}>${localData.title}</a> </td>`
                template += `<td><button data-key="saved-${localData.url}" class="btn delete"> <img src="x-circle-fill.svg"></button></td>`
                template += `</tr>`
            }
        }
    };
    document.querySelector('.saved-data').innerHTML = template
}

//save current url
const saveBtn = document.getElementById('saveBtn');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const url = document.getElementById('url').href;
        const title = document.getElementById('url').innerHTML
        const favIconUrl = document.querySelector('.current_favicon').src
        const group = localStorage.getItem('selected') || "General";
        var data = ({
            url,
            title,
            favIconUrl,
            group
        })
        localStorage.setItem(`saved-${url}`, JSON.stringify(data))
        location.reload();
    })
}

if (document.querySelector('.saved-data')) {
    fetch();
}


//delete 
let buttons = document.querySelectorAll('.delete');

if (buttons) {
    function removeThis(element) {
        var dataKey = element.getAttribute('data-key');
        localStorage.removeItem(dataKey);
        location.reload();

    }
    for (let i = 0, len = buttons.length; i < len; i++) {
        buttons[i].addEventListener('click', function (event) {
            removeThis(this);
            console.log(this)
        })
    }
};

if (!localStorage.getItem('selected')) {
    localStorage.setItem('selected', 'General');
}

//group select
const btnGrp = document.querySelectorAll(".btn-group");
if (btnGrp) {
    for (let i = 0; i < btnGrp.length; i++) {
        btnGrp[i].addEventListener('click', () => {
            localStorage.setItem('selected', btnGrp[i].getAttribute('data-key'));
            document.querySelector('.save-to').innerHTML = `Save to ${localStorage.getItem('selected')}`
            changeClass();
            fetch();
            location.reload();
        })
    }
}

let changeClass = () => {
    if (document.querySelector('.save-to')) {
        document.querySelector('.save-to').innerHTML = `Save to ${localStorage.getItem('selected')}`
    }
    let item = localStorage.getItem('selected');
    for (let i = 0; i < btnGrp.length; i++) {
        if (btnGrp[i].getAttribute('data-key') == item) {
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
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("saved")) {
            data = JSON.parse(localStorage.getItem(localStorage.key(i)));
            if (data.group == 'General') {
                generalCount++;
            } if (data.group == 'Work') {
                workCount++
            } else {
                continue
            }
        }
    }
    if (document.querySelector('.badge-general')) {
    document.querySelector('.badge-general').innerHTML = generalCount;
    document.querySelector('.badge-work').innerHTML = workCount
    }
}
BadgeNumber();
