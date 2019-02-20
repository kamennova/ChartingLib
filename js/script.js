let collapsibles = document.getElementsByClassName('collapsible');
for (let i = 0; i < collapsibles.length; i++) {
    collapsibles[i].insertAdjacentHTML("afterbegin", '<span class="collapse-btn"><span class="plus-bar"></span></span>');
}

let collapsed = document.getElementsByClassName('collapsed');
for (let i = 0; i < collapsed.length; i++) {
    collapsed[i].style.height = get_collapsed_height(collapsed[i]);
}

let collapse_btns = document.getElementsByClassName('collapse-btn');

for (let i = 0; i < collapse_btns.length; i++) {
    collapse_btns[i].addEventListener('click', function () {

        if (this.parentNode.classList.contains('collapsed')) {
            this.parentNode.style.height = null;
            this.parentNode.classList.remove('collapsed');
        } else {
            this.parentNode.style.height = get_collapsed_height(this.parentNode);
            this.parentNode.classList.add('collapsed');
        }
    });
}

function get_collapsed_height(container) {
    let new_height = 20;

    if (container.querySelector('.collapsible-header')) {
        new_height = container.querySelector('.collapsible-header').offsetHeight;
    }

    return new_height + 'px';
}

function get_css_num(str) {
    if (str.includes('px')) {
        return str.substring(0, str.length - 2);
    }
}