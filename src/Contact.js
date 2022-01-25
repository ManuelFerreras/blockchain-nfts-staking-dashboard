import React from "react";

var sendButton;

var data_js = {
    "access_token": "wkocloz5j6ujexf9uuy6gyhx" // sent after you sign up
};

function js_onSuccess() {
    alert("Email sent successfully!");
}

function js_onError(error) {
    console.log("Error:" + error);
}

function js_send() {
    sendButton = document.getElementById("js_send");
    sendButton.value='Sending…';
    sendButton.disabled=true;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            js_onSuccess();
        } else
        if(request.readyState == 4) {
            js_onError(request.response);
        }
    };

    var subject = "Piggy Bank";
    var message = `${document.querySelector('#name').value} ${document.querySelector('#email').value} ${document.querySelector('#message').value}`;
    data_js['subject'] = subject;
    data_js['text'] = message;
    var params = toParams(data_js);

    request.open("POST", "https://postmail.invotes.com/send", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.send(params);

    return false;
}


function toParams(data_js) {
    var form_data = [];
    for ( var key in data_js ) {
        form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
    }

    return form_data.join("&");
}


export default ({ withdrawFunds, login, connected, setConnected, accountBalance, contractBalance, accountStoredBalance, openDashboardMenu }) => {

    const checkValue = e => {
        if(isNaN(parseFloat(e.target.value))) {
            return false;
        } else {
            return true;
        }
    }

    const changedValue = e => {
        if(!checkValue(e)) {
            e.target.value = 0;
        } else {
            if(e.target.value[e.target.value.length - 1] != '.') {
                e.target.value = parseFloat(e.target.value);
                if(e.target.value > parseFloat(accountStoredBalance)) {
                    e.target.value = parseFloat(accountStoredBalance);
                }
                if(e.target.value < 0) {
                    e.target.value = 0;
                }
            }
        }
    }

    const sendMail = () => {

        

    }

    return(

        <div className='container dashboard'>
            
            <div className='dashboardBg'>
                <h2 className='text-center dashboardHeader'>Contact</h2>

                <form onSubmit={e => e.preventDefault()} id="contact-form" className="contact-form col">
                    <div className="form-field row x-50">
                        <label className="label" htmlFor="name">Name</label>
                        <input id="name" className="input-text js-input" type="text"  required/>
                    </div>
                    <div className="form-field row x-50">
                        <label className="label" htmlFor="email">E-mail</label>
                        <input id="email" className="input-text js-input" type="email" required/>
                    </div>
                    <div className="form-field row x-100">
                        <label className="label" htmlFor="message">Message</label>
                        <input id="message" className="input-text js-input" type="text" required/>
                    </div>
                    <div className="form-field row x-100 align-center">
                        <input id="js_send" className="submit-btn js_send" type="submit" value="Submit" onClick={() => js_send()} />
                    </div>
                </form>
            </div>
        </div>

    );

}