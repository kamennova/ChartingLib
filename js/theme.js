class ThemeSwitcher {
    constructor() {
        this.modes = [
            'day',
            'night'
        ];

        this.mode = 0; // day
        this.chart_containers = [];

        let theme_btn = document.querySelector('.theme-btn');
        theme_btn.querySelector('.mode-name').textContent = this.modes[(this.mode + 1) % this.modes.length];

        theme_btn.addEventListener('click', function () {
            document.body.classList.remove(this.modes[this.mode] + '-mode');
            this.toggle_mode();
            document.body.classList.add(this.modes[this.mode] + '-mode');
            theme_btn.querySelector('.mode-name').textContent = this.modes[(this.mode + 1) % this.modes.length];

            for (let i = 0; i < this.chart_containers.length; i++) {
                this.chart_containers[i].set_mode(this.modes[this.mode]);
            }
        }.bind(this));
    }

    toggle_mode() {
        this.mode = ++this.mode % this.modes.length;
    }
}