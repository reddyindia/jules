jQuery(document).ready(function($) {
    'use strict';

    const container = $('#results-display-area');
    if (container.length === 0) {
        return;
    }

    // Get form_id from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('form_id');

    if (!formId) {
        container.html('<p>شناسه فرم مشخص نشده است. لطفاً از صفحه "مدیریت فرم‌ها" یک فرم را برای مشاهده نتایج انتخاب کنید.</p>');
        return;
    }

    async function loadResults() {
        if (typeof tahlilgar_results_data === 'undefined' || !tahlilgar_results_data.nonce) {
            container.html('<p style="color: red;">خطا: اطلاعات لازم برای بارگذاری نتایج در دسترس نیست.</p>');
            return;
        }

        const restUrl = tahlilgar_results_data.rest_url_base + formId;
        const nonce = tahlilgar_results_data.nonce;

        container.html('<p>در حال بارگذاری نتایج...</p>');

        try {
            const response = await fetch(restUrl, {
                headers: {
                    'X-WP-Nonce': nonce
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'خطای ناشناخته در دریافت اطلاعات.');
            }

            const submissions = await response.json();

            if (submissions.length === 0) {
                container.html('<p>هنوز هیچ پاسخی برای این فرم ثبت نشده است.</p>');
                return;
            }

            renderSubmissions(submissions);

        } catch (error) {
            console.error('Error loading submissions:', error);
            container.html(`<p style="color: red;">خطا در بارگذاری نتایج: ${error.message}</p>`);
        }
    }

    function renderSubmissions(submissions) {
        const submissionList = submissions.map(sub => `
            <div class="submission-card">
                <div class="submission-header">
                    <h3>${sub.title}</h3>
                    <small>ارسال شده در: ${sub.date}</small>
                </div>
                <div class="submission-content">
                    ${sub.content.replace(/\n/g, '<br>')}
                </div>
            </div>
        `).join('');

        container.html(submissionList);
    }

    loadResults();
});