const showEmailResult = async (e) => {
    e.preventDefault();
    console.log("In show email result")
    
    const result = document.getElementById("result");
    console.log("before");
    let response = await getEmailResult();
    console.log("after");
    if (response.status == 200) {
        console.log("inside if");
      result.innerHTML = "Email Successfully Sent";
    } else {
        console.log("other if");
      result.innerHTML = "Sorry, your email was not sent.";
    }
  };
  
  const getEmailResult = async (e) => {

    console.log("in get Email results");

    const form = document.getElementById("contact-form");
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    const result = document.getElementById("result");
    result.innerHTML = "Please wait...";
  
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });
      return response;
    } catch (error) {
      console.log(error);
      document.getElementById("result").innerHTML =
        "Sorry your email couldn't be sent";
    }
  };

  document.getElementById("contact-form").onsubmit = showEmailResult;

