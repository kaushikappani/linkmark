var menuItem = {
    "id": "Linkmark",
    "title": "Linkmark - save link",
    "contexts": ["link"]
};


chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function (clickData) {
    $.ajax({
        url: clickData.linkUrl,
        complete: function (htmlData) {
            var response = htmlData.responseText;
            if (response.match(/<title[^>]*>([^<]+)<\/title>/) == null) {
                var title = clickData.linkUrl
            } else {
                var title = response.match(/<title[^>]*>([^<]+)<\/title>/)[1] || clickData.linkUrl;
            }

            let data = ({
                url: clickData.linkUrl,
                group: localStorage.getItem('selected'),
                title,
                favIconUrl: `https://s2.googleusercontent.com/s2/favicons?domain_url=${clickData.linkUrl}` || 'icon.png'

            })
            localStorage.setItem(`saved-${clickData.linkUrl}`, JSON.stringify(data))
            var notifOptions = {
                type: "basic",
                iconUrl: "icon-128.png",
                title: `Link Saved! ${new Date()}`,
                message: `The ${title} has been save to ${localStorage.getItem('selected')}`,
                priority: 2
            };
            chrome.notifications.create('AddedNotify', notifOptions);
            response = '';
        }

    });

});

const checkIcon = () => {
    let urlList = [];
    let data = JSON.parse(localStorage.getItem("saved"))
    data.map(e => {
        urlList.push(e.url);
    })

    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        for (let i = 0; i < urlList.length; i++) {
            if (urlList[i] === tabs[0].url) {
                return chrome.browserAction.setIcon({
                    path: {
                        19: "heart-fill.svg"
                    }
                });
            } else {
                if (i == urlList.length-1) {
                    chrome.browserAction.setIcon({
                        path: {
                            19: "icon.png"
                        }
                    });
                } else {
                    continue;
                }
            }
        }
    });
}
chrome.tabs.onUpdated.addListener(function () {
    checkIcon();
});

chrome.tabs.onActiveChanged.addListener(function () {
    checkIcon();
});