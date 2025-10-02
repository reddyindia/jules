jQuery(document).ready(function($) {
    'use strict';

    const container = $('#form-management-table');
    if (container.length === 0) {
        return;
    }

    async function loadForms() {
        if (typeof tahlilgar_management_data === 'undefined') {
            container.html('<p style="color: red;">Error: Management data object not found.</p>');
            return;
        }

        const { rest_url, nonce } = tahlilgar_management_data;

        try {
            const response = await fetch(rest_url, {
                headers: {
                    'X-WP-Nonce': nonce
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An unknown error occurred.');
            }

            const forms = await response.json();

            if (forms.length === 0) {
                container.html('<p>هنوز هیچ فرمی ساخته نشده است. برای شروع، به صفحه «فرم‌ساز» بروید و اولین فرم خود را بسازید.</p>');
                return;
            }

            renderFormsTable(forms);

        } catch (error) {
            console.error('Error loading forms:', error);
            container.html(`<p style="color: red;">خطا در بارگذاری فرم‌ها: ${error.message}</p>`);
        }
    }

    function renderFormsTable(forms) {
        const table = `
            <table class="wp-list-table widefat striped">
                <thead>
                    <tr>
                        <th>عنوان فرم</th>
                        <th>شورت‌کد (برای کپی و استفاده)</th>
                        <th>تعداد پاسخ‌ها</th>
                        <th>عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    ${forms.map(form => `
                        <tr>
                            <td><strong>${form.title}</strong><br><small>ایجاد شده در: ${form.date}</small></td>
                            <td><input type="text" value="${form.shortcode}" readonly onfocus="this.select();" style="width: 100%; text-align: left; direction: ltr; font-family: monospace; padding: 5px;"></td>
                            <td>${form.submission_count}</td>
                            <td>
                                <a href="${form.results_link}" class="button button-primary button-small">مشاهده نتایج</a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        container.html(table);
    }

    loadForms();
});