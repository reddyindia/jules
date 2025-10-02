jQuery(document).ready(function($) {
    if (typeof jQuery.fn.formBuilder === 'function') {
        const options = {
            // Internationalization options
            i18n: {
                locale: 'fa-IR',
                location: 'https://cdn.jsdelivr.net/gh/dr-pro/form-builder-translations/lang/',
                override: {
                    'fa-IR': {
                        // Custom Fields
                        welcome_page: 'صفحه خوش‌آمدگویی',
                        question_group: 'گروه سوال',
                        end_page: 'صفحه پایانی',
                        // Standard Fields
                        starRating: 'امتیازدهی',
                        text: 'متن کوتاه',
                        textarea: 'متن بلند',
                        select: 'لیست کشویی',
                        'radio-group': 'چندگزینه‌ای',
                        paragraph: 'متن ثابت',
                        file: 'آپلود فایل',
                        // Other UI elements
                        addOption: 'افزودن گزینه',
                        label: 'عنوان',
                        description: 'توضیحات',
                        placeholder: 'متن راهنما (Placeholder)',
                        required: 'ضروری',
                        className: 'کلاس CSS',
                    }
                }
            },
            // Disable default action buttons
            disabledActionButtons: ['data', 'save', 'clear'],

            // Disable unwanted default fields instead of replacing all of them
            disableFields: [
                'autocomplete',
                'button',
                'hidden',
                'header',
                'checkbox-group',
                'date',
                'number'
            ],

            // Add new custom fields
            fields: [
                {
                    label: 'صفحه خوش‌آمدگویی',
                    type: 'welcome_page',
                    icon: '👋',
                    attrs: {
                        description: { label: 'توضیحات', type: 'textarea' }
                    }
                },
                {
                    label: 'گروه سوال',
                    type: 'question_group',
                    icon: '❓',
                    attrs: {
                         description: { label: 'توضیحات', type: 'textarea' }
                    }
                },
                {
                    label: 'صفحه پایانی',
                    type: 'end_page',
                    icon: '🏁',
                    attrs: {
                        description: { label: 'توضیحات', type: 'textarea' }
                    }
                }
            ],

            // Define basic templates for custom fields
            templates: {
                welcome_page: fieldData => ({ field: `<div id="${fieldData.name}" class="welcome-page-template"></div>` }),
                end_page: fieldData => ({ field: `<div id="${fieldData.name}" class="end-page-template"></div>` }),
                question_group: fieldData => ({ field: `<fieldset id="${fieldData.name}" class="question-group-template"><legend>${fieldData.label}</legend></fieldset>` }),
            },

            // Disable unnecessary attributes for a cleaner interface
            typeUserDisabledAttrs: {
                'welcome_page': ['name', 'required', 'placeholder', 'className', 'access', 'value', 'subtype'],
                'end_page': ['name', 'required', 'placeholder', 'className', 'access', 'value', 'subtype'],
                'question_group': ['name', 'required', 'placeholder', 'className', 'access', 'value'],
                'paragraph': ['name', 'className', 'access', 'subtype', 'required'],
                'starRating': ['name', 'required', 'description', 'access', 'className'],
                'file': ['name', 'description', 'access', 'subtype', 'multiple', 'placeholder'],
                'text': ['name', 'access', 'subtype', 'maxlength', 'className'],
                'textarea': ['name', 'access', 'subtype', 'maxlength', 'rows', 'className'],
                'select': ['name', 'access', 'multiple', 'className'],
                'radio-group': ['name', 'access', 'other', 'inline', 'className'],
            },
        };

        const formBuilder = $('#form-builder-container').formBuilder(options);
        const statusDiv = $('#form-builder-status');

        // --- HTMX Integration ---
        document.body.addEventListener('htmx:afterOnLoad', function(evt) {
            if (evt.detail.successful && evt.detail.pathInfo.requestPath === tahlilgar_form_builder.rest_url) {
                statusDiv.text('فرم با موفقیت ذخیره شد!').css('color', 'green');
                setTimeout(function() {
                    window.location.href = tahlilgar_form_builder.management_url;
                }, 1500);
            }
        });

        document.body.addEventListener('htmx:responseError', function(evt) {
            if (evt.detail.pathInfo.requestPath === tahlilgar_form_builder.rest_url) {
                const errorMsg = evt.detail.xhr.responseJSON ? evt.detail.xhr.responseJSON.message : 'خطایی در هنگام ذخیره فرم رخ داد.';
                statusDiv.text('خطا: ' + errorMsg).css('color', 'red');
            }
        });

        $('#save-form-button').on('click', function() {
            const formTitle = $('#form-title').val().trim();
            const formData = formBuilder.actions.getData('json');

            if (!formTitle) {
                statusDiv.text('لطفاً یک عنوان برای فرم وارد کنید.').css('color', 'red');
                return;
            }
            if (!formData || formData === '[]') {
                 statusDiv.text('لطفاً حداقل یک فیلد به فرم اضافه کنید.').css('color', 'red');
                return;
            }

            statusDiv.text('در حال ذخیره فرم...').css('color', 'blue');

            htmx.ajax('POST', tahlilgar_form_builder.rest_url, {
                headers: {
                    'X-WP-Nonce': tahlilgar_form_builder.nonce
                },
                values: {
                    form_title: formTitle,
                    form_data: formData
                }
            });
        });
    } else {
        $('#form-builder-container').html('<p style="color:red;">خطا: کتابخانه Form Builder بارگذاری نشده است.</p>');
    }
});