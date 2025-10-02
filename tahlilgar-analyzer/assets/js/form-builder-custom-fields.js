jQuery(document).ready(function($) {
    'use strict';

    if (typeof $.fn.formBuilder === 'undefined') {
        console.error("formBuilder not loaded, cannot register custom fields.");
        return;
    }

    const registerField = $.fn.formBuilder.registerField;

    // --- 1. The new, fully configurable Short Text field (Correct Implementation) ---
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
                value: value,
                placeholder: attrs.placeholder || '',
                required: config.required || false,
            });
            const labelMarkup = this.markup('label', config.label || 'متن کوتاه', { className: 'fld-label' });
            const helpText = config.description ? this.markup('span', config.description, { className: 'tooltip-element', tooltip: config.description }) : '';

            return this.markup('div', [labelMarkup, helpText, input], { className: 'form-group short-text-field' });
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

            const validationTypes = { '': 'هیچکدام', 'email': 'ایمیل', 'url': 'آدرس سایت', 'tel': 'تلفن', 'number': 'عدد' };
            const validationOptions = Object.entries(validationTypes).map(([value, label]) =>
                field.markup('option', label, { value, selected: value === (config.attrs.type || '') })
            );
            const validationSelect = field.markup('select', validationOptions, { name: 'type', className: 'prop-value' });
            $(validationSelect).on('change', e => { config.attrs.type = e.target.value; });
            settingsPanel.append(createSettingRow('نوع اعتبارسنجی', validationSelect));
        }
    });
});