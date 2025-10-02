jQuery(document).ready(function($) {
    'use strict';

    if (typeof tahlilgar_renderer_data === 'undefined') {
        console.error('Form renderer data is not available.');
        return;
    }

    const { form_id, form_json, submission_url, nonce } = tahlilgar_renderer_data;
    const renderContainerId = '#tahlilgar-form-render-' + form_id;
    const $container = $(renderContainerId);

    if ($container.length === 0) {
        console.error('Form render container not found: ' + renderContainerId);
        return;
    }

    if (!form_json || form_json.length === 0) {
        $container.html('<p style="color: red;">Form data is empty or invalid.</p>');
        return;
    }

    const renderOpts = {
        formData: form_json,
    };

    const formRenderInstance = $container.formRender(renderOpts);

    // Append a wrapper for the button and messages
    $container.append(`
        <div class="form-submission-wrapper">
            <button type="submit" class="btn btn-primary tahlilgar-submit-btn">ارسال پاسخ</button>
            <div class="submission-message" style="display:none; margin-top:15px;"></div>
        </div>
    `);

    $container.on('click', '.tahlilgar-submit-btn', async function(e) {
        e.preventDefault();
        const $button = $(this);
        const $messageDiv = $container.find('.submission-message');

        $button.prop('disabled', true).text('در حال ارسال...');
        $messageDiv.hide();

        const submissionData = formRenderInstance.userData;

        try {
            const response = await fetch(submission_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                },
                body: JSON.stringify(submissionData)
            });

            const data = await response.json();

            if (response.ok) {
                $messageDiv.css('color', 'green').text('پاسخ شما با موفقیت ثبت شد. سپاسگزاریم!').show();
                $container.find('form').hide(); // Hide the form on success
                $button.hide();
            } else {
                const errorMessage = data.message || 'یک خطای ناشناخته رخ داد.';
                $messageDiv.css('color', 'red').text('خطا: ' + errorMessage).show();
                $button.prop('disabled', false).text('ارسال پاسخ');
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            $messageDiv.css('color', 'red').text('یک خطای ارتباطی با سرور رخ داد. لطفاً دوباره تلاش کنید.').show();
            $button.prop('disabled', false).text('ارسال پاسخ');
        }
    });
});