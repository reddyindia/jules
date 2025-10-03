jQuery(document).ready(function($) {
    const form = $('#ai-settings-form');
    const statusDiv = $('#ai-settings-status');
    const baseUrlInput = $('#ai_base_url');
    const apiKeyInput = $('#ai_api_key');

    // Function to load initial settings
    function loadSettings() {
        if (!window.arshline_settings_options) {
            statusDiv.text('خطای پیکربندی.').css('color', 'red');
            return;
        }

        statusDiv.text('در حال بارگذاری تنظیمات...').css('color', 'blue');

        $.ajax({
            url: arshline_settings_options.rest_url,
            method: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', arshline_settings_options.nonce);
            },
            success: function(response) {
                baseUrlInput.val(response.ai_base_url);
                if (response.ai_api_key_set) {
                    apiKeyInput.attr('placeholder', '•••••••••••••••• (ذخیره شده)');
                } else {
                    apiKeyInput.attr('placeholder', '');
                }
                statusDiv.text('تنظیمات بارگذاری شد.').css('color', 'green').fadeOut(2000);
            },
            error: function() {
                statusDiv.text('خطا در بارگذاری تنظیمات.').css('color', 'red');
            }
        });
    }

    // Handle form submission
    form.on('submit', function(e) {
        e.preventDefault();
        statusDiv.text('در حال ذخیره...').css('color', 'blue').show();

        const data = {
            ai_base_url: baseUrlInput.val(),
            ai_api_key: apiKeyInput.val(), // Send the new key only if it's entered
        };

        $.ajax({
            url: arshline_settings_options.rest_url,
            method: 'POST',
            contentType: 'application/json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', arshline_settings_options.nonce);
            },
            data: JSON.stringify(data),
            success: function(response) {
                statusDiv.text('تنظیمات با موفقیت ذخیره شد.').css('color', 'green').fadeOut(3000);
                // Clear the API key field and update placeholder after saving
                apiKeyInput.val('');
                loadSettings();
            },
            error: function(xhr) {
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'خطا در ذخیره تنظیمات.';
                statusDiv.text('خطا: ' + errorMsg).css('color', 'red');
            }
        });
    });

    // Initial load
    loadSettings();
});