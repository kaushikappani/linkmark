chrome.tabs.query({
    currentWindow: true,
    active: true
}, function (tabs) {
    console.log(tabs[0].url);
    const tabUrl = document.getElementById('url')
    if (tabUrl) {
        tabUrl.innerHTML = tabs[0].title
        tabUrl.href = tabs[0].url
        tabUrl.data = tabs[0].title
    }
});
var template = '';
const fetch = () => {
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("saved")) {
            localData = JSON.parse(localStorage.getItem(localStorage.key(i)))
            template += `<tr>`
            template += `<td> <a target="_blank" href=${localData.url}>${localData.title}</a> </td>`
            template += `<td><button class="btn"> <img src="x-circle-fill.svg"></button></td>`
            template += `</tr>`

        }
    };
    document.querySelector('.saved-data').innerHTML = template
}


const saveBtn = document.getElementById('saveBtn');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const url = document.getElementById('url').href;
        const title = document.getElementById('url').innerHTML
        var data = ({
            url,
            title
        })
        localStorage.setItem(`saved-${url}`, JSON.stringify(data))
        location.reload();
    })
}





if (document.querySelector('.saved-data')) {
    fetch();
}