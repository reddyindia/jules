jQuery(function($) {
    'use strict';

    function initializePlugin() {

        // --- Custom Fields Definition ---
        const registerField = $.fn.formBuilder.registerField;

        // 1. Fully Configurable Short Text Field
        registerField('shortText', {
            name: 'shortText',
            label: 'متن کوتاه',
            icon: 'T',
            build: function(value) {
                const config = this.config;
                const attrs = config.attrs || {};
                const input = this.markup('input', null, {
                    type: attrs.type || 'text',
                    className: `fld-input ${attrs.className || ''}`,
                    placeholder: attrs.placeholder || '',
                    required: config.required || false,
                });
                const label = this.markup('label', config.label || 'متن کوتاه', { className: 'fld-label' });
                const help = config.description ? this.markup('span', config.description, { className: 'tooltip-element', tooltip: config.description }) : '';
                return this.markup('div', [label, help, input]);
            },
            onrender: function(event) {
                const field = this;
                const config = field.config;
                config.attrs = config.attrs || {};
                const settingsPanel = $(event.target);
                settingsPanel.empty();
                const createSettingRow = (labelText, inputMarkup, helpText = '') => {
                    const label = field.markup('label', labelText, { className: 'prop-label' });
                    const help = helpText ? field.markup('span', helpText, {className: 'prop-help'}) : '';
                    return field.markup('div', [label, inputMarkup, help], { className: 'form-group prop-wrap' });
                };
                const labelInput = field.markup('input', null, { type: 'text', name: 'label', value: config.label || '', className: 'prop-value' });
                $(labelInput).on('input', e => { config.label = e.target.value; });
                settingsPanel.append(createSettingRow('عنوان فیلد (Label)', labelInput));
                const helpInput = field.markup('input', null, { type: 'text', name: 'description', value: config.description || '', className: 'prop-value' });
                $(helpInput).on('input', e => { config.description = e.target.value; });
                settingsPanel.append(createSettingRow('متن راهنما (اختیاری)', helpInput));
                const placeholderInput = field.markup('input', null, { type: 'text', name: 'placeholder', value: config.attrs.placeholder || '', className: 'prop-value' });
                $(placeholderInput).on('input', e => { config.attrs.placeholder = e.target.value; });
                settingsPanel.append(createSettingRow('متن جایگزین (Placeholder)', placeholderInput));
                const requiredInput = field.markup('input', null, { type: 'checkbox', name: 'required', checked: config.required || false });
                $(requiredInput).on('change', e => { config.required = e.target.checked; });
                settingsPanel.append(field.markup('div', [requiredInput, field.markup('label', 'این فیلد اجباری است', {className: 'prop-label-inline'})], { className: 'form-group prop-wrap' }));
                const validationTypes = { 'text': 'متن', 'email': 'ایمیل', 'url': 'آدرس سایت', 'tel': 'تلفن', 'number': 'عدد' };
                const validationOptions = Object.entries(validationTypes).map(([value, label]) => field.markup('option', label, { value, selected: value === (config.attrs.type || 'text') }));
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

        // --- Form Builder Initialization ---
        const fbWrap = document.getElementById('form-builder-wrap');
        if (!fbWrap) { return; }

        const options = {
            i18n: { locale: 'fa-IR', location: 'https://formbuilder.online/assets/lang/' },
            disabledActionButtons: ['data', 'save'],
            controlOrder: ['shortText'], // Temporarily focused on one field for validation
            disableFields: [ 'autocomplete', 'button', 'checkbox-group', 'date', 'file', 'header', 'hidden', 'number', 'paragraph', 'radio-group', 'select', 'starRating', 'text', 'textarea' ],
            messages: { save: 'ذخیره', clearAll: 'پاک کردن همه', clearAllMessage: 'آیا مطمئن هستید؟', close: 'بستن' }
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
    }

    // --- Smart Polling Loader ---
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds timeout
    const interval = setInterval(function() {
        if (typeof $.fn.formBuilder !== 'undefined') {
            clearInterval(interval);
            initializePlugin();
        } else if (attempts > maxAttempts) {
            clearInterval(interval);
            console.error("Form Builder library did not load in time.");
        }
        attempts++;
    }, 100);
});