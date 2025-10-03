jQuery(document).ready(function($) {
    const tableBody = $('#forms-table-body');
    const loadingMessage = $('#loading-message');
    const noFormsMessage = $('#no-forms-message');
    const formsTable = $('#forms-table');

    function fetchForms() {
        $.ajax({
            url: tahlilgar_management_data.rest_url,
            method: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', tahlilgar_management_data.nonce);
            },
            success: function(forms) {
                loadingMessage.hide();
                if (forms && forms.length > 0) {
                    tableBody.empty(); // Clear existing rows
                    forms.forEach(function(form) {
                        const row = `
                            <tr data-form-id="${form.id}">
                                <td>${form.title}</td>
                                <td><input type="text" value='${form.shortcode}' readonly onfocus="this.select();" style="width: 100%; border: 1px solid #ccc; padding: 5px; background: #f9f9f9;"></td>
                                <td>${form.submission_count}</td>
                                <td>${new Date(form.date.replace(' ', 'T')).toLocaleDateString('fa-IR')}</td>
                                <td class="actions">
                                    <a href="${form.results_link}" class="button">مشاهده نتایج</a>
                                    <button class="button button-delete" data-form-id="${form.id}">حذف</button>
                                </td>
                            </tr>
                        `;
                        tableBody.append(row);
                    });
                    formsTable.show();
                } else {
                    noFormsMessage.show();
                }
            },
            error: function() {
                loadingMessage.text('خطا در بارگذاری فرم‌ها.').css('color', 'red');
            }
        });
    }

    // Handle form deletion
    tableBody.on('click', '.button-delete', function() {
        const button = $(this);
        const formId = button.data('form-id');

        if (confirm('آیا از حذف این فرم اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
            $.ajax({
                url: `${tahlilgar_management_data.rest_url}/${formId}`,
                method: 'DELETE',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', tahlilgar_management_data.nonce);
                },
                success: function(response) {
                    // Remove the row from the table
                    button.closest('tr').fadeOut(500, function() {
                        $(this).remove();
                        if (tableBody.find('tr').length === 0) {
                            formsTable.hide();
                            noFormsMessage.show();
                        }
                    });
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'خطا در حذف فرم.';
                    alert('خطا: ' + errorMsg);
                }
            });
        }
    });

    // Initial fetch
    fetchForms();
});