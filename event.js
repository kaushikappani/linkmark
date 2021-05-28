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
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("saved")) {
            let localData = JSON.parse(localStorage.getItem(localStorage.key(i)));
            urlList.push(localData.url);

        }
    };

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
                chrome.browserAction.setIcon({
                    path: {
                        19: "icon.png"
                    }
                });
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