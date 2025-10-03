jQuery(document).ready(function($) {
    const options = window.arshline_viewer_options;
    if (!options || !options.form_schema) {
        console.error('Arshline Viewer: Form data is missing.');
        $('#arshline-form-render-area').text('خطا: اطلاعات فرم یافت نشد.');
        return;
    }

    const formContainer = $('#arshline-form-render-area');
    const statusDiv = $('#arshline-form-status');

    // Render the form
    const formRenderInstance = formContainer.formRender({
        formData: options.form_schema
    });

    // Add a submit button
    formContainer.append('<button type="submit" class="arshline-submit-button">ارسال پاسخ</button>');

    // Handle form submission
    formContainer.on('submit', function(e) {
        e.preventDefault();
        const userData = formRenderInstance.userData;

        if (!userData) {
            statusDiv.text('لطفاً حداقل یک فیلد را پر کنید.').css('color', 'red');
            return;
        }

        statusDiv.text('در حال ارسال...').css('color', 'blue');
        formContainer.find('button').prop('disabled', true);

        $.ajax({
            url: options.submission_url,
            method: 'POST',
            contentType: 'application/json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', options.nonce);
            },
            data: JSON.stringify({
                form_id: options.form_id,
                submission_data: userData,
            }),
            success: function(response) {
                formContainer.html('<div class="arshline-form-success">پاسخ شما با موفقیت ثبت شد. متشکریم!</div>');
            },
            error: function(xhr) {
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'خطایی در هنگام ارسال پاسخ رخ داد.';
                statusDiv.text('خطا: ' + errorMsg).css('color', 'red');
                formContainer.find('button').prop('disabled', false);
            }
        });
    });
});