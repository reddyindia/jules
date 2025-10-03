jQuery(document).ready(function($) {
    const tableBody = $('#forms-table-body');
    const loadingMessage = $('#loading-message');
    const noFormsMessage = $('#no-forms-message');
    const formsTable = $('#forms-table');

    function renderRow(form) {
        const displayDate = new Date(form.created_at.replace(' ', 'T')).toLocaleDateString('fa-IR');
        const statusText = form.status === 'publish' ? 'منتشر شده' : 'پیش‌نویس';
        const statusClass = form.status === 'publish' ? 'status-published' : 'status-draft';
        const toggleButtonText = form.status === 'publish' ? 'لغو انتشار' : 'انتشار';
        const newStatus = form.status === 'publish' ? 'draft' : 'publish';

        return `
            <tr data-form-id="${form.id}">
                <td>${form.title}</td>
                <td><input type="text" value='${form.form_link}' readonly onfocus="this.select();" style="width: 100%; border: 1px solid #ccc; padding: 5px; background: #f9f9f9;"></td>
                <td><span class="submission-count">${form.submission_count}</span></td>
                <td><span class="status-label ${statusClass}">${statusText}</span></td>
                <td>${displayDate}</td>
                <td class="actions">
                    <a href="${form.results_link}" class="button">نتایج</a>
                    <button class="button button-primary button-toggle-status" data-form-id="${form.id}" data-new-status="${newStatus}">${toggleButtonText}</button>
                    <button class="button button-delete" data-form-id="${form.id}">حذف</button>
                </td>
            </tr>
        `;
    }

    function fetchForms() {
        if (!window.arshline_options) {
            loadingMessage.text('خطای پیکربندی.').css('color', 'red');
            return;
        }

        $.ajax({
            url: arshline_options.rest_url,
            method: 'GET',
            beforeSend: xhr => xhr.setRequestHeader('X-WP-Nonce', arshline_options.nonce),
            success: function(forms) {
                loadingMessage.hide();
                if (forms && forms.length > 0) {
                    tableBody.empty();
                    forms.forEach(form => tableBody.append(renderRow(form)));
                    formsTable.show();
                } else {
                    noFormsMessage.show();
                }
            },
            error: () => loadingMessage.text('خطا در بارگذاری فرم‌ها.').css('color', 'red'),
        });
    }

    // Handle form deletion
    tableBody.on('click', '.button-delete', function() {
        const button = $(this);
        const formId = button.data('form-id');

        if (confirm('آیا از حذف این فرم اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
            $.ajax({
                url: `${arshline_options.rest_url}/${formId}`,
                method: 'DELETE',
                beforeSend: xhr => xhr.setRequestHeader('X-WP-Nonce', arshline_options.nonce),
                success: function() {
                    button.closest('tr').fadeOut(500, function() {
                        $(this).remove();
                        if (tableBody.find('tr').length === 0) {
                            formsTable.hide();
                            noFormsMessage.show();
                        }
                    });
                },
                error: xhr => alert('خطا: ' + (xhr.responseJSON ? xhr.responseJSON.message : 'خطا در حذف فرم.')),
            });
        }
    });

    // Handle status toggle
    tableBody.on('click', '.button-toggle-status', function() {
        const button = $(this);
        const formId = button.data('form-id');
        const newStatus = button.data('new-status');

        button.prop('disabled', true).text('...');

        $.ajax({
            url: `${arshline_options.rest_url}/${formId}`,
            method: 'PUT',
            contentType: 'application/json',
            beforeSend: xhr => xhr.setRequestHeader('X-WP-Nonce', arshline_options.nonce),
            data: JSON.stringify({ status: newStatus }),
            success: function(updatedForm) {
                // Re-render the single row with updated data
                const newRow = renderRow(updatedForm);
                button.closest('tr').replaceWith(newRow);
            },
            error: function(xhr) {
                alert('خطا: ' + (xhr.responseJSON ? xhr.responseJSON.message : 'خطا در تغییر وضعیت.'));
                // Restore button on error
                const originalText = newStatus === 'publish' ? 'لغو انتشار' : 'انتشار';
                button.prop('disabled', false).text(originalText);
            }
        });
    });

    fetchForms();
});