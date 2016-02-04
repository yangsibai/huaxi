'use strict';
var baseUrl = 'http://www.cd120.com/';

function resolve(s) {
    var re = /events: (.*)/ig;
    var matches = re.exec(s);
    if (matches && matches.length > 1) {
        return eval(matches[1]);
    } else {
        store.log({
            type: 'warn',
            message: '没有找到 events 信息'
        });
    }
}

function canMakeAnAppointment(event) {
    return event.title.indexOf('点击预约') !== -1;
}

var notifications = {};

chrome.notifications.onClicked.addListener(function (notificationId) {
    var event = notifications[notificationId];
    window.open(baseUrl + event.url);
    chrome.notifications.clear(notificationId);
});

function notify(event, doctor) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '/icons/48.png',
        title: '可以预约「' + doctor.name + '」',
        message: event.start
    }, function (notificationId) {
        notifications[notificationId] = event;
    });
}

function check(doctor) {
    $.get(doctor.url, function (str) {
        var events = resolve(str);
        if (events && events.length > 0) {
            var available = false;
            events.forEach(function (event) {
                if (canMakeAnAppointment(event)) {
                    notify(event, doctor);
                    available = true;
                }
            });
            if (!available) {
                store.log({
                    type: 'warn',
                    message: '没有找到可用的预约时间'
                });
            }
        }
    });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function go() {
    var index = store.count % store.doctors.length;
    var doctor = store.doctors[index];
    var nextTimeout = parseInt(getRandomArbitrary(store.min * 1000, store.max * 1000));
    store.count++;
    store.log({
        type: 'log',
        message: '第 ' + store.count + ' 次检查, 此次检查 ' + doctor.name + ' 下次检查将于 ' + nextTimeout / 1000 + ' 秒后进行'
    });
    check(doctor);
    setTimeout(function () {
        go();
    }, nextTimeout);
}

go();


chrome.browserAction.onClicked.addListener(function (tab) {
    window.open(chrome.extension.getURL('config.html'))
});
