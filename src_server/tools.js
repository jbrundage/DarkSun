module.exports = {
    api_test_form: function(arr){
        return `
        <div id="api_test_form">
            ${arr.map((row,i)=>{
                let service_action = row[0];
                let service_params = row[1];
                return `<button onclick="api_test('${service_action}','${service_params}')">${service_action}____${service_params}</button>`
            }).join('<br/>')}
        </div>
        `
    }
};