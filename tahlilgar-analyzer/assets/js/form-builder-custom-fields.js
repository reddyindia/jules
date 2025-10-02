(function($) {
    'use strict';

    if (typeof $.fn.formBuilder === 'undefined') {
        return;
    }

    const registerField = $.fn.formBuilder.registerField;
    const I18N = $.fn.formBuilder.languages['fa-IR']; // Use existing translations

    // --- Field Definitions ---

    // 1. Welcome Page Field
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

    // 8. Read-only Text (برای متغیر محاسباتی)
    registerField('readOnlyText', {
        name: 'readOnlyText',
        label: 'متن فقط خواندنی (محاسباتی)',
        icon: '🧮',
        extends: 'text',
        config: {
            label: 'نتیجه محاسبه',
            description: 'مقدار این فیلد باید با جاوااسکریپت سفارشی در زمان نمایش فرم تنظیم شود.',
            className: 'readonly-text-field'
        },
        // This function makes the field read-only in the builder
        build: function(value) {
            const field = this.markup('input', null, {
                type: 'text',
                value: value,
                className: 'fld-input',
                readonly: true // Make it non-editable
            });
            return this.markup('div', field, { className: 'fld-input-wrap' });
        }
    });

    // 6. Rating Scale Field (درجه‌بندی)
    registerField('ratingScale', {
        name: 'ratingScale',
        label: 'درجه‌بندی',
        icon: '⭐',
        // This is a custom field, so we define its build and onrender from scratch
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
            // Logic for the edit panel
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

    // 7. Ranking Field (اولویت‌دهی)
    // Note: This provides the setup. The actual drag-drop rendering on the live form
    // would require a library like SortableJS, which is out of scope for the builder itself.
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
            // Provide a textarea in the edit panel to define options
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

    // 2. End Page Field
    registerField('endPage', {
        name: 'endPage',
        label: 'صفحه پایان',
        icon: '🏁',
        extends: 'paragraph',
        config: {
            label: 'از وقتی که گذاشتید سپاسگزاریم!',
            subtype: 'p',
            className: 'end-page-paragraph'
        }
    });

    // 3. Static Text Field (متن بدون پاسخ)
    registerField('staticText', {
        name: 'staticText',
        label: 'متن بدون پاسخ',
        icon: '¶',
        extends: 'paragraph',
        config: {
            label: 'این یک متن راهنما برای کاربران است.',
            className: 'static-text-paragraph'
        }
    });

    // 4. Field Group (گروه سوال)
    registerField('fieldGroup', {
        name: 'fieldGroup',
        label: 'گروه سوال',
        icon: '🗂️',
        extends: 'header',
        config: {
            label: 'عنوان گروه سوالات',
            subtype: 'h3', // A smaller heading for grouping
            className: 'field-group-header'
        }
    });

    // 5. Advanced Validated Text Field
    const validationTypes = {
        'none': { label: 'هیچکدام', pattern: '', placeholder: 'متن دلخواه...' },
        'email': { label: 'ایمیل', pattern: '^\\S+@\\S+\\.\\S+$', placeholder: 'example@domain.com' },
        'url': { label: 'آدرس سایت (URL)', pattern: '^(https?|ftp):\\/\\/[^\\s\\/$.?#].[^\\s]*$', placeholder: 'https://example.com' },
        'iranianMobile': { label: 'تلفن همراه ایران', pattern: '^(09|\\+989)\\d{9}$', placeholder: '09123456789' },
        'persianChars': { label: 'حروف فارسی', pattern: '^[\\u0600-\\u06FF\\s]+$', placeholder: 'فقط حروف فارسی' },
        'englishChars': { label: 'حروف انگلیسی', pattern: '^[a-zA-Z\\s]+$', placeholder: 'Only English letters' },
        'digits': { label: 'عدد (انگلیسی)', pattern: '^\\d+$', placeholder: '12345' },
        'persianDigits': { label: 'عدد (فارسی)', pattern: '^[۰-۹]+$', placeholder: '۱۲۳۴۵' },
    };

    registerField('validatedText', {
        name: 'validatedText',
        label: 'متن با اعتبارسنجی',
        icon: '✔️',
        extends: 'text',
        config: {
            // Add a custom property to our field's data
            validationType: 'none'
        },
        // This function runs when the edit panel for the field is rendered
        onrender: function(event) {
            const field = this;
            const fieldData = field.data;

            // Create the validation dropdown
            const dropdownLabel = field.markup('label', I18N.validation, { className: 'prop-label' });
            const options = Object.entries(validationTypes).map(([key, { label }]) => {
                const optionAttrs = { value: key };
                if (key === fieldData.validationType) {
                    optionAttrs.selected = true;
                }
                return field.markup('option', label, optionAttrs);
            });
            const dropdown = field.markup('select', options, { className: 'prop-value' });

            // Event listener for the dropdown
            $(dropdown).on('change', function(e) {
                const newType = e.target.value;
                fieldData.validationType = newType;

                const validation = validationTypes[newType];
                const inputField = field.element.querySelector('.fld-input');

                // Update placeholder and pattern attributes
                if (inputField) {
                    inputField.setAttribute('placeholder', validation.placeholder);
                    if (validation.pattern) {
                        inputField.setAttribute('pattern', validation.pattern);
                    } else {
                        inputField.removeAttribute('pattern');
                    }
                }
                // Also update the config in the field's data to save it
                field.data.placeholder = validation.placeholder;
            });

            // Find the placeholder input in the edit panel and insert our dropdown after it
            const placeholderInput = event.target.querySelector('[name="fld-placeholder"]');
            if (placeholderInput) {
                const container = field.markup('div', [dropdownLabel, dropdown], {className: 'form-group prop-wrap'});
                placeholderInput.parentElement.after(container);
            }
        }
    });

})(jQuery);