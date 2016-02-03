'use strict';
var baseUrl = 'http://www.cd120.com/';
var doctors = [
    {
        name: '段荫乔',
        url: 'http://www.cd120.com/doctorByCode.jspx?doctorCode=0086&clinnicId=246'
    },
    {
        name: '贺建清',
        url: 'http://www.cd120.com/doctorByCode.jspx?doctorCode=11021&clinnicId=246'
    }
];

function resolve(s) {
    var re = /events: (.*)/ig;
    var matches = re.exec(s);
    if (matches && matches.length > 1) {
        return eval(matches[1]);
    } else {
        console.warn('没有找到 events 信息');
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
                console.warn('没有找到可用的预约时间');
            }
        }
    });
}

var count = 0;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function go() {
    var index = count % doctors.length;
    var doctor = doctors[index];
    var nextTimeout = parseInt(getRandomArbitrary(1000 * 20, 1000 * 60 * 3));
    count++;
    console.log('第 ' + count + ' 次检查, 此次检查 ' + doctor.name, new Date(), ' 下次检查将于 ' + nextTimeout / 1000 + ' 秒后进行');
    check(doctor);
    setTimeout(function () {
        go();
    }, nextTimeout);
}

go();


chrome.browserAction.onClicked.addListener(function (tab) {
    window.open(chrome.extension.getURL('config.html'))
});
