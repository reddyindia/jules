jQuery(document).ready(function($) {
    const submissionsList = $('#submissions-list');
    const loadingMessage = $('#loading-message');
    const noSubmissionsMessage = $('#no-submissions-message');

    // Get form_id from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('form_id');

    if (!formId) {
        loadingMessage.text('خطا: شناسه فرم مشخص نشده است.').css('color', 'red');
        return;
    }

    function fetchSubmissions() {
        $.ajax({
            url: tahlilgar_results_data.rest_url_base + formId,
            method: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', tahlilgar_results_data.nonce);
            },
            success: function(submissions) {
                loadingMessage.hide();
                if (submissions && submissions.length > 0) {
                    submissionsList.empty(); // Clear existing content
                    submissions.forEach(function(submission) {
                        const card = `
                            <div class="submission-card">
                                <div class="submission-card-header">
                                    <h3>${submission.title}</h3>
                                    <span>${new Date(submission.date).toLocaleString('fa-IR')}</span>
                                </div>
                                <div class="submission-content">
                                    ${submission.content.replace(/\n/g, '<br>')}
                                </div>
                            </div>
                        `;
                        submissionsList.append(card);
                    });
                } else {
                    noSubmissionsMessage.show();
                }
            },
            error: function() {
                loadingMessage.text('خطا در بارگذاری نتایج.').css('color', 'red');
            }
        });
    }

    // Initial fetch
    fetchSubmissions();
});