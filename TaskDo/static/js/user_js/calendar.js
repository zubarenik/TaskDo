var months = {'January': 0, 'February': 1, 'March': 2, 'April': 3,
              'May': 4, 'June': 5, 'July': 6, 'August': 7,
              'September': 8, 'October': 9, 'November': 10, 'December': 11};

function getMonthName(month){
    var keys = Object.keys(months);
    for (var key of keys){
        if (months[key] === month){
            return key;
        }
    }
};

function getMonthNumber(name){
    var keys = Object.keys(months);
    for (var key of keys){
        if (key === name){
            return months[key];
        }
    }
};

function numberToName(number){
    var numberNames = ['one', 'two', 'three', 'four', 'five', 'six'];
    return numberNames[number];
};

var notes = [];

function addEvents(currentDay){
    var events = [];
    for (var i = 0; i < notes.length; i++){
        if (notes[i].fields.date === null){
            continue;
        }
        var checkDay = new Date(notes[i].fields.date);
        if (checkDay.getFullYear() == currentDay.getFullYear()
            && checkDay.getMonth() == currentDay.getMonth()
            && checkDay.getDate() == currentDay.getDate()){
            var event = {
                'pk': notes[i].pk,
                'title': notes[i].fields.title,
                'text': notes[i].fields.text,
                'time': notes[i].fields.time,
                'priority': notes[i].fields.priority
            };
            events.push(event);
        }
    }
    return events;
}

function getNotes(currentDay){
    $.ajax({
        type: 'GET',
        url:  window.location.href,
        data: {'type': 'notes'},
        async: false,
        success: function(data){
            notes = data;
        }
    });
}

function getTime(time){
    if (time == null){
        return null;
    }
    var currentTime = new Date(), resultTime = null;
    currentTime.setHours(time.split(":")[0], time.split(":")[1]);
    if (Math.floor(currentTime.getMinutes() / 10) > 0){
        resultTime = currentTime.getHours() + ':' + currentTime.getMinutes();
    }
    else{
        resultTime = currentTime.getHours() + ':0' + currentTime.getMinutes();
    }
    return resultTime;
}

