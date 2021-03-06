var jobsTabId = 1;
var jobsIntervalId = setInterval(refreshJobs, 60000);

function refreshJobs() {

    var nav_class = $('#nav_jobs').attr('class');
    if (nav_class == 'active') {
        reload_jobs_table($("#jobs-table"));
    }

}

function reload_jobs_table(container) {

    search = window.location.search;
    if ( search == '' ) {
      search = "?table_only=true"
    } else {
      search += "&table_only=true"
    }

    $.ajax({
        url: '/jobs' + search,
        type: 'GET',
        success: function(data) {
            container.html(data);
            job_table_selectors();
        }
    });

}

function job_update(job_id, post_data) {

    $.ajax({
        url: '/jobs/'+job_id,
        type: 'PUT',
        dataType: 'xml',
        data: post_data,
        success: function(data) {
            id=$("id", data).text();
        },
        error: function(data) {
            alert('Error: Failed to update job.');
        }
    });

}

function job_table_selectors() {

    $(".job-destroy").click(function(e){

        e.preventDefault();

        if (!confirm("Delete job?")) {
            return;
        }

        var post_data = $("#job-delete-form").serialize();

        $.ajax({
            url: $(this).attr("href"),
            type: 'POST',
            dataType: 'xml',
            data: post_data,
            success: function(data) {
                id=$("id", data).text();
                $(".job-tr-"+id).remove();
            },
            error: function(data) {
                alert('Error: Failed to destroy job.');
            }
        });

    });

    $(".job-show").click(function(e){
         e.preventDefault();

         $.get($(this).attr("href"), function(html_snippet) {

           $("#jobs-dialog").html(
                html_snippet
           );

            $("#jobs-dialog").dialog({
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

    $(".job-clone").click(function(e){

        e.preventDefault();
        var post_data = $("#job-clone-form").serialize();

        $.ajax({
            url: $(this).attr("href"),
            type: 'POST',
            data: post_data,
            dataType: 'json',
            success: function(data) {
                reload_jobs_table($("#jobs-table"));
                alert('Job cloned.');
            },
            error: function(data) {
                alert('Failed to clone job.');
            }
        });

       });

/*
    #row clicking (disabled for now)
    $('table.data tr td').not($('table.data tr td.noclick')).click(function() {
        var href = $(this).parent().find("a").attr("href");
        if(href) {
        }
    });
*/

}
