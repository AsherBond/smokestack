var smokeTestsTabId = 0;
var smokeTestsIntervalId = setInterval(refreshSmokeTest, 6000);

function refreshSmokeTest() { 

	var selected = $("#tabs").tabs( "option", "selected" );
	if (selected == smokeTestsTabId) {
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
		},
		error: function(data) {
			alert('Failed to load smoke tests.'+data);
		}
	});

}

function smoke_test_selectors() {

    $("#smoke-test-new-link").click(function(e){
         e.preventDefault();

         $.get($(this).attr("href"), function(html_snippet) {

           $("#smoke-tests-dialog").html(
               html_snippet
           );

            $("#smoke-tests-dialog").dialog({
                modal: true,
                height: 400,
                width: 600,
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

	$("#smoke-test-new-link").button({
				icons: {
					primary: 'ui-icon-circle-plus'
				}
	}
	);

	$("a.smoke-test-run-job").button({
		icons: {
			primary: 'ui-icon-play'
		}
	}
	);

	$("a.smoke-test-destroy").button({
		icons: {
			primary: 'ui-icon-trash'
		},
		text: false
	}
	);

	$("a.smoke-test-edit").button({
		icons: {
			primary: 'ui-icon-wrench'
		},
		text: false
	}
	);

	$("a.smoke-test-show").button({
		icons: {
			primary: 'ui-icon-circle-zoomin'
		},
		text: false
	}
	);

	$(".smoke-test-destroy").click(function(e){

		e.preventDefault();

		if (!confirm("Delete smoke test?")) {
			return;
		}

		$.ajax({
			url: $(this).attr("href"),
			type: 'POST',
			dataType: 'xml',
			data: { _method: 'delete' },
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
                height: 400,
                width: 600,
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
                height: 400,
                width: 600,
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

    $(".smoke-test-run-job").click(function(e){
         e.preventDefault();

         $.post($(this).attr("href"), function(html_snippet) {

			alert('Job scheduled.');
			reload_smoke_tests_table($("#smoke-tests-table"));

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
            id=$("id", data).text();
            $("#smoke-tests-dialog").dialog('close');
			reload_smoke_tests_table($("#smoke-tests-table"));
        },
        error: function(data) {
            err_html="<ul>";
            $("error", data.responseXML).each (function() {
                err_html+="<li>"+$(this).text()+"</li>";
            });
            err_html+="</ul>";
            $("#smoke-test-error-messages-content").html(err_html);
            $("#smoke-test-error-messages").css("display", "inline");
        }
    });

}