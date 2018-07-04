function api_test(action,param_str){
    // if(action.indexOf('create_user')!==-1){
    //     param_str = param_str.split('test123').join('test'+(new Date().getTime()));
    // }
    $.ajax({
        url: action,
        type: "post",
        data: param_str,
        success: function(resp){
            console.log(resp);
        },
        error: function(resp){
            console.error(resp);
        }
    })
}