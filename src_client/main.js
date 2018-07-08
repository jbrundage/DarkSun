let original_ajax = $.ajax;
$.ajax = function(){
    let obj = arguments[0];
    window.g_session_key = typeof g_session_key !== "undefined" ? g_session_key : "";
    obj.complete = function(resp){
        console.log("complete:");
        console.log(typeof resp === "object");
        console.log(typeof resp.key !== "undefined");
        console.info(`resp.key`,resp.key);
        console.info(`resp`,resp);
        if (typeof resp === "object") {
            if (typeof resp.responseJSON !== "undefined") {
                if (typeof resp.responseJSON.key !== "undefined") {
                    window.g_session_key = resp.responseJSON.key;
                    console.info(`g_session_key:`,g_session_key);
                }
            }
        }
    }
    if(typeof obj === "object"){
        if(typeof obj.data === "object"){
            //TODO: attach session to request object
            obj.data.session_key = g_session_key;
        }
        else if(typeof obj.data === "string"){
            if(obj.data.length > 0){
                //TODO: attach session to request string
                obj.data += '&session_key='+g_session_key;
            } else {
                obj.data = 'session_key='+g_session_key;
            }
        }
        original_ajax.apply(this, arguments);
    }
}

function save_form(elm){
    let form = $(elm).closest('form');
    let form_action = form.attr('action');
    $.ajax({
        url: form_action,
        type: "post",
        data: form.serialize(),
        success: function(resp){
            console.log(resp);
        },
        error: function(resp){
            console.error(resp);
        },
    })
}