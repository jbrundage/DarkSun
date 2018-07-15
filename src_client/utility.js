let original_ajax = $.ajax;
$.ajax = function(){
    let obj = arguments[0];
    window.g_session_key = typeof g_session_key !== "undefined" ? g_session_key : "";
    let orig_success = obj.success;
    obj.success = function(resp){
        console.log('in pre-success');
        console.info(`resp`,resp);
        if (typeof resp !== "undefined") {
            if (typeof resp.key !== "undefined") {
                window.g_session_key = resp.key;
                console.info(`g_session_key:`,g_session_key);
            }
            if (typeof resp.json !== "undefined") {
                window.g_session = JSON.parse(resp.json);
                console.info(`g_session:`,g_session);
            }
        }
        orig_success.apply(this,arguments);
    }
    obj.complete = function(resp){
        if (typeof resp === "object") {
            if (typeof resp.responseJSON !== "undefined") {
                if (typeof resp.responseJSON.key !== "undefined") {
                    window.g_session_key = resp.responseJSON.key;
                    console.info(`g_session_key:`,g_session_key);
                }
                if (typeof resp.responseJSON.json !== "undefined") {
                    window.g_session = JSON.parse(resp.responseJSON.json);
                    console.info(`g_session:`,g_session);
                }
            }
        } else {
            console.error("resp is not an object");
            console.log(resp);
        }
    }
    if(typeof obj === "object"){
        if(typeof obj.data === "object"){
            obj.data.session_key = g_session_key;
        }
        else if(typeof obj.data === "string"){
            if(obj.data.length > 0){
                obj.data += '&session_key='+g_session_key;
            } else {
                obj.data = 'session_key='+g_session_key;
            }
        }
        original_ajax.apply(this, arguments);
    }
}

function send_form(elm){
    event.preventDefault();
    let $form = $(elm).closest('form');
    let form_action = $form.attr('action');
    $.ajax({
        url: form_action,
        type: "post",
        data: $form.serialize(),
        success: function(resp){
            console.log(resp);
            let function_name;
            try{
                function_name = $form.attr("data-success");
                if($form.attr("data-success")){
                    window[function_name](resp);
                }
            } catch (e) {
                console.info(`function_name`,function_name);
                console.info(`e`,e);
                show_login_form();
            }
        },
        error: function(resp){
            console.error(resp);
            let function_name;
            try{
                function_name = $form.attr("data-error");
                if($form.attr("data-error")){
                    window[function_name](resp);
                }
            } catch (e) {
                console.info(`function_name`,function_name);
                console.info(`e`,e);
            }
        },
    })
}