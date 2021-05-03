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
var template = '';
const fetch = () => {
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("saved")) {

            localData = JSON.parse(localStorage.getItem(localStorage.key(i)))
            template += `<tr>`
            template += `  <th class="fav-th" scope="col"> <img class="favicon" src="${localData.favIconUrl}" alt=""></th>`
            template += `<td> <a target="_blank" href=${localData.url}>${localData.title}</a> </td>`
            template += `<td><button data-key="saved-${localData.url}" class="btn delete"> <img src="x-circle-fill.svg"></button></td>`
            template += `</tr>`

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
        var data = ({
            url,
            title,
            favIconUrl
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


chrome.tabs.query({}, (data) => {
    console.log(data)
})