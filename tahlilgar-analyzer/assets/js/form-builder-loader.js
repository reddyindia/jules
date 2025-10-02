jQuery(document).ready(function($) {
    if (typeof jQuery.fn.formBuilder === 'function') {
        const options = {
            i18n: {
                locale: 'fa-IR',
                location: 'https://cdn.jsdelivr.net/gh/dr-pro/form-builder-translations/lang/',
            },
            disabledActionButtons: ['data', 'save', 'clear'],
            disableFields: ['autocomplete', 'button', 'hidden', 'paragraph', 'header'],
            typeUserDisabledAttrs: {
                'checkbox-group': ['name', 'required', 'description', 'access', 'className', 'toggle'],
                'radio-group': ['name', 'required', 'description', 'access', 'className', 'other', 'inline'],
                'select': ['name', 'required', 'description', 'access', 'className', 'multiple'],
                'text': ['name', 'required', 'description', 'access', 'className', 'subtype', 'maxlength', 'placeholder'],
                'textarea': ['name', 'required', 'description', 'access', 'className', 'subtype', 'maxlength', 'rows'],
                'number': ['name', 'required', 'description', 'access', 'className', 'min', 'max', 'step'],
                'date': ['name', 'required', 'description', 'access', 'className'],
            },
        };
        const formBuilder = $('#form-builder-container').formBuilder(options);

        $('#save-form-button').on('click', function() {
            const formTitle = $('#form-title').val().trim();
            const formData = formBuilder.actions.getData('json');
            const statusDiv = $('#form-builder-status');

            if (!formTitle) {
                statusDiv.text('لطفاً یک عنوان برای فرم وارد کنید.').css('color', 'red');
                return;
            }
            if (!formData || formData === '[]') {
                 statusDiv.text('لطفاً حداقل یک فیلد به فرم اضافه کنید.').css('color', 'red');
                return;
            }

            statusDiv.text('در حال ذخیره فرم...').css('color', 'blue');

            $.ajax({
                url: tahlilgar_form_builder.rest_url,
                method: 'POST',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', tahlilgar_form_builder.nonce);
                },
                data: {
                    form_title: formTitle,
                    form_data: JSON.parse(formData) // Ensure data is sent as an object
                },
                success: function(response) {
                    statusDiv.text('فرم با موفقیت ذخیره شد!').css('color', 'green');
                    // Redirect to form management page after a short delay
                    setTimeout(function() {
                        window.location.href = '/form-management';
                    }, 1500);
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'خطایی در هنگام ذخیره فرم رخ داد.';
                    statusDiv.text('خطا: ' + errorMsg).css('color', 'red');
                }
            });
        });
    } else {
        $('#form-builder-container').html('<p style="color:red;">خطا: کتابخانه Form Builder بارگذاری نشده است.</p>');
    }
});