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

        // Updated list of controls including our new custom fields
        controlOrder: [
            'welcomePage',
            'fieldGroup',
            'staticText',
            'validatedText',
            'textarea',
            'number',
            'select',
            'checkbox-group',
            'radio-group',
            'ratingScale',
            'rankingList',
            'date',
            'file',
            'autocomplete',
            'readOnlyText', // Calculated Variable field
            'hidden',       // Hidden Info field
            'button',
            'endPage'
        ],

        // We remove replaceFields to avoid ambiguity and rely on controlOrder
        // for the definitive list of available fields.

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
        saveBtn.addEventListener('click', async function() {
            const formJSON = formBuilder.actions.getData('json');

            if (!formJSON || formJSON.length <= 2) {
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
                saveBtn.textContent = 'ذخیره فرم';
            }
        });
    }
});