function getLine(lineId, day, check){
    var line = document.getElementById(lineId);
    line.innerHTML = '';
    for (var i = 0; i < day.getDay(); i++){
        var dayPreviousMonth = new Date(day.getFullYear(), day.getMonth(), 1 + i - day.getDay());
        var newItem = '<li class="day other-month"><div class="date">' + dayPreviousMonth.getDate() + '</div>';
        var previousMonthEvents = addEvents(dayPreviousMonth);
        if (previousMonthEvents.length > 0){
            newItem += '<div class="event-desc">';
            for (var j = 0; j < previousMonthEvents.length; j++){
                newItem += '<div class="event event-other-month">' + previousMonthEvents[j].title + '</div>';
            }
            newItem += '</div>';
        }
        newItem += '</li>';
        line.insertAdjacentHTML('beforeend', newItem);
    }
    var nextDay = day.getDate();
    var checkNextMonth = false;
    if (check){
        for (var i = day.getDay(); i < 7; i++){
            var dayNextMonth = new Date(day.getFullYear(), day.getMonth(), nextDay++);
            var newItem = '<li class="day other-month"><div class="date">' + dayNextMonth.getDate() + '</div>';
            var nextMonthEvents = addEvents(dayNextMonth);
            if (nextMonthEvents.length > 0){
                newItem += '<div class="event-desc">';
                for (var j = 0; j < nextMonthEvents.length; j++){
                    newItem += '<div class="event event-other-month">' + nextMonthEvents[j].title + '</div>';
                }
                newItem += '</div>';
            }
            newItem += '</li>';
            line.insertAdjacentHTML('beforeend', newItem);
        }
    }
    else{
        var lastDay = new Date(day.getFullYear(), day.getMonth() + 1, 0);
        for (var i = day.getDay(); i < 7; i++){
            var dayCurrentMonth = new Date(day.getFullYear(), day.getMonth(), nextDay);
            var newItem = null, dayClassName = null, eventClassName = null,
                isCurrentEvents = null, addNoteAvailability = null;
            var currentEvents = addEvents(dayCurrentMonth);
            if (lastDay.getDate() >= nextDay){
                dayClassName = 'day';
                eventClassName = 'event';
                isCurrentEvents = true;
                if (lastDay.getDate() === nextDay){
                    checkNextMonth = true;
                }
            }
            else{
                dayClassName = 'day other-month';
                eventClassName = 'event event-other-month';
                isCurrentEvents = false;
            }
            if (isCurrentEvents && currentEvents.length == 0){
                addNoteAvailability = 'addNoteToCurrentDate(event,' + dayCurrentMonth.getDate() + ')';
            }
            else if (isCurrentEvents){
                addNoteAvailability = 'eventsPreview(event,' + dayCurrentMonth.getDate() + ')';
            }
            newItem = '<li class="' + dayClassName + '" onclick="' + addNoteAvailability + '"><div class="date">' + dayCurrentMonth.getDate() + '</div>';
            if (currentEvents.length > 0){
                newItem += '<div class="event-desc">';
                for (var j = 0; j < currentEvents.length; j++){
                    newItem += '<div class="' + eventClassName + '" onclick="';
                    if (isCurrentEvents){
                        newItem += 'eventPreview(' + "'" + currentEvents[j].title + "','"
                                + currentEvents[j].text + "','" + getTime(currentEvents[j].time) + "',"
                                + currentEvents[j].pk + ',' + currentEvents[j].priority + ')';
                    }
                    newItem += '">' + currentEvents[j].title + '</div>';
                }
                newItem += '</div>';
            }
            newItem += '</li>';
            line.insertAdjacentHTML('beforeend', newItem);
            nextDay++;
        }
    }
    var nextWeek = new Date(day.getFullYear(), day.getMonth(), nextDay);
    var result = {
        'nextWeek': nextWeek,
        'checkNextMonth': checkNextMonth
    };
    return result;
};

function getCalendar(date){
    $('#month').text(getMonthName(date.getMonth()));
    $('#year').text(date.getFullYear());
    var nextWeek = new Date(date.getFullYear(), date.getMonth(), 1);
    var checkNextMonth = false;
    for (var i = 0; i < 6; i++){
        var lineId = 'line_' + numberToName(i);
        result = getLine(lineId, nextWeek, checkNextMonth);
        nextWeek = result.nextWeek;
        checkNextMonth = result.checkNextMonth;
    }
};

$.get(
    window.location,
    function() {
        getNotes();
        var now = new Date();
        getCalendar(now);
    }
);

function previousMonth(){
    var month = getMonthNumber($('#month').text());
    var year = Number($('#year').text());
    var date = new Date(year, month - 1, 1);
    getCalendar(date);
};

function nextMonth(){
    var month = getMonthNumber($('#month').text());
    var year = Number($('#year').text());
    var date = new Date(year, month + 1, 1);
    getCalendar(date);
};

function hideEventPreview(){
    var preview = document.getElementById('event_preview');
    preview.style.opacity = '0';
    preview.style.display = 'none';
    preview.style.width = '50%';
    preview.innerHTML = '';
    $("#event_preview").attr('onmousemove', '');
    var backdrop = document.getElementsByClassName('modal-backdrop fade show preview');
    if (typeof backdrop[0] !== 'undefined'){
        backdrop[0].parentNode.removeChild(backdrop[0]);
    }
};

