let collapsibles = document.getElementsByClassName('collapsible');
for(let i =0; i<collapsibles.length; i++){
    collapsibles[i].insertAdjacentHTML("afterbegin", '<span class="collapse-btn"><span class="plus-bar"></span></span>');
}

let hide_btns = document.getElementsByClassName('collapse-btn');
for (let i = 0; i < hide_btns.length; i++) {
    hide_btns[i].addEventListener('click', function () {

        if (this.parentNode.classList.contains('collapsed')) {
            this.parentNode.style.height = null;
            this.parentNode.classList.remove('collapsed');
            this.classList.remove('plus');

        } else {

            let new_height = 20;
            let children = this.parentNode.children;

            for (let a = 0; a < children.length; a++) {
                if (children[a].classList.contains('collapsible-title')) {
                    new_height = children[a].offsetHeight;
                    break;
                }
            }

            let container_padding_top = window.getComputedStyle(this.parentNode, null).getPropertyValue("padding-top");
            let container_padding_bottom = window.getComputedStyle(this.parentNode, null).getPropertyValue("padding-bottom");
            let padding = Number(container_padding_top.substring(0, container_padding_top.length - 2)) + Number(container_padding_bottom.substring(0, container_padding_bottom.length - 2));

            this.parentNode.style.height = new_height + padding + 'px';
            this.parentNode.classList.add('collapsed');
            this.classList.add("plus");
        }
    });
}