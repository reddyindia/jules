jQuery(document).ready(function($) {
    'use strict';

    const fbWrap = document.getElementById('form-builder-wrap');
    if (!fbWrap) {
        return;
    }

    // --- Define All 11 Custom Fields as a JS Array ---
    const customFields = [
        {
            label: 'صفحه خوش‌آمدگویی',
            type: 'header',
            subtype: 'h1',
            icon: '👋',
            attrs: {
                className: 'welcome-page-header'
            }
        },
        {
            label: 'متن کوتاه',
            type: 'text',
            icon: 'T',
            // Custom attributes can be added here for more advanced settings
        },
        {
            label: 'چند‌گزینه‌ای',
            type: 'checkbox-group',
            icon: '☑️',
            values: [
                { label: 'گزینه ۱', value: 'option-1' },
                { label: 'گزینه ۲', value: 'option-2' }
            ]
        },
        {
            label: 'متن بلند',
            type: 'textarea',
            icon: '📝'
        },
        {
            label: 'گروه سوال',
            type: 'header',
            subtype: 'h3',
            icon: '🗂️'
        },
        {
            label: 'لیست کشویی',
            type: 'select',
            icon: '🔻',
            values: [
                { label: 'گزینه ۱', value: 'option-1' },
                { label: 'گزینه ۲', value: 'option-2' }
            ]
        },
        {
            label: 'درجه‌بندی',
            type: 'starRating',
            icon: '⭐'
        },
        {
            // Note: True ranking requires a custom field type.
            // This uses a checkbox group as a placeholder.
            label: 'اولویت‌دهی',
            type: 'checkbox-group',
            icon: '↕️',
            description: 'کاربران گزینه‌ها را مرتب خواهند کرد'
        },
        {
            label: 'متن بدون پاسخ',
            type: 'paragraph',
            icon: 'ℹ️'
        },
        {
            label: 'آپلود فایل',
            type: 'file',
            icon: '📎'
        },
        {
            label: 'صفحه پایان',
            type: 'paragraph',
            icon: '🏁',
            attrs: {
                className: 'end-page-paragraph'
            }
        }
    ];

    const options = {
        i18n: {
            locale: 'fa-IR',
            location: 'https://formbuilder.online/assets/lang/',
        },
        disabledActionButtons: ['data', 'save'],

        // Pass the custom fields directly to the builder
        fields: customFields,

        // Define which fields appear in the toolbox
        controlOrder: [
            'header',
            'text',
            'checkbox-group',
            'textarea',
            'select',
            'starRating',
            'paragraph',
            'file'
        ],

        // Replace default tool labels/icons with our custom ones
        replaceFields: [
            { type: 'header', label: 'صفحه خوش‌آمدگویی / گروه سوال', icon: '👋' },
            { type: 'text', label: 'متن کوتاه', icon: 'T' },
            { type: 'checkbox-group', label: 'چند‌گزینه‌ای / اولویت‌دهی', icon: '☑️' },
            { type: 'textarea', label: 'متن بلند', icon: '📝' },
            { type: 'select', label: 'لیست کشویی', icon: '🔻' },
            { type: 'starRating', label: 'درجه‌بندی', icon: '⭐' },
            { type: 'paragraph', label: 'متن بدون پاسخ / صفحه پایان', icon: 'ℹ️' },
            { type: 'file', label: 'آپلود فایل', icon: '📎' }
        ],

        messages: {
            clearAllMessage: 'آیا از پاک کردن تمام فیلدها مطمئن هستید؟',
            clearAll: 'پاک کردن همه',
            save: 'ذخیره',
            close: 'بستن',
        },
    };

    const formBuilder = $(fbWrap).formBuilder(options);

    // --- Event Handlers ---
    $('#save-form-btn').on('click', async function() {
        const formTitle = $('#form-title-input').val().trim();
        if (!formTitle) {
            alert('لطفاً یک نام برای فرم خود وارد کنید.');
            $('#form-title-input').focus();
            return;
        }
        const formJSON = formBuilder.actions.getData('json');
        if (!formJSON || formJSON.length <= 2) {
            alert('فرم خالی است. لطفاً حداقل یک فیلد اضافه کنید.');
            return;
        }
        const saveBtn = this;
        saveBtn.disabled = true;
        saveBtn.textContent = 'در حال ذخیره...';
        try {
            const response = await fetch(tahlilgar_form_builder.rest_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': tahlilgar_form_builder.nonce },
                body: JSON.stringify({ form_title: formTitle, form_data: JSON.parse(formJSON) })
            });
            const data = await response.json();
            if (response.ok) {
                alert('فرم با موفقیت ذخیره شد! شناسه پست: ' + data.post_id);
            } else {
                alert('خطا در ذخیره‌سازی فرم: ' + (data.message || 'یک خطای ناشناخته رخ داد.'));
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert('یک خطای ارتباطی با سرور رخ داد.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'ذخیره';
        }
    });

    $('#preview-form-btn').on('click', function() {
        alert('قابلیت پیش‌نمایش در مراحل بعدی پیاده‌سازی خواهد شد.');
    });
});