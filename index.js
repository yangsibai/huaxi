'use strict';
var re2 = /events: (.*)/ig;
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
    var matches = re2.exec(s);
    if (matches.length > 1) {
        return eval(matches[1]);
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

function go() {
    count++;
    var index = count % doctors.length;
    var doctor = doctors[index];
    console.log('第 ' + count + '次检查, 此次检查 ' + doctor.name, new Date());
    check(doctor);
    setTimeout(go, 3 * 60 * 1000);
}

go();
