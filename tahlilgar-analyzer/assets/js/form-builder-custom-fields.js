(function($) {
    'use strict';

    if (typeof $.fn.formBuilder === 'undefined') { return; }

    const registerField = $.fn.formBuilder.registerField;
    const I18N = $.fn.formBuilder.languages['fa-IR'];

    // --- 1. Welcome Page ---
    registerField('welcomePage', {
        name: 'welcomePage',
        label: 'صفحه خوش‌آمدگویی',
        icon: '👋',
        extends: 'header',
        config: { label: 'به پرسشنامه ما خوش آمدید!', subtype: 'h1' }
    });

    // --- 2. Short Text ---
    registerField('shortText', {
        name: 'shortText',
        label: 'متن کوتاه',
        icon: 'T',
        extends: 'text', // Extends the base text field to get required, placeholder, etc. for free.
        onrender: function(event) {
            const field = this;
            const validationTypes = {
                '': 'هیچکدام', 'text': 'متن', 'email': 'ایمیل', 'url': 'آدرس سایت', 'tel': 'تلفن', 'number': 'عدد', 'date': 'تاریخ'
            };
            // Create a dropdown for validation type
            const dropdownLabel = field.markup('label', 'نوع اعتبارسنجی', { className: 'prop-label' });
            const options = Object.entries(validationTypes).map(([value, label]) =>
                field.markup('option', label, { value, selected: value === (field.config.attrs.type || 'text') })
            );
            const select = field.markup('select', options, { className: 'prop-value', name: 'type' });
            $(select).on('change', e => { field.config.attrs.type = e.target.value; });

            // Inject the new setting into the edit panel
            const placeholderInput = event.target.querySelector('.fld-placeholder-wrap');
            if (placeholderInput) {
                placeholderInput.after(field.markup('div', [dropdownLabel, select], { className: 'form-group prop-wrap' }));
            }
        }
    });

    // --- 3. Multiple Choice ---
    registerField('multipleChoice', {
        name: 'multipleChoice',
        label: 'چند‌گزینه‌ای',
        icon: '☑️',
        extends: 'checkbox-group' // The default options editor is perfect for this.
    });

    // --- 4. Long Text ---
    registerField('longText', {
        name: 'longText',
        label: 'متن بلند',
        icon: '📝',
        extends: 'textarea' // The default is fine, it has rows, required, etc.
    });

    // --- 5. Question Group ---
    registerField('questionGroup', {
        name: 'questionGroup',
        label: 'گروه سوال',
        icon: '🗂️',
        extends: 'header',
        config: { label: 'عنوان گروه', subtype: 'h3' }
    });

    // --- 6. Dropdown List ---
    registerField('dropdownList', {
        name: 'dropdownList',
        label: 'لیست کشویی',
        icon: '🔻',
        extends: 'select' // The default options editor is perfect.
    });

    // --- 7. Rating ---
    registerField('ratingScale', {
        name: 'ratingScale',
        label: 'درجه‌بندی',
        icon: '⭐',
        extends: 'radio-group', // Use radio-group as a base for data structure
        config: {
            label: 'امتیاز شما چیست؟',
            inline: true, // Display horizontally
            options: [ // Default to 5 stars
                { label: '★', value: '1' }, { label: '★', value: '2' }, { label: '★', value: '3' }, { label: '★', value: '4' }, { label: '★', value: '5' }
            ]
        },
        onrender: function(event) {
            const field = this;
            const settingsPanel = $(event.target);

            // Hide the standard options editor since we're creating our own UI for it.
            settingsPanel.find('.fld-options-wrap').hide();

            // Create a number input to control the star count
            const maxLabel = field.markup('label', 'تعداد ستاره (۱ تا ۱۰)', { className: 'prop-label' });
            const maxInput = field.markup('input', null, {
                type: 'number',
                value: field.config.options.length,
                min: 1,
                max: 10,
                className: 'prop-value'
            });

            // When the number changes, update the 'options' config array
            $(maxInput).on('input', function(e) {
                const count = Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 0));
                const newOptions = [];
                for (let i = 1; i <= count; i++) {
                    newOptions.push({ label: '★', value: String(i), selected: false });
                }
                field.config.options = newOptions;
            });

            // Add the new setting to the panel
            const customSetting = field.markup('div', [maxLabel, maxInput], { className: 'form-group prop-wrap' });
            settingsPanel.find('.fld-inline-wrap').after(customSetting);
        }
    });

    // --- 8. Ranking ---
    registerField('rankingList', {
        name: 'rankingList',
        label: 'اولویت‌دهی',
        icon: '↕️',
        extends: 'checkbox-group', // Use this to get the options editor
        config: {
            label: 'آیتم‌ها را اولویت‌بندی کنید',
            description: 'کاربران گزینه‌ها را با کشیدن و رها کردن مرتب خواهند کرد.'
        },
        onrender: function(event) {
            // Hide the "select" checkbox for each option, as it's not relevant for ranking.
            $(event.target).find('.option-selected').hide();
        }
    });

    // --- 9. Static Text ---
    registerField('staticText', {
        name: 'staticText',
        label: 'متن بدون پاسخ',
        icon: 'ℹ️',
        extends: 'paragraph'
    });

    // --- 10. File Upload ---
    registerField('fileUpload', {
        name: 'fileUpload',
        label: 'آپلود فایل',
        icon: '📎',
        extends: 'file'
    });

    // --- 11. End Page ---
    registerField('endPage', {
        name: 'endPage',
        label: 'صفحه پایان',
        icon: '🏁',
        extends: 'paragraph',
        config: {
            label: 'از وقتی که گذاشتید سپاسگزاریم!',
        }
    });

})(jQuery);