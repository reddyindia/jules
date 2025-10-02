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

    // Custom Render Templates for our new fields
    const renderTemplates = {
        welcome_page: function(fieldData) {
            let title = fieldData.label ? `<h2>${fieldData.label}</h2>` : '';
            let description = fieldData.description ? `<p>${fieldData.description}</p>` : '';
            return {
                field: `<div class="tahlilgar-welcome-page">${title}${description}</div>`
            };
        },
        end_page: function(fieldData) {
            let title = fieldData.label ? `<h2>${fieldData.label}</h2>` : '';
            let description = fieldData.description ? `<p>${fieldData.description}</p>` : '';
            return {
                field: `<div class="tahlilgar-end-page">${title}${description}</div>`
            };
        },
        question_group: function(fieldData) {
            // formRender automatically renders nested fields. We just provide the fieldset.
            return {
                field: `<fieldset class="tahlilgar-question-group"><legend>${fieldData.label || ''}</legend></fieldset>`
            };
        },
        ranking: function(fieldData) {
             // This is a placeholder render. A real implementation would need JS for drag-drop.
            let options = '';
            if (fieldData.values) {
                fieldData.values.forEach(option => {
                    options += `<li class="list-group-item">${option.label}</li>`;
                });
            }
            return {
                field: `<div class="tahlilgar-ranking">
                            <p>${fieldData.label || ''}</p>
                            <ul class="list-group">${options}</ul>
                            <input type="hidden" name="${fieldData.name}" value="">
                        </div>`
            };
        }
    };

    // Render the form
    formContainer.formRender({
        formData: rendererData.form_json,
        render: {
            templates: renderTemplates
        }
    });

    // Wrap the rendered fields in a form tag with HTMX attributes
    const formFields = formContainer.html();
    const statusDivId = `tahlilgar-form-status-${rendererData.form_id}`;

    const form = $('<form>')
        .attr('hx-post', rendererData.submission_url)
        .attr('hx-ext', 'json-enc') // Use the JSON encoding extension
        .attr('hx-target', `#${statusDivId}`)
        .attr('hx-swap', 'innerHTML')
        .attr('hx-indicator', `#${formContainerId}`)
        .attr('hx-headers', `{"X-WP-Nonce": "${rendererData.nonce}"}`);

    form.html(formFields);
    form.append('<button type="submit" class="tahlilgar-submit-button">ارسال</button>');
    form.append(`<div id="${statusDivId}" class="tahlilgar-form-status" style="margin-top: 15px;"></div>`);

    formContainer.html(form);

    // HTMX needs to be initialized on the new content
    htmx.process(formContainer[0]);

    // On success, we want to replace the whole form, not just the status div.
    formContainer.on('htmx:afterRequest', function(evt) {
        if (evt.detail.successful) {
            try {
                const response = JSON.parse(evt.detail.xhr.responseText);
                if (response.success) {
                    formContainer.html('<div class="tahlilgar-form-success">پاسخ شما با موفقیت ثبت شد. متشکریم!</div>');
                }
            } catch(e) {
                // If response is not JSON, HTMX will have already placed the error string in the target div.
            }
        }
    });
});