jQuery(document).ready(function($) {
    if (typeof jQuery.fn.formBuilder === 'function') {
        // Define advanced subtypes for the text field
        const textSubtypes = {
            text: {
                label: 'متن آزاد',
            },
            email: {
                label: 'ایمیل',
                // The library has built-in email validation
            },
            mobile_ir: {
                label: 'موبایل ایران',
                pattern: '^09[0-9]{9}$',
                placeholder: '09123456789',
            },
            national_id_ir: {
                label: 'کد ملی ایران',
                pattern: '^\\d{10}$',
                placeholder: '1234567890',
            },
            postal_code_ir: {
                label: 'کد پستی ایران',
                pattern: '^\\d{10}$',
            },
            tel: {
                label: 'تلفن ثابت',
                pattern: '^0\\d{2,3}\\d{8}$',
            },
            fa_letters: {
                label: 'فقط حروف فارسی',
                pattern: '^[\\u0600-\\u06FF\\s]+$',
            },
            en_letters: {
                label: 'فقط حروف انگلیسی',
                pattern: '^[a-zA-Z\\s]+$',
            },
            ip: {
                label: 'آدرس IP',
                pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
            },
            time: {
                label: 'زمان (HH:MM)',
                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            },
            date_jalali: {
                label: 'تاریخ شمسی (yyyy/mm/dd)',
                pattern: '^1[34]\\d{2}\\/(0?[1-9]|1[012])\\/(0?[1-9]|[12][0-9]|3[01])$',
            },
            date_greg: {
                label: 'تاریخ میلادی (yyyy-mm-dd)',
                pattern: '^\\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$',
            },
        };

        const options = {
            // Setup translations for all fields and new subtypes
            i18n: {
                locale: 'fa-IR',
                preloaded: {
                    'fa-IR': {
                        // Standard Fields
                        text: 'پاسخ کوتاه',
                        textarea: 'پاسخ طولانی',
                        select: 'لیست کشویی',
                        'radio-group': 'چند گزینه‌ای',
                        'checkbox-group': 'چند گزینه‌ای (چک‌باکس)',
                        number: 'عدد',
                        date: 'تاریخ',
                        file: 'آپلود فایل',
                        starRating: 'امتیازدهی',
                        paragraph: 'متن ثابت',
                        // Subtypes
                        ...Object.keys(textSubtypes).reduce((acc, key) => {
                            acc[key] = textSubtypes[key].label;
                            return acc;
                        }, {}),
                        // Other UI elements
                        addOption: 'افزودن گزینه',
                        label: 'عنوان سوال',
                        description: 'توضیحات',
                        placeholder: 'متن راهنما',
                        required: 'ضروری',
                        subtype: 'نوع اعتبارسنجی',
                        'remove': 'حذف',
                    }
                }
            },

            // Define subtypes for the text field
            subtypes: {
                text: textSubtypes,
            },

            disabledActionButtons: ['data', 'save', 'clear'],
            disableFields: ['autocomplete', 'button', 'hidden', 'header'],
        };

        const formBuilder = $('#form-builder-container').formBuilder(options);
        const statusDiv = $('#form-builder-status');

        // Save form handler
        $('#save-form-button').on('click', function() {
            const formTitle = $('#form-title').val().trim();
            const formSchema = formBuilder.actions.getData();

            if (!formTitle) {
                statusDiv.text('لطفاً یک عنوان برای فرم وارد کنید.').css('color', 'red');
                return;
            }
            if (!formSchema || formSchema.length === 0) {
                 statusDiv.text('لطفاً حداقل یک فیلد به فرم اضافه کنید.').css('color', 'red');
                return;
            }

            statusDiv.text('در حال ذخیره فرم...').css('color', 'blue');

            $.ajax({
                url: arshline_options.rest_url,
                method: 'POST',
                contentType: 'application/json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', arshline_options.nonce);
                },
                data: JSON.stringify({
                    title: formTitle,
                    schema: formSchema
                }),
                success: function(response) {
                    statusDiv.text('فرم با موفقیت ذخیره شد!').css('color', 'green');
                    setTimeout(function() {
                        // This will be fixed in the next phase
                        window.location.href = '/form-management';
                    }, 1500);
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'خطایی در هنگام ذخیره فرم رخ داد.';
                    statusDiv.text('خطا: ' + errorMsg).css('color', 'red');
                }
            });
        });
    } else {
        $('#form-builder-container').html('<p style="color:red;">خطا: کتابخانه Form Builder بارگذاری نشده است.</p>');
    }
});