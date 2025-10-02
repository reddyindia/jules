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
        disabledActionButtons: ['data', 'save'],

        // The final, complete list of all 11 custom tools.
        controlOrder: [
            'welcomePage',
            'shortText',
            'longText',
            'multipleChoice',
            'dropdownList',
            'questionGroup',
            'staticText',
            'ratingScale',
            'rankingList',
            'fileUpload',
            'endPage'
        ],

        // We no longer need to disable default fields as we are providing a full custom set.
        disableFields: [
            'autocomplete', 'button', 'checkbox-group', 'date', 'file', 'header',
            'hidden', 'number', 'paragraph', 'radio-group', 'select', 'starRating',
            'text', 'textarea'
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
    const previewBtn = document.getElementById('preview-form-btn');
    const titleInput = document.getElementById('form-title-input');

    if (saveBtn) {
        saveBtn.addEventListener('click', async function() {
            const formTitle = titleInput.value.trim();
            if (formTitle === '') {
                alert('لطفاً یک نام برای فرم خود وارد کنید.');
                titleInput.focus();
                return;
            }

            const formJSON = formBuilder.actions.getData('json');

            if (!formJSON || formJSON.length <= 2) {
                alert('فرم خالی است. لطفاً حداقل یک فیلد اضافه کنید.');
                return;
            }

            saveBtn.disabled = true;
            saveBtn.textContent = 'در حال ذخیره...';

            try {
                const response = await fetch(tahlilgar_form_builder.rest_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': tahlilgar_form_builder.nonce
                    },
                    body: JSON.stringify({
                        form_title: formTitle,
                        form_data: JSON.parse(formJSON)
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('فرم با موفقیت ذخیره شد! شناسه پست: ' + data.post_id);
                } else {
                    const errorMessage = data.message || 'یک خطای ناشناخته رخ داد.';
                    alert('خطا در ذخیره‌سازی فرم: ' + errorMessage);
                }

            } catch (error) {
                console.error('Fetch Error:', error);
                alert('یک خطای ناشناخته در هنگام ارتباط با سرور رخ داد.');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'ذخیره';
            }
        });
    }

    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            alert('قابلیت پیش‌نمایش در مراحل بعدی پیاده‌سازی خواهد شد.');
        });
    }
});