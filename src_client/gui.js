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
                        return `<td data-type="${mongo_json[collection_name][n].type}" data-name="${n}">
                        ${typeof document_obj[n] !== "undefined" ? document_obj[n] : ""}
                                </td>`
                    }).join('')}
                    <td>
                        <button class="btn btn-success icon-btn left save-edit-btn" style="display: none" onclick="update_document(this, '${_id}', '${collection_name}')">
                            <i class="fa fa-save"></i>
                        </button>
                        <button class="btn btn-secondary icon-btn left undo-edit-btn" style="display: none" onclick="undo_edit(this)">
                            <i class="fa fa-undo"></i>
                        </button>
                        <button class="btn btn-warning icon-btn left edit-btn" onclick="edit_document(this)">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-danger icon-btn left remove-btn" onclick="remove_document('${_id}', '${collection_name}')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            })}
            <tr>
                ${Object.keys(mongo_json[collection_name]).map(n=>{
                    let type = mongo_json[collection_name][n].type;
                    return type === "date" ? '<td></td>' : `<td><input type="text" name="${n}" placeholder="${n}"/></td>`
                }).join('')}
                <td>
                    <button class="btn btn-success icon-btn-x2" onclick="add_document(this, '${collection_name}')">
                        <i class="fa fa-save"></i>
                    </button>
                </td>
            </tr>`;
        }
    })
}
function undo_edit(btn_element){
    let $tr = $(btn_element).closest('tr');
    $tr.find('input').each(function(){
        let $inp = $(this);
        let $td = $inp.closest('td');
        $td.text($inp.data('orig'));
        $inp.remove();
    });
    $tr.find('.save-edit-btn,.undo-edit-btn').hide();
    $tr.find('.remove-btn,.edit-btn').show();
}
function edit_document(btn_element){
    let $tr = $(btn_element).closest('tr');
    $tr.find('td[data-type="number"],td[data-type="string"]').each(function(){
        let $td = $(this);
        let _name = $(this).data('name');
        let _value = $.trim($td.text());
        $td.html(`<input type="text" data-orig="${_value}" name="${_name}" placeholder="${_name}" value="${_value}"/>`)
    });
    $tr.find('.save-edit-btn,.undo-edit-btn').show();
    $tr.find('.remove-btn,.edit-btn').hide();
}
function update_document(btn_element, _id, collection_name){
    $.ajax({
        url: "/update_"+collection_name,
        type: "post",
        data: $(btn_element).closest('tr').find('input').serialize(),
        success: function(resp){
            console.log('update_document success callback');
            console.log('resp',resp);
        }
    })
}
function remove_document(_id, collection_name){
    $.ajax({
        url: "/remove_"+collection_name,
        type: "post",
        data: '_id='+_id,
        success: function(resp){
            console.log('remove_document success callback');
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