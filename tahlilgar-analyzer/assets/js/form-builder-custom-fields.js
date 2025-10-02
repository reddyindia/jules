(function($) {
    'use strict';

    if (typeof $.fn.formBuilder === 'undefined') {
        return;
    }

    const registerField = $.fn.formBuilder.registerField;

    // --- 1. Welcome Page ---
    registerField('welcomePage', {
        name: 'welcomePage',
        label: 'صفحه خوش‌آمدگویی',
        icon: '👋',
        extends: 'header',
        config: {
            label: 'به پرسشنامه ما خوش آمدید!',
            subtype: 'h1',
            className: 'welcome-page-header'
        }
    });

    // --- 2. Short Text ---
    const validationTypes = {
        'none': { label: 'هیچکدام', pattern: '', placeholder: '...' },
        'email': { label: 'ایمیل', pattern: '^\\S+@\\S+\\.\\S+$', placeholder: 'example@domain.com' },
        'url': { label: 'آدرس سایت (URL)', pattern: '^(https?|ftp):\\/\\/[^\\s\\/$.?#].[^\\s]*$', placeholder: 'https://example.com' },
        'iranianMobile': { label: 'تلفن همراه ایران', pattern: '^(09|\\+989)\\d{9}$', placeholder: '09123456789' },
        'persianChars': { label: 'حروف فارسی', pattern: '^[\\u0600-\\u06FF\\s]+$', placeholder: 'فقط حروف فارسی' },
        'englishChars': { label: 'حروف انگلیسی', pattern: '^[a-zA-Z\\s]+$', placeholder: 'Only English letters' },
        'digits': { label: 'عدد (انگلیسی)', pattern: '^\\d+$', placeholder: '12345' },
    };
    registerField('shortText', {
        name: 'shortText',
        label: 'متنی با پاسخ کوتاه',
        icon: 'T',
        extends: 'text',
        onrender: function(event) {
            const field = this;
            const fieldData = field.data;
            fieldData.validationType = fieldData.validationType || 'none';
            const dropdownLabel = field.markup('label', 'نوع اعتبارسنجی', { className: 'prop-label' });
            const options = Object.entries(validationTypes).map(([key, { label }]) => {
                const optionAttrs = { value: key };
                if (key === fieldData.validationType) {
                    optionAttrs.selected = true;
                }
                return field.markup('option', label, optionAttrs);
            });
            const dropdown = field.markup('select', options, { className: 'prop-value' });
            $(dropdown).on('change', function(e) {
                const newType = e.target.value;
                fieldData.validationType = newType;
                const validation = validationTypes[newType];
                const inputField = field.element.querySelector('.fld-input');
                if (inputField) {
                    inputField.setAttribute('placeholder', validation.placeholder);
                    if (validation.pattern) {
                        inputField.setAttribute('pattern', validation.pattern);
                    } else {
                        inputField.removeAttribute('pattern');
                    }
                }
                field.data.placeholder = validation.placeholder;
            });
            const placeholderInput = event.target.querySelector('[name="fld-placeholder"]');
            if (placeholderInput) {
                const container = field.markup('div', [dropdownLabel, dropdown], {className: 'form-group prop-wrap'});
                placeholderInput.parentElement.after(container);
            }
        }
    });

    // --- 3. Multiple Choice ---
    registerField('multipleChoice', {
        name: 'multipleChoice',
        label: 'چند‌گزینه‌ای',
        icon: '☑️',
        extends: 'checkbox-group',
        config: {
            label: 'یک یا چند گزینه را انتخاب کنید',
            options: [
                { label: 'گزینه ۱', value: 'option-1', selected: false },
                { label: 'گزینه ۲', value: 'option-2', selected: false }
            ]
        }
    });

    // --- 4. Long Text ---
    registerField('longText', {
        name: 'longText',
        label: 'متنی با پاسخ بلند',
        icon: '📝',
        extends: 'textarea',
        config: {
            label: 'پاسخ خود را اینجا بنویسید',
            rows: 4
        }
    });

    // --- 5. Question Group ---
    registerField('questionGroup', {
        name: 'questionGroup',
        label: 'گروه سوال',
        icon: '🗂️',
        extends: 'header',
        config: {
            label: 'عنوان گروه سوالات',
            subtype: 'h3',
            className: 'field-group-header'
        }
    });

    // --- 6. Dropdown List ---
    registerField('dropdownList', {
        name: 'dropdownList',
        label: 'لیست کشویی',
        icon: '🔻',
        extends: 'select',
        config: {
            label: 'یک گزینه را انتخاب کنید',
            options: [
                { label: 'گزینه ۱', value: 'option-1', selected: false },
                { label: 'گزینه ۲', value: 'option-2', selected: false }
            ]
        }
    });

    // --- 7. Rating ---
    registerField('ratingScale', {
        name: 'ratingScale',
        label: 'درجه‌بندی',
        icon: '⭐',
        build: function(value) {
            const { label, max = 5 } = this.config;
            let stars = '';
            for (let i = 1; i <= max; i++) {
                stars += `<span class="star" data-value="${i}">☆</span>`;
            }
            return this.markup('div', [
                this.markup('label', label, { className: 'fld-label' }),
                this.markup('div', stars, { className: 'rating-stars' })
            ], { className: 'form-group rating-scale-wrap' });
        },
        onrender: function(event) {
            const field = this;
            const maxRatingInput = field.markup('input', null, {
                type: 'number',
                name: 'max',
                value: field.config.max || 5,
                className: 'prop-value'
            });
            $(maxRatingInput).on('input', function(e) {
                field.config.max = e.target.value;
            });
            const maxLabel = field.markup('label', 'حداکثر امتیاز', { className: 'prop-label' });
            const container = field.markup('div', [maxLabel, maxRatingInput], { className: 'form-group prop-wrap' });
            event.target.querySelector('.fld-label-wrap').after(container);
        }
    });

    // --- 8. Ranking ---
    registerField('rankingList', {
        name: 'rankingList',
        label: 'اولویت‌دهی',
        icon: '↕️',
        build: function(value) {
            const { label, values } = this.config;
            const items = values.map(val => this.markup('li', val.label, {className: 'ranking-item'}));
            return this.markup('div', [
                this.markup('label', label, { className: 'fld-label' }),
                this.markup('ol', items, { className: 'ranking-list' })
            ], { className: 'form-group ranking-list-wrap' });
        },
        onrender: function(event) {
            const field = this;
            const optionsTextarea = field.markup('textarea', field.config.values.map(v => v.label).join('\n'), {
                name: 'values',
                className: 'prop-value'
            });
            $(optionsTextarea).on('input', function(e) {
                field.config.values = e.target.value.split('\n').map(line => ({ label: line, value: line }));
            });
            const optionsLabel = field.markup('label', 'گزینه‌ها (هر کدام در یک خط)', { className: 'prop-label' });
            const container = field.markup('div', [optionsLabel, optionsTextarea], { className: 'form-group prop-wrap' });
            event.target.querySelector('.fld-label-wrap').after(container);
        },
        config: {
            values: [
                { label: 'گزینه اول', value: 'گزینه اول' },
                { label: 'گزینه دوم', value: 'گزینه دوم' },
                { label: 'گزینه سوم', value: 'گزینه سوم' },
            ]
        }
    });

    // --- 9. Static Text ---
    registerField('staticText', {
        name: 'staticText',
        label: 'متن بدون پاسخ',
        icon: 'ℹ️',
        extends: 'paragraph',
        config: {
            label: 'این یک متن راهنما برای کاربران است.',
            className: 'static-text-paragraph'
        }
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
            className: 'end-page-paragraph'
        }
    });

})(jQuery);