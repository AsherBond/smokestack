var smokeTestsTabId = 0;
var smokeTestsIntervalId = setInterval(refreshSmokeTest, 60000);

function refreshSmokeTest() { 

    var nav_class = $('#nav_smoke_tests').attr('class');
    if (nav_class == 'active') {
        reload_smoke_tests_table($("#smoke-tests-table"));
    } 

}

function reload_smoke_tests_table(container) {

    $.ajax({
        url: '/smoke_tests?table_only=true',
        type: 'GET',
        success: function(data) {
            container.html(data);
            smoke_test_table_selectors();
        }
    });

}

function smoke_test_selectors() {

    $("#smoke-test-new-button").click(function(e){
         e.preventDefault();

         $.get('/smoke_tests/new', function(html_snippet) {

           $("#smoke-tests-dialog").html(
               html_snippet
           );

            $("#smoke-tests-dialog").dialog({
                modal: true,
                height: $(window).height()-50,
                width: $(window).width()-50,
                buttons: {
                    Create: function() { smoke_test_create_or_edit('POST') }
                },
                close: function(data) {
                    $(this).html("");
                    $(this).dialog('destroy');
                }
            });

        });

    });

}

function smoke_test_table_selectors() {

    $(".smoke-test-destroy").click(function(e){

        e.preventDefault();

        if (!confirm("Delete smoke test?")) {
            return;
        }

        var post_data = $("#smoke-test-delete-form").serialize();

        $.ajax({
            url: $(this).attr("href"),
            type: 'POST',
            dataType: 'xml',
            data: post_data,
            success: function(data) {
                id=$("id", data).text();
                $("#smoke-test-tr-"+id).remove();
            },
            error: function(data) {
                alert('Error: Failed to destroy smoke test.');
            }
        });

    });

    $(".smoke-test-edit").click(function(e){
         e.preventDefault();

         $.get($(this).attr("href"), function(html_snippet) {

           $("#smoke-tests-dialog").html(
                html_snippet
           );

            $("#smoke-tests-dialog").dialog({
                modal: true,
                height: $(window).height()-50,
                width: $(window).width()-50,
                buttons: {
                    Save: function() { smoke_test_create_or_edit('PUT'); }
                },
                close: function(data) {
                    $(this).html("");
                    $(this).dialog('destroy');
                }
            });

         });

       });

    $(".smoke-test-show").click(function(e){
         e.preventDefault();

         $.get($(this).attr("href"), function(html_snippet) {

           $("#smoke-tests-dialog").html(
                html_snippet
           );

            $("#smoke-tests-dialog").dialog({
                modal: true,
                height: $(window).height()-50,
                width: $(window).width()-50,
                buttons: {
                    Close: function() {
                        $(this).dialog('close');
                    }
                },
                close: function(data) {
                    $(this).html("");
                    $(this).dialog('destroy');
                }
            });

         });

       });

    $(".smoke-test-run-jobs").click(function(e){
         e.preventDefault();

        var post_data = $("#smoke-test-job-form").serialize();

        $.ajax({
            url: $(this).attr("href"),
            type: 'POST',
            data: post_data,
            success: function(data) {
                alert('Job(s) scheduled.');
                reload_smoke_tests_table($("#smoke-tests-table"));
            },
            error: function(data) {
                alert('Error: Failed to schedule job.');
            }
        });

       });

}

function smoke_test_create_or_edit(method) {

    var post_data = $("#smoke-test-form").serialize();
    $.ajax({
        url: $("#smoke-test-form").attr("action"),
        type: method,
        data: post_data,
        dataType: 'xml',
        success: function(data) {
            $("#smoke-tests-dialog").dialog('close');
            reload_smoke_tests_table($("#smoke-tests-table"));
        },
        error: function(data, textStatus, errorThrow) {
            err_html="<div class='alert alert-error' id='smoke-test-error-messages'><ul>";
            $("error", data.responseXML).each (function() {
                err_html+="<li>"+$(this).text()+"</li>";
            });
            err_html+="</ul></div>";
            $("#smoke-test-error-messages").replaceWith(err_html);
        }
    });

}