function eventPreview(title, text, time, pk, priority){
    document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', '<div class="modal-backdrop fade show preview"></div>');
    var preview = document.getElementById('event_preview');
    preview.style.display = 'block';
    preview.insertAdjacentHTML('beforeend', '<p class="text-center">' + title + '</p>');
    preview.insertAdjacentHTML('beforeend', '<p class="note_text">' + text + '</p>');
    if (time != 'null'){
        preview.insertAdjacentHTML('beforeend', '<p class="time">' + time + '</p>');
    }
    else{
        preview.insertAdjacentHTML('beforeend', '<p class="time" style="background: #A747F8"></p>');
    }
    var timeClass = preview.getElementsByClassName('time')[0];
    if (priority == 2){
        timeClass.style.color = '#E0FF00';
        if (time == 'null'){
            timeClass.style.background = "#E0FF00";
        }
    }
    else if (priority == 3){
        timeClass.style.color = '#EC1820';
        if (time == 'null'){
            timeClass.style.background = "#EC1820";
        }
    }
    var button = '<div class="d-flex justify-content-center note-footer">'
               + '<button type="button" class="btn btn-outline-light button-outline note-button" onclick="addArgsNote(' + pk + '); return false;">'
               + 'Open' + '</button></div>';
    preview.insertAdjacentHTML('beforeend', button);
    setTimeout("document.getElementById('event_preview').style.opacity = '1'", 50);
};

function eventsPreview(event, day){
    var target = event.target;
    while (target.tagName != 'HTML'){
        if (target.className == 'event'){
            return;
        }
        target = target.parentNode;
    }
    var month = getMonthNumber($('#month').text());
    var year = Number($('#year').text());
    var currentDay = new Date(year, month, day);
    var currentEvents = addEvents(currentDay);
    document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', '<div class="modal-backdrop fade show preview"></div>');
    var preview = document.getElementById('event_preview');
    preview.style.display = 'block';
    preview.style.width = '30%';
    preview.insertAdjacentHTML('beforeend', '<p class="text-center">' + day + '</p>');
    preview.insertAdjacentHTML('beforeend', '<button class="add-note" onclick="addNoteToCurrentDate(event,' + day + ')"></button>');
    var eventList = '<dl class="event-list-preview"></dl>';
    preview.insertAdjacentHTML('beforeend', eventList);
    var eventListPreview = document.getElementsByClassName('event-list-preview')[0];
    for (var i = 0; i < currentEvents.length; i++){
        var time = getTime(currentEvents[i].time);
        var currentEvent = '<div onclick="hideEventPreview(); eventPreview(' + "'" + currentEvents[i].title + "','"
                    + currentEvents[i].text + "','" + time + "',"
                    + currentEvents[i].pk + ',' + currentEvents[i].priority + ');">';
        if (time != null){
            currentEvent += '<dt>' + time + '</dt>';
        }
        else{
            currentEvent += '<dt></dt>';
        }
        currentEvent += '<dd>' + currentEvents[i].title + '</dd></div>';
        eventListPreview.insertAdjacentHTML('beforeend', currentEvent);
        var dtTag = eventListPreview.getElementsByTagName('dt')[i];
        var ddTag = eventListPreview.getElementsByTagName('dd')[i];
        if (currentEvents[i].priority == 2){
            dtTag.style.background = '#E0FF00';
            dtTag.style.borderColor = '#E0FF00';
            ddTag.style.borderColor = '#E0FF00';
        }
        else if (currentEvents[i].priority == 3){
            dtTag.style.background = '#EC1820';
            dtTag.style.borderColor = '#EC1820';
            ddTag.style.borderColor = '#EC1820';
        }
    }
    setTimeout("document.getElementById('event_preview').style.opacity = '1'", 100);
};

function addNoteToCurrentDate(event, day){
    var target = event.target;
    while (target.tagName != 'HTML'){
        if (target.className == 'event'){
            return;
        }
        target = target.parentNode;
    }
    hideEventPreview();
    document.getElementById('note_date_field').style.display = 'none';
    document.getElementById('note_time_field').style.display = 'block';
    var month = getMonthNumber($('#month').text());
    var year = Number($('#year').text());
    var currentDay = new Date(year, month, day + 1);
    document.getElementById('note_date').valueAsDate = currentDay;
    $("#create_note").modal('show');
};

$(document).mouseup(function(event){
    var target = event.target;
    while (target.tagName != 'HTML'){
        if (target.id == 'event_preview'){
            return;
        }
        target = target.parentNode;
    }
    hideEventPreview();
});

function addArgsNote(pk){
    let url = '/note/' + pk;
    window.location = url;
};