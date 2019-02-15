const hide = function (elem) {
    elem.classList.add('hidden');
};

const show = function (elem) {
    elem.classList.remove('hidden');
};

const toggle = function (elem) {
    elem.classList.toggle('hidden');
};

const array_bind_event = function (array, event_name, event_func) {
    let array_length = array.length;
    for (let i = 0; i < array_length; i++) {
        array[i].addEventListener(event_name, event_func);
    }
};

const short_month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function ok() {
    alert('ok');
}

function get_parent_by_level(elem, level) {
    let parent = elem;
    for (let i = 1; i <= level; i++) {
        parent = parent.parentNode;
    }
    return parent;
}

function remove_element(elementId) {
    let element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Day object to yyyy-MM-dd format
function format_date(date) {
    let year = date.getFullYear();

    let month = date.getMonth();
    if (++month < 10) month = '0' + month;
    let day = date.getDate();
    if (date < 10) day = '0' + day;

    return year + '-' + month + '-' + day;
}