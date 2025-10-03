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
                            <tr>
                                <td>${form.title}</td>
                                <td><input type="text" value='${form.shortcode}' readonly onfocus="this.select();" style="width: 100%; border: 1px solid #ccc; padding: 5px; background: #f9f9f9;"></td>
                                <td>${form.submission_count}</td>
                                <td>${new Date(form.date).toLocaleDateString('fa-IR')}</td>
                                <td class="actions">
                                    <a href="${form.results_link}">مشاهده نتایج</a>
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

    // Initial fetch
    fetchForms();
});