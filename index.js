function show_collection(collection_name){

    $(".overlay").remove();
    view_collection(collection_name, function(json_arr){
        const $overlay = $('<div class="overlay" style="height:80%;width:80%;display:none;"></div>');
        $overlay.html(`
            <h2>Viewing all <b>${collection_name}</b> documents</h2>
            <table>
                <thead>${th_cols()}</thead>
                <tbody>${tr_rows()}</tbody>
            </table>
        `)
        $("body").append($overlay);
        $overlay.fadeIn();
        $overlay.css({
            "top": (window.innerHeight/2) - ($overlay.height()/2) + "px",
            "left": (window.innerWidth/2) - ($overlay.width()/2) + "px"
        });
        function th_cols(){
            return `
                ${Object.keys(mongo_json[collection_name]).map(n=>{
                    return `<th>${n}</th>`
                }).join('')}
                <th>...</th>
            `;
        }
        function tr_rows(){
            return `${json_arr.map(document_obj=>{
                const _id = document_obj._id;
                return `
                <tr>
                    ${Object.keys(mongo_json[collection_name]).map(n=>{
                        return `<td>
                        ${typeof document_obj[n] !== "undefined" ? document_obj[n] : ""}
                                </td>`
                    }).join('')}
                    <td>
                        <button class="btn btn-danger" onclick="remove_document('${_id}', '${collection_name}')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            })}
            <tr>
                ${Object.keys(mongo_json[collection_name]).map(n=>{
                    return `<td><input type="text" name="${n}" placeholder="${n}"/></td>`
                }).join('')}
                <td>
                    <button class="btn btn-success" onclick="add_document(this, '${collection_name}')">
                        <i class="fa fa-save"></i>
                    </button>
                </td>
            </tr>`;
        }
    })
}
function remove_document(btn_element, collection_name){
    $.ajax({
        url: "/add_"+collection_name,
        type: "post",
        data: $(btn_element).closest('tr').find('input').serialize(),
        success: function(resp){
            console.log('add_document success callback');
            console.log('resp',resp);
        }
    })
}
function add_document(btn_element, collection_name){
    $.ajax({
        url: "/add_"+collection_name,
        type: "post",
        data: $(btn_element).closest('tr').find('input').serialize(),
        success: function(resp){
            console.log('add_document success callback');
            console.log('resp',resp);
        }
    })
}
function view_collection(collection_name, callback){
    $.ajax({
        url: `/view_${collection_name}`,
        type: "get",
        data: {},
        success: function(resp){
            console.log('add_document success callback');
            console.log('resp',resp);
            if(callback)callback(resp);
        },
        error: function(resp){
            console.error(resp);
        }
    })
}