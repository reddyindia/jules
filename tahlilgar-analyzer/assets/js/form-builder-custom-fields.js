(function($) {
    'use strict';

    if (typeof $.fn.formBuilder === 'undefined') { return; }

    const registerField = $.fn.formBuilder.registerField;

    // --- The Final, Correctly Rebuilt, Fully Configurable Short Text field ---
    registerField('shortText', {
        name: 'shortText',
        label: 'متن کوتاه',
        icon: 'T',

        build: function(value) {
            // This function is for the display in the builder canvas, not the final form.
            // It's kept simple for performance. The final renderer will use all attributes.
            const config = this.config;
            const attrs = config.attrs || {};
            const input = this.markup('input', null, {
                type: attrs.type || 'text',
                className: `fld-input ${attrs.className || ''}`,
                placeholder: attrs.placeholder || ''
            });
            const label = this.markup('label', config.label || '', { className: 'fld-label' });
            const help = config.description ? this.markup('span', config.description, { className: 'tooltip-element', tooltip: config.description }) : '';
            return this.markup('div', [label, help, input]);
        },

        onrender: function(event) {
            const field = this;
            const config = field.config;
            config.attrs = config.attrs || {};

            const settingsPanel = $(event.target);
            settingsPanel.empty();

            // Helper to create a setting row
            const createSettingRow = (labelText, inputMarkup, helpText = '') => {
                const label = field.markup('label', labelText, { className: 'prop-label' });
                const help = helpText ? field.markup('span', helpText, {className: 'prop-help'}) : '';
                return field.markup('div', [label, inputMarkup, help], { className: 'form-group prop-wrap' });
            };

            // --- General Settings ---
            const labelInput = field.markup('input', null, { type: 'text', name: 'label', value: config.label || '', className: 'prop-value' });
            $(labelInput).on('input', e => { config.label = e.target.value; });
            settingsPanel.append(createSettingRow('عنوان فیلد (Label)', labelInput));

            const helpInput = field.markup('input', null, { type: 'text', name: 'description', value: config.description || '', className: 'prop-value' });
            $(helpInput).on('input', e => { config.description = e.target.value; });
            settingsPanel.append(createSettingRow('متن راهنما', helpInput));

            const placeholderInput = field.markup('input', null, { type: 'text', name: 'placeholder', value: config.attrs.placeholder || '', className: 'prop-value' });
            $(placeholderInput).on('input', e => { config.attrs.placeholder = e.target.value; });
            settingsPanel.append(createSettingRow('متن جایگزین (Placeholder)', placeholderInput));

            // --- Behavior Settings ---
            const requiredInput = field.markup('input', null, { type: 'checkbox', name: 'required', checked: config.required || false });
            $(requiredInput).on('change', e => { config.required = e.target.checked; });
            settingsPanel.append(field.markup('div', [requiredInput, field.markup('label', 'این فیلد اجباری است', {className: 'prop-label-inline'})], { className: 'form-group prop-wrap' }));

            // --- Validation Settings ---
            const validationTypes = { 'text': 'متن', 'email': 'ایمیل', 'url': 'آدرس سایت', 'tel': 'تلفن', 'number': 'عدد' };
            const validationOptions = Object.entries(validationTypes).map(([value, label]) =>
                field.markup('option', label, { value, selected: value === (config.attrs.type || 'text') })
            );
            const validationSelect = field.markup('select', validationOptions, { name: 'type', className: 'prop-value' });
            $(validationSelect).on('change', e => { config.attrs.type = e.target.value; });
            settingsPanel.append(createSettingRow('نوع اعتبارسنجی', validationSelect));

            const minLengthInput = field.markup('input', null, { type: 'number', name: 'minlength', value: config.attrs.minlength || '', className: 'prop-value' });
            $(minLengthInput).on('input', e => { config.attrs.minlength = e.target.value; });
            settingsPanel.append(createSettingRow('حداقل طول کاراکتر', minLengthInput));

            const maxLengthInput = field.markup('input', null, { type: 'number', name: 'maxlength', value: config.attrs.maxlength || '', className: 'prop-value' });
            $(maxLengthInput).on('input', e => { config.attrs.maxlength = e.target.value; });
            settingsPanel.append(createSettingRow('حداکثر طول کاراکتر', maxLengthInput));

            const patternInput = field.markup('input', null, { type: 'text', name: 'pattern', value: config.attrs.pattern || '', className: 'prop-value' });
            $(patternInput).on('input', e => { config.attrs.pattern = e.target.value; });
            settingsPanel.append(createSettingRow('الگوی مجاز (RegEx)', patternInput, 'در صورت پر کردن، این گزینه بر نوع اعتبارسنجی اولویت دارد.'));
        }
    });

    // --- 2. Welcome Page ---
    registerField('welcomePage', {
        name: 'welcomePage',
        label: 'صفحه خوش‌آمدگویی',
        icon: '👋',
        build: function(value) {
            return this.markup('h1', this.config.label || 'به پرسشنامه ما خوش آمدید!', { className: 'welcome-page-header' });
        },
        onrender: function(event) {
            const field = this;
            const config = field.config;
            const settingsPanel = $(event.target);
            settingsPanel.empty();
            const labelInput = field.markup('input', null, { type: 'text', name: 'label', value: config.label || 'به پرسشنامه ما خوش آمدید!', className: 'prop-value' });
            $(labelInput).on('input', e => { config.label = e.target.value; });
            const labelLabel = field.markup('label', 'عنوان صفحه', { className: 'prop-label' });
            settingsPanel.append(field.markup('div', [labelLabel, labelInput], { className: 'form-group prop-wrap' }));
        }
    });

    // --- 3. End Page ---
    registerField('endPage', {
        name: 'endPage',
        label: 'صفحه پایان',
        icon: '🏁',
        extends: 'paragraph', // Use paragraph as base for rich text editor
        config: { label: 'از وقتی که گذاشتید سپاسگزاریم!' },
        onrender: function(event) {
            // Hide unnecessary default settings
            $(event.target).find('.fld-className-wrap, .fld-name-wrap').hide();
        }
    });

    // --- 4. Question Group ---
    registerField('questionGroup', {
        name: 'questionGroup',
        label: 'گروه سوال',
        icon: '🗂️',
        extends: 'header',
        config: { label: 'عنوان گروه', subtype: 'h3' },
        onrender: (event) => {
            // Hide unnecessary default settings
            $(event.target).find('.fld-subtype-wrap, .fld-className-wrap, .fld-name-wrap').hide();
        }
    });

    // --- 5. Static Text ---
    registerField('staticText', {
        name: 'staticText',
        label: 'متن بدون پاسخ',
        icon: 'ℹ️',
        extends: 'paragraph',
        onrender: (event) => {
            // Hide unnecessary default settings
            $(event.target).find('.fld-className-wrap, .fld-name-wrap').hide();
        }
    });

    // --- 6. Long Text ---
    registerField('longText', {
        name: 'longText',
        label: 'متن بلند',
        icon: '📝',
        extends: 'textarea' // This provides all necessary settings like label, help, placeholder, required, rows.
    });

    // --- 7. Multiple Choice ---
    registerField('multipleChoice', {
        name: 'multipleChoice',
        label: 'چند‌گزینه‌ای',
        icon: '☑️',
        extends: 'checkbox-group' // Provides the options editor
    });

    // --- 8. Dropdown List ---
    registerField('dropdownList', {
        name: 'dropdownList',
        label: 'لیست کشویی',
        icon: '🔻',
        extends: 'select' // Provides the options editor
    });

    // --- 9. Ranking ---
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
            // Also hide the "inline" and "toggle" options which don't apply to ranking lists.
            $(event.target).find('.fld-inline-wrap, .fld-toggle-wrap').hide();
        }
    });

    // --- 10. Rating ---
    registerField('ratingScale', {
        name: 'ratingScale',
        label: 'درجه‌بندی',
        icon: '⭐',
        extends: 'radio-group',
        config: {
            label: 'امتیاز شما چیست؟',
            inline: true,
            options: [
                { label: '★', value: '1' }, { label: '★', value: '2' }, { label: '★', value: '3' }, { label: '★', value: '4' }, { label: '★', value: '5' }
            ]
        },
        onrender: function(event) {
            const field = this;
            const settingsPanel = $(event.target);
            settingsPanel.find('.fld-options-wrap').hide(); // Hide default options editor
            const maxLabel = field.markup('label', 'تعداد ستاره (۱ تا ۱۰)', { className: 'prop-label' });
            const maxInput = field.markup('input', null, { type: 'number', value: field.config.options.length, min: 1, max: 10, className: 'prop-value' });
            $(maxInput).on('input', function(e) {
                const count = Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 0));
                const newOptions = [];
                for (let i = 1; i <= count; i++) {
                    newOptions.push({ label: '★', value: String(i), selected: false });
                }
                field.config.options = newOptions;
            });
            const customSetting = field.markup('div', [maxLabel, maxInput], { className: 'form-group prop-wrap' });
            settingsPanel.find('.fld-inline-wrap').after(customSetting);
        }
    });

    // --- 11. File Upload ---
    registerField('fileUpload', {
        name: 'fileUpload',
        label: 'آپلود فایل',
        icon: '📎',
        extends: 'file' // Default settings for file type and multiple are sufficient
    });

})(jQuery);