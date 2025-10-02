jQuery(document).ready(function($) {
    'use strict';

    const fbWrap = document.getElementById('form-builder-wrap');
    if (!fbWrap) {
        return;
    }

    const options = {
        i18n: {
            locale: 'fa-IR',
            location: 'https://formbuilder.online/assets/lang/',
        },
        disabledActionButtons: ['data', 'save', 'clear'],
        controlOrder: [
            'header', 'paragraph', 'text', 'textarea', 'number', 'select',
            'checkbox-group', 'radio-group', 'date', 'file', 'autocomplete', 'button'
        ],
        messages: {
            clearAllMessage: 'آیا از پاک کردن تمام فیلدها مطمئن هستید؟',
            clearAll: 'پاک کردن همه',
            save: 'ذخیره',
            close: 'بستن',
        },
    };

    const formBuilder = $(fbWrap).formBuilder(options);

    const saveBtn = document.getElementById('save-form-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const formJSON = formBuilder.actions.getData('json');

            if (!formJSON || formJSON.length === 2) { // "[]" is 2 chars
                alert('فرم خالی است. لطفاً حداقل یک فیلد اضافه کنید.');
                return;
            }

            const formTitle = prompt('لطفاً یک عنوان برای فرم خود وارد کنید:', 'فرم جدید');
            if (formTitle === null || formTitle.trim() === '') {
                alert('ذخیره‌سازی لغو شد. عنوان فرم ضروری است.');
                return;
            }

            saveBtn.disabled = true;
            saveBtn.textContent = 'در حال ذخیره...';

            $.ajax({
                url: tahlilgar_form_builder.ajax_url,
                type: 'POST',
                data: {
                    action: 'save_tahlilgar_form',
                    security: tahlilgar_form_builder.nonce,
                    form_data: formJSON,
                    form_title: formTitle
                },
                success: function(response) {
                    if (response.success) {
                        alert('فرم با موفقیت ذخیره شد! شناسه پست: ' + response.data.post_id);
                        // Optionally, redirect to an "edit" page or clear the builder
                        // formBuilder.actions.clearFields();
                    } else {
                        alert('خطا در ذخیره‌سازی فرم: ' + response.data);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                    alert('یک خطای ناشناخته در هنگام ارتباط با سرور رخ داد.');
                },
                complete: function() {
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'ذخیره فرم';
                }
            });
        });
    }
});