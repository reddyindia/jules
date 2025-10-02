jQuery(document).ready(function($) {
    const rendererData = window.tahlilgar_renderer_data;
    if (!rendererData || !rendererData.form_json) {
        console.error('Tahlilgar Renderer: Form data is missing.');
        return;
    }

    const formContainerId = '#tahlilgar-form-render-' + rendererData.form_id;
    const formContainer = $(formContainerId);

    if (formContainer.length === 0) {
        console.error('Tahlilgar Renderer: Form container not found.');
        return;
    }

    // Render the form
    const formRenderInstance = formContainer.formRender({
        formData: rendererData.form_json
    });

    // Add a submit button if one doesn't exist
    if (formContainer.find('button[type="submit"]').length === 0) {
        formContainer.append('<button type="submit" class="tahlilgar-submit-button">ارسال</button>');
    }

    // Add a div for status messages
    formContainer.append('<div class="tahlilgar-form-status" style="margin-top: 15px;"></div>');


    formContainer.on('submit', function(e) {
        e.preventDefault();
        const statusDiv = formContainer.find('.tahlilgar-form-status');
        const submitButton = formContainer.find('button[type="submit"]');

        const userData = formRenderInstance.userData;

        if (!userData) {
            statusDiv.text('لطفاً فرم را پر کنید.').css('color', 'red');
            return;
        }

        statusDiv.text('در حال ارسال پاسخ...').css('color', 'blue');
        submitButton.prop('disabled', true);

        $.ajax({
            url: rendererData.submission_url,
            method: 'POST',
            contentType: 'application/json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', rendererData.nonce);
            },
            data: JSON.stringify(userData),
            success: function(response) {
                formContainer.html('<div class="tahlilgar-form-success">پاسخ شما با موفقیت ثبت شد. متشکریم!</div>');
            },
            error: function(xhr) {
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'خطایی در هنگام ارسال پاسخ رخ داد.';
                 statusDiv.text('خطا: ' + errorMsg).css('color', 'red');
                submitButton.prop('disabled', false);
            }
        });
    });
});