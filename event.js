var menuItem = {
    "id": "Linkmark",
    "title": "Linkmark - save link",
    "contexts": ["link"]
};

chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function (clickData) {
    let data = ({
        url: clickData.linkUrl,
        group: localStorage.getItem('selected'),
        title: clickData.linkUrl,
        favIconUrl: `https://s2.googleusercontent.com/s2/favicons?domain_url=${clickData.linkUrl}` || 'icon.png'

    })
    localStorage.setItem(`saved-${clickData.linkUrl}`, JSON.stringify(data))
    var notifOptions = {
        type: "basic",
        iconUrl: "icon-128.png",
        title: `Link Saved! ${new Date()}`,
        message: `The ${clickData.linkUrl} has been save to ${localStorage.getItem('selected')}`,
        priority:2
    };
    chrome.notifications.create('AddedNotify', notifOptions);
});