(function($) {
    'use strict';

    if (typeof $.fn.formBuilder === 'undefined') { return; }

    const registerField = $.fn.formBuilder.registerField;

    // --- 1. The new, fully configurable Short Text field ---
    registerField('shortText', {
        name: 'shortText',
        label: 'متن کوتاه',
        icon: 'T',

        // The `build` function defines the field's appearance in the form builder stage.
        build: function(value) {
            const config = this.config;
            const attrs = config.attrs || {};

            const input = this.markup('input', null, {
                type: 'text',
                value: value,
                placeholder: attrs.placeholder || '',
                className: 'fld-input'
            });
            const labelMarkup = this.markup('label', config.label || 'متن کوتاه', { className: 'fld-label' });
            const helpText = config.description ? this.markup('span', config.description, { className: 'tooltip-element', tooltip: config.description }) : '';

            return this.markup('div', [labelMarkup, helpText, input], { className: 'form-group short-text-field' });
        },

        // The `onrender` function defines the settings/edit panel for the field.
        onrender: function(event) {
            const field = this;
            const config = field.config;
            config.attrs = config.attrs || {}; // Ensure attrs object exists

            const settingsPanel = $(event.target);
            settingsPanel.empty(); // Clear default settings to build our own from scratch

            // --- Settings Fields ---

            // 1. Label (عنوان)
            const labelInput = field.markup('input', null, { type: 'text', name: 'label', value: config.label || '', className: 'prop-value' });
            $(labelInput).on('input', e => { config.label = e.target.value; });
            const labelLabel = field.markup('label', 'عنوان فیلد', { className: 'prop-label' });
            settingsPanel.append(field.markup('div', [labelLabel, labelInput], { className: 'form-group prop-wrap' }));

            // 2. Help Text (متن راهنما)
            const helpInput = field.markup('input', null, { type: 'text', name: 'description', value: config.description || '', className: 'prop-value' });
            $(helpInput).on('input', e => { config.description = e.target.value; });
            const helpLabel = field.markup('label', 'متن راهنما (اختیاری)', { className: 'prop-label' });
            settingsPanel.append(field.markup('div', [helpLabel, helpInput], { className: 'form-group prop-wrap' }));

            // 3. Placeholder (متن جایگزین)
            const placeholderInput = field.markup('input', null, { type: 'text', name: 'placeholder', value: config.attrs.placeholder || '', className: 'prop-value' });
            $(placeholderInput).on('input', e => { config.attrs.placeholder = e.target.value; });
            const placeholderLabel = field.markup('label', 'متن جایگزین (Placeholder)', { className: 'prop-label' });
            settingsPanel.append(field.markup('div', [placeholderLabel, placeholderInput], { className: 'form-group prop-wrap' }));

            // 4. Required (اجباری بودن)
            const requiredInput = field.markup('input', null, { type: 'checkbox', name: 'required', checked: config.required || false, className: 'prop-value' });
            $(requiredInput).on('change', e => { config.required = e.target.checked; });
            const requiredLabel = field.markup('label', 'این فیلد اجباری است', { className: 'prop-label' });
            settingsPanel.append(field.markup('div', [requiredLabel, requiredInput], { className: 'form-group prop-wrap' }));

            // 5. Validation Type (نوع اعتبارسنجی)
            const validationTypes = { '': 'هیچکدام', 'email': 'ایمیل', 'url': 'آدرس سایت', 'tel': 'تلفن', 'number': 'عدد' };
            const validationLabel = field.markup('label', 'نوع اعتبارسنجی', { className: 'prop-label' });
            const validationOptions = Object.entries(validationTypes).map(([value, label]) =>
                field.markup('option', label, { value, selected: value === (config.attrs.type || '') })
            );
            const validationSelect = field.markup('select', validationOptions, { name: 'type', className: 'prop-value' });
            $(validationSelect).on('change', e => { config.attrs.type = e.target.value; });
            settingsPanel.append(field.markup('div', [validationLabel, validationSelect], { className: 'form-group prop-wrap' }));
        }
    });

})(jQuery);