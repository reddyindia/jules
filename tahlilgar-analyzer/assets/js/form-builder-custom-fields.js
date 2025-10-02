(function($) {
    'use strict';

    if (typeof $.fn.formBuilder === 'undefined') {
        return;
    }

    const registerField = $.fn.formBuilder.registerField;

    // --- Helper function to create a settings field in the edit panel ---
    function createSetting(field, type, name, label) {
        const propName = `attrs.${name}`;
        const attrs = {
            type: type,
            name: propName,
            id: `${field.id}-${propName}`,
            className: 'prop-value'
        };

        if (type === 'checkbox') {
            attrs.checked = field.config[propName] || false;
        } else {
            attrs.value = field.config[propName] || '';
        }

        const input = field.markup(type === 'textarea' ? 'textarea' : 'input', null, attrs);
        const labelMarkup = field.markup('label', label, { htmlFor: attrs.id, className: 'prop-label' });

        $(input).on('input change', function(e) {
            if (type === 'checkbox') {
                field.config[propName] = e.target.checked;
            } else {
                field.config[propName] = e.target.value;
            }
        });

        return field.markup('div', [labelMarkup, input], { className: `form-group prop-wrap prop-${name}` });
    }

    // --- 1. Welcome Page ---
    registerField('welcomePage', {
        name: 'welcomePage',
        label: 'صفحه خوش‌آمدگویی',
        icon: '👋',
        extends: 'header',
        config: {
            label: 'به پرسشنامه ما خوش آمدید!',
            subtype: 'h1'
        }
    });

    // --- 2. Short Text ---
    registerField('shortText', {
        name: 'shortText',
        label: 'متن کوتاه',
        icon: 'T',
        extends: 'text',
        onrender: function(event) {
            const field = this;
            const validationTypes = {
                '': 'هیچکدام',
                'email': 'ایمیل',
                'url': 'آدرس سایت',
                'tel': 'تلفن',
                'number': 'عدد',
            };
            const options = Object.entries(validationTypes).map(([value, label]) => {
                const attrs = { value };
                if (value === (field.config.attrs.type || '')) attrs.selected = true;
                return field.markup('option', label, attrs);
            });
            const select = field.markup('select', options, { className: 'prop-value' });
            $(select).on('change', e => { field.config.attrs.type = e.target.value; });
            const label = field.markup('label', 'نوع اعتبارسنجی', { className: 'prop-label' });
            event.target.querySelector('.fld-placeholder-wrap').after(field.markup('div', [label, select], {className: 'form-group prop-wrap'}));
        }
    });

    // --- 3. Multiple Choice ---
    registerField('multipleChoice', {
        name: 'multipleChoice',
        label: 'چند‌گزینه‌ای',
        icon: '☑️',
        extends: 'checkbox-group'
    });

    // --- 4. Long Text ---
    registerField('longText', {
        name: 'longText',
        label: 'متن بلند',
        icon: '📝',
        extends: 'textarea'
    });

    // --- 5. Question Group ---
    registerField('questionGroup', {
        name: 'questionGroup',
        label: 'گروه سوال',
        icon: '🗂️',
        extends: 'header',
        config: {
            label: 'عنوان گروه',
            subtype: 'h3'
        }
    });

    // --- 6. Dropdown List ---
    registerField('dropdownList', {
        name: 'dropdownList',
        label: 'لیست کشویی',
        icon: '🔻',
        extends: 'select'
    });

    // --- 7. Rating ---
    registerField('ratingScale', {
        name: 'ratingScale',
        label: 'درجه‌بندی',
        icon: '⭐',
        extends: 'radio-group',
        config: {
            label: 'امتیاز شما چیست؟',
            options: [
                { label: '★', value: '1' },
                { label: '★', value: '2' },
                { label: '★', value: '3' },
                { label: '★', value: '4' },
                { label: '★', value: '5' }
            ],
            inline: true // Display stars in a row
        },
        onrender: function(event) {
            const field = this;
            const maxRatingInput = field.markup('input', null, {
                type: 'number',
                value: field.config.options.length || 5,
                className: 'prop-value',
                min: 1, max: 10
            });
            $(maxRatingInput).on('input', function(e) {
                const count = parseInt(e.target.value, 10);
                const newOptions = [];
                for (let i=1; i<=count; i++) {
                    newOptions.push({ label: '★', value: String(i) });
                }
                field.config.options = newOptions;
                // This part is tricky as it requires re-rendering the options in the edit panel.
                // For now, we just update the config.
            });
            const maxLabel = field.markup('label', 'تعداد ستاره', { className: 'prop-label' });
            event.target.querySelector('.fld-options-wrap').before(field.markup('div', [maxLabel, maxRatingInput], {className: 'form-group prop-wrap'}));
            event.target.querySelector('.fld-options-wrap').style.display = 'none'; // Hide the default options editor
        }
    });

    // --- 8. Ranking ---
    registerField('rankingList', {
        name: 'rankingList',
        label: 'اولویت‌دهی',
        icon: '↕️',
        extends: 'checkbox-group', // Base it on this to get the options editor
        config: {
            label: 'آیتم‌ها را اولویت‌بندی کنید',
            description: 'کاربران گزینه‌ها را با کشیدن و رها کردن مرتب خواهند کرد.'
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