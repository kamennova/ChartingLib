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

function get_collapsed_height(container){
    let new_height = 20;
    let children = container.children;

    for (let a = 0; a < children.length; a++) {
        if (children[a].classList.contains('collapsible-title')) {
            new_height = children[a].offsetHeight;
            break;
        }
    }

    let container_padding_top = window.getComputedStyle(container, null).getPropertyValue("padding-top");
    let container_padding_bottom = window.getComputedStyle(container, null).getPropertyValue("padding-bottom");
    let padding = Number(container_padding_top.substring(0, container_padding_top.length - 2)) + Number(container_padding_bottom.substring(0, container_padding_bottom.length - 2));

    return new_height + padding + 'px';
}