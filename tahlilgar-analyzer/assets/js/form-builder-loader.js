jQuery(document).ready(function($) {
    if (typeof jQuery.fn.formBuilder === 'function') {
        const options = {
            // Use preloaded translations to ensure they are always applied
            i18n: {
                locale: 'fa-IR',
                preloaded: {
                    'fa-IR': {
                        // Field types
                        text: 'متن کوتاه',
                        textarea: 'متن بلند',
                        select: 'لیست کشویی',
                        'radio-group': 'دکمه رادیویی',
                        'checkbox-group': 'چک‌باکس چندگانه',
                        checkbox: 'چک‌باکس تکی',
                        number: 'عدد',
                        date: 'تاریخ',
                        file: 'آپلود فایل',
                        starRating: 'امتیازدهی',
                        paragraph: 'متن ثابت / جداکننده',
                        // Subtypes that appear in the UI
                        'text.email': 'ایمیل',
                        'text.tel': 'تلفن',
                        'text.url': 'آدرس وب',
                        'text.time': 'زمان',
                        // Common UI elements and attributes
                        addOption: 'افزودن گزینه',
                        label: 'عنوان (برچسب)',
                        description: 'توضیحات',
                        placeholder: 'متن راهنما (Placeholder)',
                        required: 'ضروری',
                        className: 'کلاس CSS',
                        'remove': 'حذف',
                        'edit': 'ویرایش',
                        'copy': 'کپی',
                        'Clear': 'پاک کردن همه',
                        'Save': 'ذخیره',
                        'get_data': 'دریافت داده',
                        'save_template': 'ذخیره قالب',
                        'add_field': 'افزودن فیلد',
                        'cancel': 'انصراف',
                        'close': 'بستن',
                        'options': 'گزینه‌ها',
                        'value': 'مقدار',
                        'min': 'حداقل',
                        'max': 'حداکثر',
                        'step': 'گام',
                        'toggle': 'حالت دکمه‌ای',
                        'inline': 'افقی',
                        'other': 'گزینه «سایر»',
                        'role': 'نقش',
                        'subtype': 'نوع فرعی',
                        'maxlength': 'حداکثر طول',
                        'rows': 'تعداد ردیف‌ها',
                        'multiple': 'چند انتخابی',
                        'access': 'دسترسی',
                        'all': 'همه',
                        'hidden': 'مخفی',
                        'header': 'هدر',
                        'button': 'دکمه',
                        'autocomplete': 'تکمیل خودکار',
                    }
                }
            },

            // Disable default action buttons
            disabledActionButtons: ['data', 'save', 'clear'],

            // Disable only the fields that are not part of the core requirement
            disableFields: [
                'autocomplete',
                'button',
                'hidden',
                'header' // 'paragraph' will be used for section breaks
            ],

            // A minimal set of disabled attributes to keep the UI clean
            typeUserDisabledAttrs: {
                'text': ['name', 'access'],
                'textarea': ['name', 'access'],
                'select': ['name', 'access'],
                'radio-group': ['name', 'access'],
                'checkbox-group': ['name', 'access'],
                'checkbox': ['name', 'access'],
                'number': ['name', 'access'],
                'date': ['name', 'access'],
                'file': ['name', 'access'],
                'starRating': ['name', 'access'],
                'paragraph': ['name', 'access'],
            },
        };

        const formBuilder = $('#form-builder-container').formBuilder(options);

        // This part handles saving the form via AJAX (jQuery)
        $('#save-form-button').on('click', function() {
            const formTitle = $('#form-title').val().trim();
            const formData = formBuilder.actions.getData('json');
            const statusDiv = $('#form-builder-status');

            if (!formTitle) {
                statusDiv.text('لطفاً یک عنوان برای فرم وارد کنید.').css('color', 'red');
                return;
            }
            if (!formData || formData === '[]') {
                 statusDiv.text('لطفاً حداقل یک فیلد به فرم اضافه کنید.').css('color', 'red');
                return;
            }

            statusDiv.text('در حال ذخیره فرم...').css('color', 'blue');

            $.ajax({
                url: tahlilgar_form_builder.rest_url,
                method: 'POST',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', tahlilgar_form_builder.nonce);
                },
                data: {
                    form_title: formTitle,
                    form_data: JSON.parse(formData)
                },
                success: function(response) {
                    statusDiv.text('فرم با موفقیت ذخیره شد!').css('color', 'green');
                    setTimeout(function() {
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