let form_fields = document.getElementsByClassName('form-field');
let form_fields_number = form_fields.length;

for (let i = 0; i < form_fields_number; i++) {
    if (form_fields[i].value != null && form_fields[i].value !== '') {
        console.log(form_fields[i].value);
        form_fields[i].classList.add('visited');
    } else {
        form_fields[i].classList.remove('visited');
    }

    form_fields[i].addEventListener('change', function () {
        if (this.value != null) {
            this.classList.add('visited');
        } else {
            this.classList.remove('visited');
        }
    })
}